from .helpers_for_tests import assertNotNullAndIsOfType

from .localAiProvider import sendRequestToLocalModel, runMultipleRequestsAsynchronously
import pytest
import time


def sendRequestToLocalModelAndAssert(prompt: str):
    res = sendRequestToLocalModel(prompt)
    assertNotNullAndIsOfType(res, str)


def test_sends_requests_to_local_model_and_gets_the_response():
    prompt = "Hello!"
    sendRequestToLocalModelAndAssert(prompt)


@pytest.mark.skip
def test_processing_hard_requests():
    prompts = ["Hello!",  "What can you do? Explain in 50 words",
               "Explain buble sort alrogithm in python in 100 words"]
    for prompt in prompts:
        sendRequestToLocalModelAndAssert(prompt)


# @pytest.mark.skip
def test_processing_asynchronously():
    start_time = time.time()
    prompts = ['What can you do? Explain in 50 words', "Hello!",
               "Explain buble sort algorithm in python in 100 words"]
    runMultipleRequestsAsynchronously(prompts)
    assert time.time() - start_time <= 15
