from .helpers_for_tests import assertNotNullAndIsOfType

from .localAiProvider import sendRequestToLocalModel
import pytest


def sendRequestToLocalModelAndAssert(prompt: str):
    res = sendRequestToLocalModel(prompt)
    assertNotNullAndIsOfType(res, str)


def test_sends_requests_to_local_model_and_gets_the_response():
    prompt = "Hello!"
    sendRequestToLocalModelAndAssert(prompt)


# @pytest.mark.skip
def test_processing_hard_requests():
    prompts = ["Hello!",  "What can you do? Explain in 50 words",
               "Explain buble sort alrogithm in python in 100 words"]
    for prompt in prompts:
        sendRequestToLocalModelAndAssert(prompt)
