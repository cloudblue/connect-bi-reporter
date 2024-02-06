from typing import Any, Dict


def flatten(d: Dict[Any, Any]):
    """
    Transform nested dict to flat.
        :param data: dict
        :rtype: dict

    ```
    >>> d = {
        'greatgrandparent': {
            'grandparent': {
                'parent': {
                    'child1': 'test',
                    'child2': 'other_test',
                },
            },
        },
    }
    >>> flatten(d)
    {
        'greatgrandparent_grandparent_parent_child1': 'test',
        'greatgrandparent_grandparent_parent_child2': 'other_test',
    }

    ```
    """
    out = {}
    for key, val in d.items():
        if isinstance(val, dict):
            val = [val]
        if isinstance(val, list):
            for subdict in val:
                deeper = flatten(subdict).items()
                out.update(
                    {key + '_' + key2: val2 for key2, val2 in deeper},
                )
        else:
            out[key] = val
    return out
