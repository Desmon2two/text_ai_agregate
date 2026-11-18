from .localAiProvider import sendRequestToLocalModel
import pytest


@pytest.mark.skip
def test_sends_requests_to_local_model_and_gets_the_response():
    prompt = "Hello!"
    res = sendRequestToLocalModel(prompt)
    assert res != None and isinstance(res, str) == True
