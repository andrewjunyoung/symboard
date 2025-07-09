import argparse
from tqdm import tqdm
import requests
from bs4 import BeautifulSoup
import re
from concurrent.futures import ThreadPoolExecutor
import threading
import random

def parse_composition(html):
    composition_pattern = re.compile(r'composition.*?</i>\s*<span[^>]*>(.*?)</span>', re.DOTALL | re.IGNORECASE)
    match = composition_pattern.search(html)
    if match:
        composition_span = match.group(1)
        soup_comp = BeautifulSoup(composition_span, 'html.parser')
        return soup_comp.get_text()
    return None

print_lock = threading.Lock()
seen_chars = {}
decomposition_steps = {}
seen_lock = threading.Lock()

stop_chars = {
    # Strokes.
    "一": "_", "㇀": "_",
    "丨": "|",
    "亅": "J",
    "丿": "/", "㇒": "/",
    "丶": "\\", "乀": "\\", "㇏": "\\",
    # 5
    "乙": "5", "乚": "5", "𠃋": "5", "㇇": "5", "𠃊": "5", "𠄌": "5",
    "㇂": "5", "乛": "5", "𠃌": "5", "㇉": "5", "𠃍": "5", "㇈": "5",
    "⺄": "5", "㇡": "5", "ㄣ": "5", "㇍": "5",
    # Numbers / elements (combined)
    "二": "2", "⺀": "2", "冫": "2", "丷": "2", "二": "2", "刂": "2", "リ": "2", # 2
    "彡": "3", "三": "3", "氵": "3", "𫶧": "3",  # 3
    "𭕄": "3", "小": "3", "⺌": "3",  # Xiao. Maybe change to v.
    "氺": "3", "水": "3",  # Shui.
    # 4 /**
    "覀": "4", "四": "4", "灬": "4", "皿": "4",
    "罒": "4", "西": "4", "": "4",
    "火": "Q",  # Huo.
    "目": "4-", "目": "4-",  # Mu. This is ass
    # */
    "五": "_5", "𫝀": "5", # 5
    "亠": "6",  # 6
    "匕": "7", "七": "7",  # 7
    "八": "8",  # 8
    "夕": "9", "九": "9", "又": "9", "夂": "/9", "夊": "/9",  # 9 ?
    "十": "0", "𬺰": "0",  # 10 (0)

    # Awful characters
    "末": "_m", "未": "Im",
    "申": "0l", "甲": "0i",

    # ?
    "𠂇": "R",  # no 0. Matches VERT, not INNER
    "儿": "A",  # no 8,t
    # Basic kangxi
    "田": "U", "囬": "U", "凵": "U",
    "⺕": "C",
    "女": "Y",
    "犭": "E", "豕": "E", "犬": "E", "𧰨": "E", "豸": "E",  # QUAN
    "片": "K", "爿": "K", "尢": "K", "兂": "K",
    "丆": "R", "𠂆": "R","厂": "R",
    "尸": "P", "戶": "\\P", "力": "P", "刀": "P",
    "了": "Z", "𠄐": "Z",
    "亻": "A", "𠂉": "A", "𠆢": "A", "人": "A",  # ren
    "大": "Q",
    "木": "M", "朩": "M",  # mu
    "𤣩": "W", "王": "W", "龶": "W",
    "乂": "X", "㐅": "X", # X
    # n /**
    "冂": "N", "⺈": "N", "冖": "N", "勹": "N", "⺆": "N", "門": "N", "𠘨": "N",
    "几": "N", "门": "In",
    # */
    "入": "A",  "癶": "A",
    "口": "O", "囗": "O",
    "月": "G", "⺝": "G", "肉": "G", "⺼": "G",
    "黽": "Or",
    "匚": "C", "コ": "C",
    "卜": "F", "⺊": "F",
    "日": "b", "⺜": "b", "曰": "b",
    # Same strokes, distinct chars.
    "土": "T",
    "工": "I",
    "扌": "J", "手": "J", "于": "J",
    "𰀁": "𰀁",
    "𧘇": "V",
    "𰀁": "F", "干": "F",
    "龴": "D", "厶": "D",
    "肉": "G", "月": "G", "⺝": "G",
    "卄": "H", "廾": "H", "艹": "H", "䒑": "H", "丌": "H", "⻀": "H",  # cao

    # Derivable

    # KX
    "戈": "Xi", "弋": "Xi",
    "艮": "Cv",
    "殳": "Nx",
    "鹵": "Fo",
    "飠": "Ac", "食": "Ac",
    "耒": "2m",
    "气": "A5",
    "非": "33",
    "方": "2b",
    "革": "H-o0",
    "瓦": "Ss",
    "牛": "/f", "𠂒": "/f",
    "疒": "R2",
    "聿": "Cf",
    "雨": "N4", "⻗": "N4",
    "心": "Si", "忄": "Si",
    "飛": "S2",
    "車": "50", "车": "50",
    "廴": "Z\\",
    "龙": "K2", "龍": "K2",
    "耳": "R3",
    "辶": "\\s",
    "弋": "X\\",
    "虫": "Od",
    "山": "Lu",
    "辰": "Rv",
    "訁": "4o", "言": "4o", "4o": "4o",
    "示": "Iv", "礻": "Iv",
    "髟": "R3",
    "氏": "Rx",
    "比": "77",
    "糹": "S3",  # 01
    "羽": "S2",  # 01
    "虍": "Fr",  # 01
    "隹": "A2",  # 01
    "而": "Rn",  # 01
    "黑": "4t",  # 01
    "鱼": "Nn", "魚": "Nn`",  # 01
    "馬": "Zz`", "马": "Zz",  # 01
    "鸟": "Iz", "鳥": "Iz`",  # 01
    "金": "Af", "釒": "Af", "钅": "Af",  # 01
    "𥫗": "Aa", "竹": "Aa",  # 01'|
    "臼": "Rs", "𦥑": "Rs",  # 01'-
    "身": "4/",  # 01'/
    "齒": "Fu", "齿": "Fu",  # 01'5
    "止": "Fs",
    "骨": "Ng",  # 0-
    "阝": "Zl", "卩": "Sl",
    # !KX
    "ス": "5\\",
    "ユ": "C",
    "业": "4-",
    "鼎": "4-kk",
    "是": "0-fa",
    "刃": "P\\",
    "由": "Nt",
    "母": "Ss3", "毋": "Ss0",
    "𭃂": "Sf",
    "占": "Fo",
    "𢆶": "Dd",
    "瓜": "rd\\",
    "𠫝": "d3",
    "有": "rg",
    "𭔰": "oh0", # -oh0\\
    "𠔾": "/N2",
    "及": "5a",
    "亽": "Ai",
    "生": "/w",
    "我": "Fx\\",
    "皮": "Rlx",
    "宅": "In/7", # Ambiguous /7 25
    "毛": "/-7", # Ambiguous 27 35
    "龰": "Fa",
    "色": "Ncis",
    "邑": "Ocis",
    "𥘈": "723",
    "𡕩": "ox8",
    "𦣝": "Clcl",
    "免": "Noa",
    "肃": "C04",
    "𭥴": "40",

    # Memorize

    # KX
    "鹿": "24",  # wtf. maybe r5?
    "斤": "Rr",  # 2nd r is strange
    # !KX
    "北": "2l7",
    "臣": "Rlc2",
    "戊": "Rx",  # ? NESTED

    # Extra rule: l vs i
    "巿": "_nl", "帀": "-ni",

    # Composition
    "OTHER": "\\",
    "WIDE": "-",
    "TALL": "|",

    # Bullshit avoidance
    "𠁁": "*",
    "亞": "*",
    "丱": "*",
}
dont_print = set({"⿻", "⿳", "⿸","⿵","⿲","⿴","⿶","⿷","⿸","⿹","⿺","⿻","⿼","⿽","⿾","⿿"})
stack = set({"⿱", "⿰"})
dont_print = dont_print.union(stack)

