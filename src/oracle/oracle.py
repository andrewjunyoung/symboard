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
    
    # Update encoding column with retokenized values when retokenized is not null/NaN
    mask = ~pd.isna(char_df["retokenized"])
    char_df.loc[mask, "encoding"] = char_df.loc[mask, "retokenized"]
    
    # Save the updated dataframe back to CSV
    char_df.to_csv("data/char_db.csv", index=False)

    return char_df


def gen_dict():
    # Load char_db.csv and filter rows with non-null encoding
    filtered_rows = []

    with open('data/char_db.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Filter rows where 'encoding' column is not null/empty
            if row['encoding'] and row['encoding'].strip():
                filtered_rows.append(row)

    # Create dict.txt with format: <encoding>\t<character>\t名詞
    with open('dict.txt', 'w', encoding='utf-8') as f:
        for row in filtered_rows:
            encoding = row['encoding']\
                    .strip()\
                    .replace(".", "")\
                    .replace("_", "")\
                    .replace("|", "")\
                    .replace(")", "")\
                    .replace("S", "")\
                    .replace("V", "")\
                    .replace("A", "")\
                    .replace("B", "")
            f.write(f"{encoding}\t{row['character']}\t名詞\n")

    print(f"Generated dict.txt with {len(filtered_rows)} entries")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", nargs="?", help="Command to run (gen-dict)")
    parser.add_argument("-t", help="Path to tokens.csv", default="data/tokens.csv")
    parser.add_argument("--use-strokes", help="Use the character's strokes as the code")

    args = parser.parse_args()

    if args.command == "gen-dict":
        gen_dict()
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
