"""
.. module:: keylayouts
   :synopsis: A class representing the iso dvorak keylayout.

.. moduleauthor:: Andrew J. Young

"""


# Imports from third party packages.
from typing import Dict, List, Union

# Imports from this package.
from symboard.keylayouts.keylayouts import Keylayout


class IsoDvorakKeylayout(Keylayout):
    """ An implementation of the dvorak keyboard layout (keylayout) which
    is able to produce an installable dvorak keyboard that works on iso
    keyboards.
    """

    _DEFAULT_NAME: str = 'Dvorak keyboard (iso)'
    name: str = _DEFAULT_NAME

    default_index: int = 6

    def __str__(self):
        return 'IsoDvorakKeylayout({}, (id: {}))'.format(self.name, self.id_)

    def __init__(
        self,
        group: int,
        id_: int,
        maxout: int = 1,
        name: str = _DEFAULT_NAME,
        default_index: int = 0
    ):
        super(IsoDvorakKeylayout, self).__init__(
            group, id_, maxout, name=name, default_index=default_index
        )

    layouts: List[Dict[str, str]] = [
        {
            'first': '0',
            'last': '17',
            'mapSet': 'ANSI',  # Yes, this is correct for iso too!
            'modifiers': 'Modifiers',
        },
    ]

    key_map_select: Dict[int, str] = {
        0: [''],
        1: ['anyShift'],
        2: ['anyOption'],
        3: ['anyShift caps? anyOption'],
        4: ['command'],
        5: ['caps'],
        6: ['anyControl'],
    }

    key_map: Dict[int, Dict[int, str]] = {
        0: {
            0: 'a',
            1: 'o',
            2: 'e',
            3: 'u',
            4: 'd',
            5: 'i',
            6: ';',
            7: 'q',
            8: 'j',
            9: 'k',
            10: '',
            11: 'x',
            12: '&#x0027;',
            13: ',',
            14: '.',
            15: 'p',
            16: 'f',
            17: 'y',
            18: '1',
            19: '2',
            20: '3',
            21: '4',
            22: '6',
            23: '5',
            24: ']',
            25: '9',
            26: '7',
            27: '[',
            28: '8',
            29: '0',
            30: '=',
            31: 'r',
            32: 'g',
            33: '/',
            34: 'c',
            35: 'l',
            36: '&#x000D;',
            37: 'n',
            38: 'h',
            39: '-',
            40: 't',
            41: 's',
            42: '\\',
            43: 'w',
            44: 'z',
            45: 'b',
            46: 'm',
            47: 'v',
            48: '&#x0009;',
            49: ' ',
            50: '`',
            51: '&#x0008;',
            53: '&#x001B;',
            57: '',
            64: '&#x0010;',
            65: '',
            66: '&#x001D;',
            67: '*',
            69: '+',
            70: '&#x001C;',
            71: '&#x001B;',
            72: '&#x001F;',
            75: '/',
            76: '&#x0003;',
            77: '&#x001E;',
            78: '-',
            79: '&#x0010;',
            80: '&#x0010;',
            81: '=',
            82: '0',
            83: '1',
            84: '2',
            85: '3',
            86: '4',
            87: '5',
            88: '6',
            89: '7',
            91: '8',
            92: '9',
            96: '&#x0010;',
            97: '&#x0010;',
            98: '&#x0010;',
            99: '&#x0010;',
            100: '&#x0010;',
            101: '&#x0010;',
            103: '&#x0010;',
            105: '&#x0010;',
            106: '&#x0010;',
            107: '&#x0010;',
            109: '&#x0010;',
            111: '&#x0010;',
            113: '&#x0010;',
            114: '&#x0005;',
            115: '&#x0001;',
            116: '&#x000B;',
            117: '&#x007F;',
            118: '&#x0010;',
            119: '&#x0004;',
            120: '&#x0010;',
            121: '&#x000C;',
            122: '&#x0010;',
            123: '&#x001C;',
            124: '&#x001D;',
            125: '&#x001F;',
            126: '&#x001E;',
        },
        1: {
            0: 'A',
            1: 'O',
            2: 'E',
            3: 'U',
            4: 'D',
            5: 'I',
            6: ':',
            7: 'Q',
            8: 'J',
            9: 'K',
            11: 'X',
            12: '&#x0022;',
            13: '&#x003C;',
            14: '&#x003E;',
            15: 'P',
            16: 'F',
            17: 'Y',
            18: '!',
            19: '@',
            20: '#',
            21: '$',
            22: '^',
            23: '%',
            24: '}',
            25: '(',
            26: '&#x0026;',
            27: '{',
            28: '*',
            29: ')',
            30: '+',
            31: 'R',
            32: 'G',
            33: '?',
            34: 'C',
            35: 'L',
            36: '&#x000D;',
            37: 'N',
            38: 'H',
            39: '_',
            40: 'T',
            41: 'S',
            42: '|',
            43: 'W',
            44: 'Z',
            45: 'B',
            46: 'M',
            47: 'V',
            48: '&#x0009;',
            49: ' ',
            50: '~',
            51: '&#x0008;',
            53: '&#x001B;',
            64: '&#x0010;',
            66: '&#x001D;',
            67: '*',
            69: '+',
            70: '&#x001C;',
            71: '&#x001B;',
            72: '&#x001F;',
            75: '/',
            76: '&#x0003;',
            77: '&#x001E;',
            78: '-',
            79: '&#x0010;',
            80: '&#x0010;',
            81: '=',
            82: '0',
            83: '1',
            84: '2',
            85: '3',
            86: '4',
            87: '5',
            88: '6',
            89: '7',
            91: '8',
            92: '9',
            96: '&#x0010;',
            97: '&#x0010;',
            98: '&#x0010;',
            99: '&#x0010;',
            100: '&#x0010;',
            101: '&#x0010;',
            103: '&#x0010;',
            105: '&#x0010;',
            106: '&#x0010;',
            107: '&#x0010;',
            109: '&#x0010;',
            111: '&#x0010;',
            113: '&#x0010;',
            114: '&#x0005;',
            115: '&#x0001;',
            116: '&#x000B;',
            117: '&#x007F;',
            118: '&#x0010;',
            119: '&#x0004;',
            120: '&#x0010;',
            121: '&#x000C;',
            122: '&#x0010;',
            123: '&#x001C;',
            124: '&#x001D;',
            125: '&#x001F;',
            126: '&#x001E;',
        },
        2: {
            0: '',
            36: '&#x000D;',
            48: '&#x0009;',
            51: '&#x0008;',
            53: '&#x001B;',
            64: '&#x0010;',
            66: '&#x001D;',
            70: '&#x001C;',
            71: '&#x001B;',
            72: '&#x001F;',
            76: '&#x0003;',
            77: '&#x001E;',
            79: '&#x0010;',
            80: '&#x0010;',
            96: '&#x0010;',
            97: '&#x0010;',
            98: '&#x0010;',
            99: '&#x0010;',
            100: '&#x0010;',
            101: '&#x0010;',
            103: '&#x0010;',
            105: '&#x0010;',
            106: '&#x0010;',
            107: '&#x0010;',
            109: '&#x0010;',
            111: '&#x0010;',
            113: '&#x0010;',
            114: '&#x0005;',
            115: '&#x0001;',
            116: '&#x000B;',
            117: '&#x007F;',
            118: '&#x0010;',
            119: '&#x0004;',
            120: '&#x0010;',
            121: '&#x000C;',
            122: '&#x0010;',
            123: '&#x001C;',
            124: '&#x001D;',
            125: '&#x001F;',
            126: '&#x001E;',
        },
        3: {
            0: '',
            36: '&#x000D;',
            48: '&#x0009;',
            51: '&#x0008;',
            53: '&#x001B;',
            64: '&#x0010;',
            66: '&#x001D;',
            70: '&#x001C;',
            71: '&#x001B;',
            72: '&#x001F;',
            76: '&#x0003;',
            77: '&#x001E;',
            79: '&#x0010;',
            80: '&#x0010;',
            96: '&#x0010;',
            97: '&#x0010;',
            98: '&#x0010;',
            99: '&#x0010;',
            100: '&#x0010;',
            101: '&#x0010;',
            103: '&#x0010;',
            105: '&#x0010;',
            106: '&#x0010;',
            107: '&#x0010;',
            109: '&#x0010;',
            111: '&#x0010;',
            113: '&#x0010;',
            114: '&#x0005;',
            115: '&#x0001;',
            116: '&#x000B;',
            117: '&#x007F;',
            118: '&#x0010;',
            119: '&#x0004;',
            120: '&#x0010;',
            121: '&#x000C;',
            122: '&#x0010;',
            123: '&#x001C;',
            124: '&#x001D;',
            125: '&#x001F;',
            126: '&#x001E;',
        },
        4: {
            0: 'a',
            1: 'o',
            2: 'e',
            3: 'u',
            4: 'd',
            5: 'i',
            6: ';',
            7: 'q',
            8: 'j',
            9: 'k',
            11: 'x',
            12: '&#x0027;',
            13: ',',
            14: '.',
            15: 'p',
            16: 'f',
            17: 'y',
            18: '1',
            19: '2',
            20: '3',
            21: '4',
            22: '6',
            23: '5',
            24: ']',
            25: '9',
            26: '7',
            27: '[',
            28: '8',
            29: '0',
            30: '=',
            31: 'r',
            32: 'g',
            33: '/',
            34: 'c',
            35: 'l',
            36: '&#x000D;',
            37: 'n',
            38: 'h',
            39: '-',
            40: 't',
            41: 's',
            42: '\\',
            43: 'w',
            44: 'z',
            45: 'b',
            46: 'm',
            47: 'v',
            48: '&#x0009;',
            49: ' ',
            50: '`',
            51: '&#x0008;',
            53: '&#x001B;',
            64: '&#x0010;',
            66: '&#x001D;',
            67: '*',
            69: '+',
            70: '&#x001C;',
            71: '&#x001B;',
            72: '&#x001F;',
            75: '/',
            76: '&#x0003;',
            77: '&#x001E;',
            78: '-',
            79: '&#x0010;',
            80: '&#x0010;',
            81: '=',
            82: '0',
            83: '1',
            84: '2',
            85: '3',
            86: '4',
            87: '5',
            88: '6',
            89: '7',
            91: '8',
            92: '9',
            96: '&#x0010;',
            97: '&#x0010;',
            98: '&#x0010;',
            99: '&#x0010;',
            100: '&#x0010;',
            101: '&#x0010;',
            103: '&#x0010;',
            105: '&#x0010;',
            106: '&#x0010;',
            107: '&#x0010;',
            109: '&#x0010;',
            111: '&#x0010;',
            113: '&#x0010;',
            114: '&#x0005;',
            115: '&#x0001;',
            116: '&#x000B;',
            117: '&#x007F;',
            118: '&#x0010;',
            119: '&#x0004;',
            120: '&#x0010;',
            121: '&#x000C;',
            122: '&#x0010;',
            123: '&#x001C;',
            124: '&#x001D;',
            125: '&#x001F;',
            126: '&#x001E;',
        },
        5: {
            0: 'A',
            1: 'O',
            2: 'E',
            3: 'U',
            4: 'D',
            5: 'I',
            6: ';',
            7: 'Q',
            8: 'J',
            9: 'K',
            11: 'X',
            12: '&#x0027;',
            13: ',',
            14: '.',
            15: 'P',
            16: 'F',
            17: 'Y',
            18: '1',
            19: '2',
            20: '3',
            21: '4',
            22: '6',
            23: '5',
            24: ']',
            25: '9',
            26: '7',
            27: '[',
            28: '8',
            29: '0',
            30: '=',
            31: 'R',
            32: 'G',
            33: '/',
            34: 'C',
            35: 'L',
            36: '&#x000D;',
            37: 'N',
            38: 'H',
            39: '-',
            40: 'T',
            41: 'S',
            42: '\\',
            43: 'W',
            44: 'Z',
            45: 'B',
            46: 'M',
            47: 'V',
            48: '&#x0009;',
            49: ' ',
            50: '`',
            51: '&#x0008;',
            53: '&#x001B;',
            64: '&#x0010;',
            66: '&#x001D;',
            67: '*',
            69: '+',
            70: '&#x001C;',
            71: '&#x001B;',
            72: '&#x001F;',
            75: '/',
            76: '&#x0003;',
            77: '&#x001E;',
            78: '-',
            79: '&#x0010;',
            80: '&#x0010;',
            81: '=',
            82: '0',
            83: '1',
            84: '2',
            85: '3',
            86: '4',
            87: '5',
            88: '6',
            89: '7',
            91: '8',
            92: '9',
            96: '&#x0010;',
            97: '&#x0010;',
            98: '&#x0010;',
            99: '&#x0010;',
            100: '&#x0010;',
            101: '&#x0010;',
            103: '&#x0010;',
            105: '&#x0010;',
            106: '&#x0010;',
            107: '&#x0010;',
            109: '&#x0010;',
            111: '&#x0010;',
            113: '&#x0010;',
            114: '&#x0005;',
            115: '&#x0001;',
            116: '&#x000B;',
            117: '&#x007F;',
            118: '&#x0010;',
            119: '&#x0004;',
            120: '&#x0010;',
            121: '&#x000C;',
            122: '&#x0010;',
            123: '&#x001C;',
            124: '&#x001D;',
            125: '&#x001F;',
            126: '&#x001E;',
        },
        6: {
            0: '',
            36: '&#x000D;',
            48: '&#x0009;',
            51: '&#x0008;',
            53: '&#x001B;',
            64: '&#x0010;',
            66: '&#x001D;',
            70: '&#x001C;',
            71: '&#x001B;',
            72: '&#x001F;',
            76: '&#x0003;',
            77: '&#x001E;',
            79: '&#x0010;',
            80: '&#x0010;',
            96: '&#x0010;',
            97: '&#x0010;',
            98: '&#x0010;',
            99: '&#x0010;',
            100: '&#x0010;',
            101: '&#x0010;',
            103: '&#x0010;',
            105: '&#x0010;',
            106: '&#x0010;',
            107: '&#x0010;',
            109: '&#x0010;',
            111: '&#x0010;',
            113: '&#x0010;',
            114: '&#x0005;',
            115: '&#x0001;',
            116: '&#x000B;',
            117: '&#x007F;',
            118: '&#x0010;',
            119: '&#x0004;',
            120: '&#x0010;',
            121: '&#x000C;',
            122: '&#x0010;',
            123: '&#x001C;',
            124: '&#x001D;',
            125: '&#x001F;',
            126: '&#x001E;',
        },
    }
