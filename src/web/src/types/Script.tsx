export class Script {
  constructor(
    public id: string,
    public flag: string,
    public sampleText: string,
    public name: string,
    public nativeName: string
  ) {}

  getLongDisplayText(): string {
    return this.id + " " + this.flag + "\n" + this.sampleText;
  }

  getShortDisplayText(): string {
    return this.sampleText[0];
  }
}

// Create languages directly as a map
export const scriptMap = {
  arab: new Script("arab", "🇸🇦", "ابجد", "arabic", "العربية"),
  armn: new Script("armn", "🇦🇲", "աբգդ", "armenian", "հայերեն"),
  beng: new Script("beng", "🇧🇩", "অআইঈ", "bengali", "বাংলা"),
  cans: new Script("cans", "🇨🇦", "ᐁᐯᑕᑫ", "syllabics", "ᓀᐦᐃᔭᐍᐏᐣ"),
  cyrl: new Script("cyrl", "🇧🇬", "АБВГ", "cyrillic", "Кирилица"),
  deva: new Script("deva", "🇮🇳", "अआइई", "devanagari", "देवनागरी"),
  geez: new Script("geez", "🇪🇹", "ሀለሐመ", "ge'ez", "ግዕዝ"),
  geor: new Script("geor", "🇬🇪", "აბგდ", "georgian", "მხედრული"),
  grek: new Script("grek", "🇬🇷", "αβγδ", "greek", "Ελληνικά"),
  hebr: new Script("hebr", "🇮🇱", "אבגד", "hebrew", "עברית"),
  hira: new Script("hira", "🇯🇵", "あいうえ", "hiragana", "ひらがな"),
  kata: new Script("kata", "🇯🇵", "アイウエ", "katakana", "カタカナ"),
  khmr: new Script("khmr", "🇰🇭", "កខគឃ", "khmer", "ខ្មែរ"),
  laoo: new Script("laoo", "🇱🇦", "ກຂຄງ", "lao", "ລາວ"),
  mong: new Script("mong", "🇲🇳", "ᠠᠡᠢᠣ", "mongolian", "ᠮᠣᠩᠭᠣᠯ"),
  mymr: new Script("mymr", "🇲🇲", "ကခဂဃ", "myanmar", "မြန်မာဘာသာ"),
  sinh: new Script("sinh", "🇱🇰", "අආඇඈ", "sinhala", "සිංහල"),
  taml: new Script("taml", "🇱🇰", "அஆஇஈ", "tamil", "தமிழ்"),
  tfng: new Script("tfng", "🇲🇦", "ⴰⴱⴲⴳ", "tifinagh", "ⵜⵉⴼⵉⵏⴰⵖ"),
  thaa: new Script("thaa", "🇲🇻", "ހށނރ", "thaana", "ދިވެހި"),
  thai: new Script("thai", "🇹🇭", "กขฃค", "thai", "ไทย"),
  tibt: new Script("tibt", "🇨🇳", "ཀཁགང", "tibetan", "བོད་སྐད་"),
};
