import json


def promptJsonConstructor(insertable):
    return json.dumps({"prompt": insertable})


def assertNotNullAndIsOfType(assertable, type):
    assert assertable != None and isinstance(assertable, type) == True
