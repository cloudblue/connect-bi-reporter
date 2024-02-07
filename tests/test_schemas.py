import pytest

from connect_bi_reporter.schemas import flatten


@pytest.mark.parametrize(
    'test_case,expected',
    (
        (
            {
                'greatgrandparent': {
                    'grandparent': {
                        'parent': {
                            'child1': 'test',
                            'child2': 'other_test',
                        },
                    },
                },
            },
            {
                'greatgrandparent_grandparent_parent_child1': 'test',
                'greatgrandparent_grandparent_parent_child2': 'other_test',
            },
        ),
        (
            {'parent': {'child': 'test'}, 'mother': 'other'},
            {'parent_child': 'test', 'mother': 'other'},
        ),
    ),
)
def test_flatten(test_case, expected):
    assert flatten(test_case) == expected
