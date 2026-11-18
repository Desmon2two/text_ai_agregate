import ollama


def sendRequestToLocalModel(prompt: str):
    result = ollama.generate(model="gemma3:1b", prompt=prompt)
    return result['response']
