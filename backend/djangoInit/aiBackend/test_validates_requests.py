import pytest
import json
from hypothesis import assume, given, strategies as st
from .requestValidation import validateRequestBodyAndReturnPrompt


@given(insertable=(st.integers() | st.none() | st.booleans() | st.floats()))
def test_does_not_allow_anything_othen_than_non_null_strings(request, insertable):
    # TODO
    # UNDERSTAND MAGIC FUNCTIONS (__SMTH__)
    with pytest.raises(Exception):
        request.body = f'{"prompt": "{insertable}"}'
        validateRequestBodyAndReturnPrompt(request)


@given(ins=st.text())
def test_allows_only_non_null_strings(request, ins):
    request.body = json.dumps({"prompt": ins})
    if ins == '':
        with pytest.raises(Exception):
            validateRequestBodyAndReturnPrompt(request)
    else:
        assert validateRequestBodyAndReturnPrompt(request) == ins
