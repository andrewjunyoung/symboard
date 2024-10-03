from collections import defaultdict
import re

def find_frequent_subsequences(file_path, min_length=8, min_occurrences=10):
    subsequences = defaultdict(int)
    pattern = re.compile(r'[1-5]+')

    with open(file_path, 'r') as file:
        for line in file:
            line = line.strip()
            numbers = pattern.findall(line)
            for number_sequence in numbers:
                for i in range(len(number_sequence) - min_length + 1):
                    for j in range(i + min_length, len(number_sequence) + 1):
                        subsequence = number_sequence[i:j]
                        subsequences[subsequence] += 1

    frequent_subsequences = [
        (subsequence, count)
        for subsequence, count in subsequences.items()
        if len(subsequence) >= min_length and count >= min_occurrences
    ]
    return sorted(frequent_subsequences, key=lambda x: (-x[1], x[0]))

# Usage
file_path = 'kangxi.txt'  # Replace with your actual file path
result = find_frequent_subsequences(file_path)
for subsequence, count in result:
    print(f"Subsequence: {subsequence}, Occurrences: {count}")
