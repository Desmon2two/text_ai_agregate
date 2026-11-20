from ollama import AsyncClient
import asyncio


def sendRequestToLocalModel(prompt: str):
    return asyncio.run(sendRequestToLocalModelAsync(prompt))


async def sendRequestToLocalModelAsync(prompt: str):
    message = {'role': 'user', 'content': f'{prompt}'}
    result = await AsyncClient().chat(model="gemma3:1b", messages=[message])
    response = result['message']['content']
    print(response)
    return response