def fetch_char_composition(char):
    with seen_lock:
        if char in seen_chars:
            return seen_chars[char]

    url = f"https://en.wiktionary.org/wiki/{char}"
    try:
        resp = requests.get(url)
        composition = parse_composition(resp.text)
        with seen_lock:
            seen_chars[char] = composition
        return composition
    except Exception as e:
        with seen_lock:
            seen_chars[char] = None
        return None

def decompose_char(char, steps=None):
    if steps is None:
        steps = []

    if char in stop_chars:
        return stop_chars[char]

    composition = fetch_char_composition(char)
    if not composition:
        return char

    steps.append(f"{char} → {composition}")

    components = re.findall(r'[^\u2ff0-\u2fff]', composition)
    decomposed_components = []

    for component in components:
        if component != char and component not in stop_chars:
            decomposed_components.append(decompose_char(component, steps))
        else:
            decomposed_components.append(stop_chars.get(component, component))

    structure = composition
    for i, component in enumerate(components):
        if component != char:
            structure = structure.replace(component, decomposed_components[i], 1)

    with seen_lock:
        decomposition_steps[char] = steps.copy()

    return structure

def fetch_char(char):
    try:
        result = decompose_char(char)
        steps = decomposition_steps.get(char, [])
        steps_str = " | ".join(steps) if steps else "No steps"
        output = f"{char}\t{result}\t{steps_str}"
    except Exception as e:
        output = f"{char}\tError: {e}\t"

    with print_lock:
        print(''.join(c for c in output if c not in dont_print))

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('file', help='Input file with tab-separated data')
    parser.add_argument('-o', '--offset', help='Char to start recursion at')
    parser.add_argument('--stop-chars', help='Char to stop recursion at')
    parser.add_argument('-n', '--num-samples', type=int, help='Number of samples to process (default: all)')
    parser.add_argument('-r', '--random', action='store_true', help='Randomize sample selection')
    args = parser.parse_args()

    if args.stop_chars:
        for char in args.stop_chars:
            stop_chars[char] = char

    with open(args.file, "r", encoding='utf-8') as f:
        lines = [line.strip() for line in f if line.strip()]

    all_chars = [line.split('\t')[1] for line in lines if len(line.split('\t')) >= 2]

    if args.num_samples is None:
        n_samples = len(all_chars)
    else:
        n_samples = min(args.num_samples, len(all_chars))

    offset = 0
    if args.offset is not None:
        offset = int(args.offset)

    if args.random:
        chars = random.sample(all_chars, n_samples)
    else:
        chars = all_chars[offset:(offset+n_samples)]

    with ThreadPoolExecutor(max_workers=10) as executor:
        executor.map(fetch_char, chars)

if __name__ == "__main__":
    main()
