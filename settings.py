"""
.. module:: settings
   :synopsis: A file containing settings used globally throughout Symboard. They
   have been placed in one file so that they're easy to configure.

.. moduleauthor:: Andrew J. Young

"""
# Imports from the standard library
from typing import List, Dict


# Package settings {

PACKAGE_NAME = 'symboard'
""" The name of the package.
"""

VERSION: str = '0.4.0'
""" The current version of symboard being used, equivalent to a string
<major_version>.<minor_version>.<patch>
"""

DEFAULT_OUTPUT_PATH: str = './a.keylayout'
""" If no output path is specified, the keylayout will default to being written
to the path specified by DEFAULT_OUTPUT_PATH. This string can, but does not need
to, end in «.keylayout».
"""

OVERWRITE_OUTPUT: bool = False
""" Iff set to true, Symboard will overwrite a file stored at
<DEFAULT_OUTPUT_PATH>, if one exists. If set to false, an error will be thrown
when trying to do this.
"""

# States settings {

STATES_DIR = 'symboard/states'
""" The relative path to the directory containing definitions of states. These
states can be pre-defined by the Symboard project, or added by users.
"""

OUTPUT_DELIMITER: str = ','
""" The delimiter used by state files between key outputs. So, «abc» would
become the output of a single key, while «a,bc» would be the output of 2. Used
throughout the states defined in the states directory, and by State builders.
"""

DEFAULT_STATE_TERMINATOR: str = ' '
""" If no terminator is provided when a state is initialized, the default
terminator will be set to this value.
"""

STATE_ATTRIBUTE_PRECEDENCE: List[str] = [
    'lower',
    'upper',
    'map',
]
""" A list of all attributes which a state can have, listed in the order which
they are added to a state when parsed. Attributes later the list have higher
precedence, and will override the settings of attributes earlier in the list.
"""

ACTION_TO_UNICODE_MAP: Dict[str, str] = {
    # Arrows {

    'left': '&#x001C;',
    'right': '&#x001D;',
    'up': '&#x001E;',
    'down': '&#x001F;',

    # } Arrows

    # Punctuation {

    '\'': '&#x0027;',
    '\"': '&#x0022;',

    # { Punctuation
}
""" A map between the textual representation of a key (used in yaml files
describing states) to the unicode representation required by keylayout files.
Only characters which need to be represented using numerical unicode
representations are included in this map (EG «\'», but not «a»).
"""


# } States settings
# } Package settings
# Import using dotenv {

from dotenv import load_dotenv
# Explicitly providing path to '.env', with verbosity.
env_path = './.env.pub'
load_dotenv(dotenv_path=env_path, verbose=True)

# } Import using dotenv

