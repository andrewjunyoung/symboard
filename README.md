# DvorakCustom

A custom implementation of Dvorak which relocates certain keys based off a combination of logical grouping and comfort.


The full keyboard is, when typed on an ANSI keyboard:

\`1234567890[]

;,.pyfgcrl/=\\

aoeuidhtns-

'qjkxbmwvz

SHIFT:

~&@#$%^<>(){}

:!?PYFGCRL\*+|

AOEUIDHTNS\_

"QJKXBMWVZ


The design decisions of this keyboard were made against the following principles for what the keyboard should do:

1: Be typable using only a 54 keyboard [0]
2: Be comfortable to use for experienced users, using minimal effort to type the majority of text
3: Minimize typos for experienced users
4: Keys should be placed logically according to their function in English [1]
5: Work well for English
6: Support all non-English, roman scripts (though not necessarily with ease)

[0] Our definition of a 54 keyboard is defined as an ANSI keyboard which contains only 54 keys: 26 alphabetical, 21 non-alphabetical, a space bar, a shift key, a return key, a delete key, 2 modal keys (alt, control), and an escape key.

[1] We split character functions into groups: alpabetical, numerical, brackets, punctuation, mathematical, other symbols. Alphabetical is funther divided into separate sets if they have different diacritics, and then again if they are upper or lower case.


We match each of these criteria as follows:

1: All keys are made to be typable using only these 54 keys. All other keys may be used, but add no additional functionality, only alternative ways of typing.

2: This is done in various ways, as listed below.
    2.1: The alphabet is arranged in the Dvorak layout, with uppercase characters accessed by holding shift.
    2.2: All punctuation needed to write comprehensible English documets are contained in the lower 4 rows of the keyboard. This assumes no numbers, brackets, or special characters are used, and so all words are written out in full, with punctuation.
    2.3: The least commonly used keys are placed furthest away from the hands, and the most common ones are placed nearer the hand (largely).

3: [Write up todo]

4: We split the groups as follows:
    Alphabetical: [a-zA-Z'] (' is considered lower case)
    Numerical: [0-9]
    Brackets: [<>(){}[]]
    Punctuation: [;,.:!?"-]
    Mathematical: [*+/=-]
    Other_Symbols: [~&@#$%^\`\_|\\]

5: We used the Dvorak keyboard layout as a base, which is designed for English. Furthermore, groups of characters are decided according to their function in English.

6: We are in the process of adding diacritics through the alt-key, which should enable users to type all (or nearly all) characters in the latin block of unicode. As this section is not designed to be typed easily, we have grouped characters entirely by their appearance so that it is easy to find a character and remember where it is, although not necessarily easy to type quickly.


In future I will publish an image for this layout which describes the location of characters on keys, including an extended description of grouping logic.

The decisions have been made as follows:

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

This keyboard is compatible with the following diacriticized scripts:

- Albanian
- Asturian
- Azerbaijani
- Breton
- Danish
- Dutch
- Chinese Mandarin, Pinyin (with tone marks)
- Czech
- English
- Estonian
- Esperanto
- Faroese
- French
- Filipino
- Galician
- German
- Greenlandic
- Icelandic
- Irish
- Italian
- Japanese Romaji (Hepburn, Nihonshiki, Kunrei)
- Kurdish
- Lakota
- Latvian
- Lithuanian
- Manx
- Māori
- Norwegian (Bokmal, Nynorsk)
- Polish
- Portuguese
- Qazaq
- Scottish Gaelic
- Slovenian
- Slovak
- Spanish
- Swedish
- Turkish
- Uzbek
- Welsh

Hopefully to add support for the following scripts:

- Arabic romanization
- Cyrillic, ISO 9
- Hungarian
- Romanian
- Vietnamese
