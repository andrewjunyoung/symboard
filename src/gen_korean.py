import unicodedata

def generate_korean_unicode():
    result = []

    for code_point in range(0x3131, 0x314E):
        char = chr(code_point)
        romanized = unicodedata.name(char).split()[-1].lower()
        result.append(f"{romanized}\t{char}")

    for code_point in range(0xAC00, 0xD7A4):  # Range for Korean syllables
        char = chr(code_point)
        romanized = unicodedata.name(char).split()[-1].lower()
        result.append(f"{romanized}\t{char}")
    return result

def write_to_file(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        for line in data:
            f.write(line + '\n')

def main():
    korean_data = generate_korean_unicode()
    write_to_file(korean_data, "korean.txt")
    print("File 'korean.txt' has been generated.")

    # Print the first 10 Unicode characters
    print("\nFirst 10 Unicode characters:")
    for line in korean_data:
        print(line)

if __name__ == "__main__":
    main()
