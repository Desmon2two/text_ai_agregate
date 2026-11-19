import ollama
from multiprocessing import Process


def sendRequestToLocalModel(prompt: str):
    result = ollama.generate(model="gemma3:1b", prompt=prompt)
    print(result['response'])
    return result['response']


def runMultipleRequestsAsynchronously(prompts: list[str]):
    for prompt in prompts:
        p = Process(target=sendRequestToLocalModel, args=(prompt,))
        p.start()
        p.join()
