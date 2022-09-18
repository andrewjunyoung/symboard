# jDvorak

A custom implementation of Dvorak which relocates certain keys based off a combination of logical grouping and comfort.

## About

### Naming

jDvorak (/dʒej dvɔɹak/) gets its name from its layout. Just like the QWERTY keyboard gets its name from its first few alphabetical characters, jDvorak gets its name from its top left letter - a semicolon (;), which looks like a lowercase J (j).

### Layout

The basic layout is as follows:

<img src="docs/res/images/basic_layout.png" alt="drawing" width="400"/>

Pressing the shift and alt keys will provide access to different key sets, including modifier keys. These are presented below.

|                    | Shift not pressed                                                       | Shift pressed                                                        |
|--------------------|-------------------------------------------------------------------------|----------------------------------------------------------------------|
| **Alt not pressed** | <img src="docs/res/images/basic_layout.png" alt="drawing" width="300"/> | <img src="docs/res/images/shift.png" alt="drawing" width="300"/>     |
| **Alt pressed**      | <img src="docs/res/images/alt.png" alt="drawing" width="300"/>          | <img src="docs/res/images/alt_shift.png" alt="drawing" width="300"/> |


#### Design tenets

This keyboard was designed according to the following tenets:

1. *Be typable using only a 54 key keyboard [0]*
  - All keys are made to be typable using only these 54 keys. All other keys may be used, but add no additional functionality, only alternative ways of typing. 
2. *Make typing in english fast, comfortable, and low-effort*
  - The alphabet is arranged in the Dvorak layout. Common English punctuation is all in the lower 3 rows
3. *Minimize typos for experienced users*
  - Characters are grouped near letters they often appear next to.
    - & usually appears alone, or with capital letters (in acronyms like A&E), so is in the "shift" row
    - ;,. are usually used after lowercase letters, so are grouped with lowercase letters
4. *Support other common symbols in an intuitive way (EG greek, cyrillic, arrows, math symbols)*
  - Functionally or graphically similar letters are grouped together
  - Non-latin characters are placed on top of similar-sounding latin characters, based on the IPA sound they make in standard dialect

## Decisions behind key placement 

- All alphabetical and punctuation symbols are included in the lower 3 rows, except for brackets. 

- Many languages use ' as a letter, so we treat it like one too.

- All brackets are in the top right.

- Numerical characters are all on the top row from 1-9 then 0.

- All sentence dividers ";,.:!?" are listed together in the top row. They're grouped first by frequency, then by graphical similarity.

- The numerical keypad uses the phone layout. In 2022, more people have phones than numpads.

- The 4 arithmetic operations +-/\* are located together on the right of the keyboard.

- Due to graphical similarity, we group together (\-\_), ('"), and (\\|)

- All other symbols are placed to the left of the top row and placed in a mostly traditional order

# Compatibility

Below is a map of the world showing the countries where some or all of the administrative languages can be written using jDvorak.

<img src="docs/res/images/symboard_support_current.png" alt="drawing" width="800"/>

This keyboard is compatible with (at least) the following scripts (\* to be
confirmed):

|                                               |                                            |                                  |                 |
|-----------------------------------------------|--------------------------------------------|----------------------------------|-----------------|
| Albanian                                      | Arabic, romanization (ALA-LC; ISO)\*       | Arabic\*                         | Asturian        |
| Azerbaijani                                   | Belarusian                                 | Bosnian (cyrllic; latin scripts) | Breton          |
| Bulgarian                                     | Chinese Mandarin, pinyin (with tone marks) | Cyrillic, romanization, ISO 9\*  | Czech           |
| Danish                                        | Dutch                                      | English                          | Esperanto       |
| Estonian                                      | Faroese                                    | Farsi / Dari / Persian           | Filipino        |
| French                                        | Galician                                   | Georgian (mkhedruli)             | German          |
| Greenlandic                                   | Hawai'ian                                  | Hebrew                           | Hindi           |
| Hungarian                                     | Icelandic                                  | Irish                            | Italian         |
| Japanese Romaji (hepburn, nihonshiki, kunrei) | Kurdish                                    | Kurdish (arabic)                 | Lakota          |
| Latvian                                       | Lithuanian                                 | Macedonian                       | Manx            |
| Mongolian (cyrillic; mongolian)               | Montenegrin                                | Māori                            | Nepalese        |
| Norwegian (bokmal, nynorsk)                   | Pashto                                     | Polish                           | Portuguese      |
| Qazaq (latin script)                          | Romanian                                   | Russian                          | Scottish Gaelic |
| Serbian                                       | Slovak                                     | Slovenian                        | Spanish         |
| Swedish                                       | Tifinagh                                   | Turkish                          | Ukrainian       |
| Urdu                                          | Uzbek                                      | Welsh                            |

Hopefully to add support for the following scripts:

- vietnamese
- syllabic writing systems
  - korean
  - ge'ez
- brahmic scripts
  - burmese
  - bengali
  - tamil
  - sinhala
  - thai
  - lao
  - khmer
  - dzongkha

# Musings: how to make typing other alphabets intuitive

Non-latin characters should be placed so intuitively that anybody can learn a few rules, and be able to start typing as if the language used the latin alphabet, and convert this into mostly correct writing in the other alphabet.
The idea should be that if i want to type russian but i don't know how to write it, that i can close my eyes and type russian. I'd type "andrej" and get "андрей".

But languages have messy writing systems. English has 3 letters that all make the /k/ sound (q; k; c), and many languages also have the same kind of problem. It's impossible to have a purely phonetic system for placing letters. Plus, many non-latin alphabets have letters for sounds that latin doesn't have, especially sounds like "ts", "ch", "zh", and "sh".

So, a person will have to know *something* about the language they're trying to type. But we want it to be really easy to start typing in any language, with minimal learning.

The easiest way to do this is to have users memorize 1 phonetic romanization system for all scripts, and learn a few exceptions for each script they want to type.

For example, I might need to learn that "j" makes a "y" sound in russian, or that the greek letter θ is placed on top of the "q" on the keyboard, but once I learn these rules I can start typing valid russian / greek.

It can't be entirely phonetic either. We already mentioned that some letters represent the same sound, but there are also diacritics like å. You may not know how that's pronounced, but you *do* know that it's an "a" with a ring above it, and you should be able to type it just like that.

For example:
Arabic has a lot of h sounds. It has distinct letters for /h/; /x/; /ʕ/; /ʔ/.
I'll need to learn that the keyboard uses h; H; X; '; and \` to represent those sounds, which is some memorization, but not unmanageable.

Lots of languages have very similar alphabets (like english, greek, and russian), so fewer exceptions need to be learned. You'll have to learn where some weird letters like θ go, but once you know, you don't have to re-learn. In fact, most languages have such similar alphabets that you only need to learn rules for a couple of basic alphabets to type in any of its related scripts.

If you know latin, you'll only need to learn around 5 or so extra rules to type any of:
- cyrillic
- greek
- hangeul
- katakana
- canadian syllabics

Some languages have more than a few rules to learn because their sound systems are so different to most latin alphabets:
- arabic
- hebrew
- georgian m.
- armenian
- devanagari

But once you learn the rules for arabic, you can probably type ge'ez

And if you can type devanagari, you can type any other indic script, including:
- gujarati
- assamese
- tamil
- thai
- khmer
- lao
and more
