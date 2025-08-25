#!/usr/bin/env python3
import pandas as pd
import argparse
import sys
import csv

def load_char_db():
    return pd.read_csv("data/char_db.csv")


def update_encoding(tokens_path, use_strokes=False):
    char_df = load_char_db()
    tokens_df = pd.read_csv(tokens_path)

    column_name = "strokes" if use_strokes == "true" else "code"
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
                .replace("S", "")\
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

    print(f"Generated dict.txt with {total_entries} entries")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", nargs="?", help="Command to run (gen-dict, list-dupes)")
    parser.add_argument("-t", help="Path to tokens.csv", default="data/tokens.csv")
    parser.add_argument("--use-strokes", help="Use the character's strokes as the code")
    parser.add_argument("-d", "--dict", help="Path to dictionary file", default="dict.txt")
    parser.add_argument("--ignore-variants", action="store_true", help="Ignore traditional/simplified variants when listing duplicates")

    args = parser.parse_args()

    if args.command == "gen-dict":
        gen_dict()
    elif args.command == "list-dupes":
        list_dupes(args.dict, args.ignore_variants)
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
