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



Albanian, Arabic, romanization (ALA-LC; ISO), Arabic, Asturian, Azerbaijani, Belarusian, Bengali, Bosnian (cyrllic; latin scripts), Breton, Bulgarian, Burmese, Chinese Mandarin (pinyin), Cyrillic (romanization, ISO 9), Czech, Danish, Dutch, Dzongkha, English, Esperanto, Estonian, Faroese, Farsi / Dari / Persian, Filipino, French, Galician, Georgian (mkhedruli), German, Greenlandic, Hawaiian, Hebrew, Hindi, Hungarian, Icelandic, Irish, Italian, Japanese (romaji; hepburn, nihonshiki, kunrei), Khmer, Kurdish, Kurdish (arabic), Lakota, Lao, Latvian, Lithuanian, Macedonian, Manx, Mongolian (cyrillic; mongolian), Montenegrin, Māori, Nepalese, Norwegian (bokmal, nynorsk), Pashto, Polish, Portuguese, Qazaq (latin script), Romanian, Russian, Scottish Gaelic, Serbian, Slovak, Slovenian, Sinhala, Spanish, Swedish, Tamil, Thai, Tibetan, Tifinagh, Turkish, Ukrainian, Urdu, Uzbek, Welsh 


To add support for the following scripts:

- vietnamese
- syllabic writing systems
  - korean
  - ge'ez

# Why?

It's needlessly hard to type! Symbols like θ, π, and √ are incredibly common in handwriting. And yet, almost impossible to type on a computer. This isn't just a problem in math, but also in linguistics, and for bilingual people.

**This keyboard makes it easy to type. Even symbols.**

**If you study math, you can type math symbols. If you're bilingual, you can type in your other language. If you study linguistics, you can type linguistics notation.**

In order to make it as easy as possible, you should be able to start typing in any language with minimal learning - you shouldn't have to learn a new keyboard layout for every new language, or look up where to find θ on your keyboard.

There are basically 3 ways to achieve this:
1. Type characters by using graphically similar characters
2. Make users memorize 1 romanization system for all scripts, and have them learn a few exceptions for each script

\# 1 sounds painful. Chinese and Japanese had to be typed using mostly visual components for 100 years, and as soon as computers allowed you to type Japanese / Chinese phonetically, almost everyone switched to typing characters phonetically using the latin alphabet. I consider the debate on graphical vs phonetic typing to be settled, with phonetic typing having won.

Even so, typing graphically can *sometimes* be unavoidable, since lots of latin script languages use diacritics. Take `p̃` as an example - you may not know how that's pronounced, but vou *do* know that it's a "p" with a tilde above it, and that's exactly how you want to type it.

We use a nearly universal romanization scheme, which maps every language's letters to that romanization scheme. That romanization scheme must:
- only use basic latin letters
- no diacritics
- if exceptions are made, they must be easy to guess or learn.
- when typing diacritics, they must be intuitive to find (ȧ = a + .)

Our universal romanization scheme is based on the IPA. To save time, if a letter in the basic 26 letters is unused, then we fill that slot with a nearby convenient IPA value.

The idea should be that if i want to type russian but i don't know how to write it, that i can close my eyes and type russian. I'd type "andrej" and get "андрей".

*Problem 1*: Languages have messy writing systems. English has 3 letters that all make the /k/ sound (q; k; c), and many languages also have the same kind of problem. 
*Solution*: For these cases, we use "t", "t1" and "t2", and which one is which will be sorted alphabetically. So in English, you can imagine that "c" maps to "k", "k" maps "k1", and "q" maps to "k2".

*Problem 2*: Many non-latin alphabets have letters for sounds that latin doesn't have, especially sounds like "ts", "ch", "zh", and "sh".
*Solution*: Use the universal romanization scheme, and allow typing of diacritics. To get russian "ц", type "ts". To get "тс", type "t-s". Common sounds like "sh" are simply "x".

## Examples

*Example 1*
- Perso-Arabic script has a /gh/ sound and a /g/ sound.
- Greek has a single letter which can sound like /gh/ or /g/.
Therefore, Greek would allow you to simply type /g/, But in perso-arabic script, there is a separate letter for /g/ and /gh/. So you would have to distinguish the two when you write Persian.
