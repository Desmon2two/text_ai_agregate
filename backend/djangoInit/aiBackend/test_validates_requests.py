import pytest
from hypothesis import given, strategies as st
from .requestValidation import validateRequest


@given(insertable=st.integers() | st.text())
def test_validates_provided_input(request, insertable):
    # TODO
    # UNDERSTAND OBJECTS IN PYTHON
    # UNDERSTAND MAGIC FUNCTIONS (__SMTH__)
    # EXPOSE VALIDATION TO A TORRENT OF RANDOM AND UNUSUAL INPUTS FROM HYPOTHESIS
    # LEARN HOW TO EFFECTIVELY USE HYPOTHESIS, AND TYPE CHECKING IN GENERAL IN TESTS
    with pytest.raises(Exception):
        request.body = insertable
        validateRequest(request)
