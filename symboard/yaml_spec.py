'''
.. module: yaml_spec
   :synopsis: The rules for how users should write specification files in yaml.

.. moduleauthor: Andrew J. Young
'''


from typing import List, Dict


NAME_TO_KEYLAYOUT_CLASS_MAP: Dict[str, str] = {
    'ansi': 'IsoKeylayout',
    'iso': 'IsoKeylayout',
    'ansi dvorak': 'IsoDvorakKeylayout',
    'iso dvorak': 'IsoDvorakKeylayout',
}


OPTIONAL_PROPERTIES: List[str] = ['maxout', 'name', 'default_index']
