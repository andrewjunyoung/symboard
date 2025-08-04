with open('.formulae', 'r', encoding='utf-8') as f:
    lines = f.readlines()

codes = [line.split('\t')[0] for line in lines]

result = []
for i, line in enumerate(lines):
    code = codes[i]
    
    max_shared = 0
    for j in range(len(codes)):
        if i != j:
            shared_len = 0
            for k in range(min(len(code), len(codes[j]))):
                if code[k] == codes[j][k]:
                    shared_len += 1
                else:
                    break
            max_shared = max(max_shared, shared_len)
    
    if max_shared > 0:
        modified_code = code[:max_shared] + '*' + code[max_shared:]
        result.append(line.replace(code, modified_code, 1))
    else:
        result.append(line)

with open('.formulae_starred', 'w', encoding='utf-8') as f:
    f.writelines(result)
