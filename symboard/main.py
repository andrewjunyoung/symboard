"""
.. module:: main
   :synopsis: The entry point for the symboard executable when run on the command
   line.

.. moduleauthor:: Andrew J. Young

"""

# Imports from third party packages.
from argparse import ArgumentParser
import logging

# Imports from the local package.
from symboard.orchestrator import Orchestrator
from settings import VERSION

def get_arg_parser() -> ArgumentParser:
    """
    Returns:
        ArgumentParser: An ArgumentParser instance which will parse the
            arguments provided to Symboard when executed from the command line.
    """

    parser = ArgumentParser(
        description='Create a keylayout file from a symboard file.'
    )

    parser.add_argument('input_file_path', type=str, nargs=1,
            help='''The file path of the .symboard file which you want to make a
            keyboard layout from.''',)
    parser.add_argument('output_file_path', type=str, nargs=1,
            default='./a.keylayout',
            help='''The file path for where you want to save the .keylayout that
            symboard creates.''',)

    return parser


def main() -> None:
    """ The main method (entry point) for symboard. This function parses the
    input arguments, and calls the orchestrator to handle the execution of
    Symboard with respect to these arguments.
    """
    logging.info(f'!!! Starting up Ṡymβoarð (Symboard) version {VERSION} !!!')

    logging.info('Parsing command line arguments.')
    arg_parser: ArgumentParser = get_arg_parser()
    args = arg_parser.parse_args()

    logging.info('Running orchestrator.')
    orchestrator = Orchestrator()
    orchestrator.run(args.input_file_path[0], args.output_file_path[0])


if __name__ == '__main__':
    main()

