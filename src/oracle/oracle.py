#!/usr/bin/env python3
import pandas as pd
import argparse
import sys
import csv

def load_char_db():
    return pd.read_csv("data/char_db.csv")


def load_stroke_encodings():
    """Load stroke encodings mapping from strokes to latin char"""
    encodings = {}
    with open('data/stroke_encodings.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            strokes = row['strokes'].strip()
            char = row['char'].strip()
            if strokes and char:
                if strokes not in encodings:
                    encodings[strokes] = []
                encodings[strokes].append(char)
    return encodings


def apply_character_swaps(encoding):
    """Apply character swaps: i → l, l → \, j → /"""
    return encoding.replace('l', '\\').replace('i', 'l').replace('j', '/')


def prompt_user_choice(char, current_encoding, new_encoding_options):
    """Prompt user to choose between encoding options when there's a clash"""
    print(f"\n🔥 CLASH DETECTED for char: '{char}'")
    print(f"Current encoding: '{current_encoding}'")
    print("New encoding options:")

    # Create numbered list of options
    options = []
    for i, option in enumerate(new_encoding_options, 1):
        print(f"  {i}. {option}")
        options.append(option)

    while True:
        try:
            user_input = input("\nChoose option number (1-{}) or enter custom encoding in quotes: ".format(len(options))).strip()

            # Check if it's a quoted custom string
            if user_input.startswith('"') and user_input.endswith('"'):
                return user_input[1:-1]  # Remove quotes
            elif user_input.startswith("'") and user_input.endswith("'"):
                return user_input[1:-1]  # Remove quotes

            # Check if it's a valid number
            choice_num = int(user_input)
            if 1 <= choice_num <= len(options):
                return options[choice_num - 1]
            else:
                print(f"Please enter a number between 1 and {len(options)}, or a quoted string.")
        except ValueError:
            print("Please enter a valid number or quoted string.")


def greedy_encode(strokes, encodings, char="", current_encoding="", interactive=False):
    """Greedily recreate encoding from strokes using available encodings"""
    if not strokes:
        return ""

    # Try to find longest matching prefix
    result = ""
    i = 0
    strokes = apply_character_swaps(strokes)
    while i < len(strokes):
        found_match = False
        # Try longest matches first (greedy approach)
        for length in range(len(strokes) - i, 0, -1):
            substring = strokes[i:i+length]
            if substring in encodings:
                matches = encodings[substring]
                if len(matches) == 1:
                    result += matches[0]
                else:
                    # Multiple options - handle based on interactive mode
                    unique_matches = list(set(matches))
                    if len(unique_matches) == 1:
                        result += unique_matches[0]
                    else:
                        if interactive and char and current_encoding:
                            # Prompt user for choice
                            chosen_encoding = prompt_user_choice(char, current_encoding, unique_matches)
                            result += chosen_encoding
                        else:
                            # Default behavior - bracket options
                            result += "(" + "/".join(unique_matches) + ")"
                i += length
                found_match = True
                break

        if not found_match:
            # If no match found, add the character as-is and move forward
            result += strokes[i]
            i += 1

    return result


def gen_tokens(interactive=False):
    """Generate tokens by recreating encodings from strokes"""
    # Load stroke encodings
    encodings = load_stroke_encodings()
    print(f"Loaded {len(encodings)} stroke encodings")

    # Load tokens
    tokens_df = pd.read_csv('data/token_db.csv')

    # Create new encoding column and track mismatches
    new_encodings = []
    mismatches = []
    for idx, row in tokens_df.iterrows():
        strokes = str(row['strokes']) if pd.notna(row['strokes']) else ""
        old_encoding = str(row['encoding']) if pd.notna(row['encoding']) else ""
        char = str(row['character']) if 'character' in row and pd.notna(row['character']) else f"Row {idx}"

        # First pass - check if there would be a clash
        temp_encoding = greedy_encode(strokes, encodings)

        # If interactive mode and there's a potential clash with parentheses, handle it
        if interactive and "(" in temp_encoding and ")" in temp_encoding and old_encoding != temp_encoding:
            new_encoding = greedy_encode(strokes, encodings, char, current_encoding=old_encoding, interactive=True)
        else:
            new_encoding = temp_encoding

        new_encodings.append(new_encoding)
        if old_encoding != new_encoding:
            mismatches.append(old_encoding)
        else:
            mismatches.append("")

    # Replace existing encoding column and add mismatch column
    tokens_df['encoding'] = new_encodings
    tokens_df['mismatch'] = mismatches

    # Save to show_me.csv
    tokens_df.to_csv('show_me.csv', index=False)
    print(f"\nSaved results to show_me.csv with {len(tokens_df)} rows")

    # Show comparison stats and differences
    mismatch_count = sum(1 for m in mismatches if m != "")
    matches = len(tokens_df) - mismatch_count
    print(f"Exact matches: {matches}/{len(tokens_df)} ({matches/len(tokens_df)*100:.1f}%)")

    # Print differences
    print("\nDifferences:")
    for i, mismatch in enumerate(mismatches):
        if mismatch != "":
            print(f"Row {i}: Expected '{mismatch}' -> Actual '{new_encodings[i]}'")

    return tokens_df


def update_encoding(tokens_path, use_strokes=False):
    char_df = load_char_db()
    tokens_df = pd.read_csv(tokens_path)

    column_name = "strokes" if use_strokes == "true" else "encoding"
    char_to_code = dict(zip(tokens_df["character"], tokens_df[column_name]))

    def replace_chars(composition):
        if pd.isna(composition):
            return composition
        result = ""
        for char in composition:
            next_char = str(char_to_code.get(char, char))
            result += "." + next_char
        return result

    char_df["retokenized"] = char_df["composition"].apply(replace_chars)

    # Handle "No steps" characters - add encodings directly from tokens
    no_steps_mask = char_df["decomposition"] == "No steps"
    for idx, row in char_df[no_steps_mask].iterrows():
        char = row["character"]
        if char in char_to_code:
            char_df.loc[idx, "encoding"] = "." + str(char_to_code[char])

    # Update encoding column with retokenized values when retokenized is not null/NaN
    mask = ~pd.isna(char_df["retokenized"])
    char_df.loc[mask, "encoding"] = char_df.loc[mask, "retokenized"]

    # Save the updated dataframe back to CSV
    char_df.to_csv("data/char_db.csv", index=False)

    return char_df


def list_dupes(dict_path, ignore_variants=False):
    encoding_to_chars = {}

    try:
        with open(dict_path, 'r', encoding='utf-8') as f:
            for line in f:
                parts = line.strip().split('\t')
                if len(parts) >= 2:
                    encoding = parts[0]
                    character = parts[1]

                    if encoding not in encoding_to_chars:
                        encoding_to_chars[encoding] = []
                    encoding_to_chars[encoding].append(character)
    except FileNotFoundError:
        print(f"Error: Dictionary file '{dict_path}' not found")
        return
    except Exception as e:
        print(f"Error reading dictionary file: {e}")
        return

    # Find encodings with multiple characters
    duplicates_found = False
    for encoding, chars in encoding_to_chars.items():
        if len(chars) > 1:
            duplicates_found = True
            print(f"Encoding '{encoding}': {', '.join(chars)}")

    if not duplicates_found:
        print("No characters found with the same encoding")


def gen_dict():
    # Load char_db.csv and filter rows with non-null encoding
    filtered_rows = []

    with open('data/char_db.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Filter rows where 'encoding' column is not null/empty
            if row['encoding'] and row['encoding'].strip():
                filtered_rows.append(row)

    # First pass: Create initial dict with minimal cleaning (preserve composition chars)
    seen_compositionless_encodings = set()
    compositionless_encodings_with_duplicates = set()
    initial_dict = {}
    for row in filtered_rows:
        encoding = row['encoding']\
                .strip()\
                .replace("V", "")\
                .replace("A", "")\
                .replace("B", "")\
                .replace(".", "")

        # Remove composition chars that occur after the first char
        if len(encoding) > 1:
            encoding = encoding[0] + encoding[1:]\
                    .replace(")", "")\
                    .replace("|", "")\
                    .replace("_", "")
            if encoding[1:] in seen_compositionless_encodings:
                compositionless_encodings_with_duplicates.add(encoding[1:])
                print(encoding)
            else:
                seen_compositionless_encodings.add(encoding[1:])

        # Use list to handle multiple characters per encoding
        if encoding not in initial_dict:
            initial_dict[encoding] = []
        initial_dict[encoding].append(row['character'])

    # Second pass: Check if we can safely remove the prefixing composition char.
    final_dict = {}
    for encoding, characters in initial_dict.items():
        final_encoding = encoding
        if len(encoding) > 1 and encoding[1:] not in compositionless_encodings_with_duplicates:
            final_encoding = encoding[1:]

        if final_encoding not in final_dict:
            final_dict[final_encoding] = []
        final_dict[final_encoding].extend(characters)

    # Write final dictionary with one row per character
    with open('dict.txt', 'w', encoding='utf-8') as f:
        total_entries = 0
        for encoding, characters in final_dict.items():
            for character in characters:
                f.write(f"{encoding}\t{character}\t名詞\n")
                total_entries += 1
                # if 'X' in encoding:
                #     stripped = encoding.replace('X', '')
                #     f.write(f"{stripped}\t{character}\t名詞\n")
                #     total_entries += 1

    print(f"Generated dict.txt with {total_entries} entries")


def gen_prefix_dict():
    entries = []
    with open('dict.txt', 'r', encoding='utf-8') as f:
        for line in f:
            parts = line.strip().split('\t')
            if len(parts) >= 2:
                entries.append(parts)

    prefix_map = {}

    for entry in entries:
        key = entry[0]
        tag = entry[2] if len(entry) > 2 else '名詞'

        length = 1
        while True:
            prefix = key[:length]
            if prefix not in prefix_map:
                prefix_map[prefix] = entry
                break
            existing = prefix_map[prefix]
            if existing[0] == key:
                # Same full key, no resolution possible — keep both
                prefix_map[prefix + f'__dup_{id(entry)}'] = entry
                break
            # Clash — bump existing entry to longer prefix, try again for both
            del prefix_map[prefix]
            existing_new_len = len(prefix) + 1
            existing_prefix = existing[0][:existing_new_len]
            prefix_map[existing_prefix] = existing
            length += 1

    with open('dict_prefix.txt', 'w', encoding='utf-8') as f:
        total = 0
        for prefix, entry in prefix_map.items():
            if '__dup_' in prefix:
                prefix = entry[0]
            tag = entry[2] if len(entry) > 2 else '名詞'
            f.write(f"{prefix}\t{entry[1]}\t{tag}\n")
            total += 1

    print(f"Generated dict_prefix.txt with {total} entries")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", nargs="?", help="Command to run (gen-dict, list-dupes, gen-tokens)")
    parser.add_argument("-t", help="Path to tokens.csv", default="data/tokens.csv")
    parser.add_argument("--use-strokes", help="Use the character's strokes as the code")
    parser.add_argument("-d", "--dict", help="Path to dictionary file", default="dict.txt")
    parser.add_argument("--ignore-variants", action="store_true", help="Ignore traditional/simplified variants when listing duplicates")
    parser.add_argument("-i", "--interactive", action="store_true", help="Enable interactive mode for encoding clashes")

    args = parser.parse_args()

    if args.command == "gen-dict":
        gen_dict()
        gen_prefix_dict()
    elif args.command == "list-dupes":
        list_dupes(args.dict, args.ignore_variants)
    elif args.command == "gen-tokens":
        result_df = gen_tokens(args.interactive)
        return result_df
    elif args.command == "update-encoding":
        result_df = update_encoding(args.t, args.use_strokes)
        print(result_df[["character", "composition", "retokenized"]].head(20))
        return result_df
    else:
        char_df = load_char_db()
        print(f"Loaded {len(char_df)} characters")
        print(char_df.head(20))
        return char_df


if __name__ == "__main__":
    main()
