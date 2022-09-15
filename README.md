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
  - The alphabet is arranged in the Dvorak layout. Common English punctuation is all in the lower 4 rows. 
3. *Minimize typos for experienced users*
4. *Support other common symbols in an intuitive way (EG greek, cyrillic, arrows, math symbols)*
  - The keyboard is arranged in groups:
    1. Alphabetical: [a-zA-Z'] (with \' considered as lower case)
    1. Numerical: [0-9]
    1. Brackets: [<>(){}[]]
    1. Punctuation: [;,.:!?"-]
    1. Operators: [\*+/=-]
    1. Other symbols: [~&@#$%^\`\_|\\]
5. *Determine where to place other common symbols based off the core (english) layout, whatever that is.*
  - Groups of other characters (EG greek; cyrillic) are in the same location as their latin script equivalents, following the common romanization scheme for each script. Diacritics and extensions are generally available through the alt key, and following logical placements

## Decisions behind Key placement 
Decisions have been made as follows:

- All alphabetical and punctuation symbols are included in the lower 3 rows, except for parenthesis.

- All bracketing characters are on the top row, on the left. They are ordered roughly according to the priority () <> [] {}.

- Numerical characters are all on the top row from 1-9 then 0.

- The numerical keypad uses the phone layout.

- All sentence-dividing characters ";,.:!?" are listed in the top row. These are prioritized firstly by frequency, and secondly by symbolic similarity. As such ; and : are together, while . and , occupy two separate keys (as the most commonly used punctuation).

- The 4 arithmetic operations +-/\* are located on the right of the keyboard.

- \- and _ are on the same key due to graphical similarity.

- \ and | are together on the far right as two uncommon characters with great graphical similarity.

- " and ' are together at the bottom of the keyboard. ' is treated equally to alphabetic characters firstly as it appears in words in various languages alongside alphabetical text, and secondly because some languages and transcription systems do treat it as its own character.

- " is together with ' due to graphical similarity and similar function

- All other symbols are placed to the left of the top row and placed in a near-traditional order (adjusted due to the movement of <>)

# Compatibility

Below is a map of the world showing the countries where some or all of the administrative languages can be written using jDvorak.

<img src="docs/res/images/symboard_support_current.png" alt="drawing" width="800"/>

This keyboard is compatible with (at least) the following scripts (\* to be
confirmed):

| Albanian                    | Arabic, romanization (ALA-LC; ISO)\*       | Arabic\*                                      | Asturian             |
| Azerbaijani                 | Belarusian                                 | Bosnian (cyrllic; latin scripts)              | Breton               |
| Bulgarian                   | Chinese Mandarin, pinyin (with tone marks) | Cyrillic, romanization, ISO 9\*               | Czech                |
| Danish                      | Dutch                                      | English                                       | Esperanto            |
| Estonian                    | Faroese                                    | Filipino                                      | French               |
| Galician                    | Georgian (mkhedruli)                       | German                                        | Greenlandic          |
| Hawai'ian                   | Hebrew                                     | Hungarian                                     | Icelandic            |
| Irish                       | Italian                                    | Japanese Romaji (Hepburn, Nihonshiki, Kunrei) | Kurdish              |
| Lakota                      | Latvian                                    | Lithuanian                                    | Macedonian           |
| Manx                        | Mongolian (cyrillic script                 | Montenegrin                                   | Māori                |
| Norwegian (bokmal, nynorsk) | Polish                                     | Portuguese                                    | Qazaq (latin script) |
| Romanian                    | Russian                                    | Scottish Gaelic                               | Serbian              |
| Slovak                      | Slovenian                                  | Spanish                                       | Swedish              |
| Tifinagh                    | Turkish                                    | Ukrainian                                     | Uzbek                |
| Welsh                       |                                            |                                               |                      |

Hopefully to add support for the following scripts:

- Vietnamese
- Arabic derivative scripts
  - Persian
  - Urdu
- Syllabaries
  - Japanese
  - Ge'ez
