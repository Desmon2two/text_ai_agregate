from django.http import HttpRequest
import json


def validateRequestBodyAndReturnPrompt(request: HttpRequest):
    if hasattr(request, 'body') == False:
        raise Exception("No body attribute")
    try:
        pr = json.loads(request.body)['prompt']
    except:
        raise Exception("There was an error with parsing json")
    if isinstance(pr, str) != True:
        raise Exception("Non strings are not allowed")
    if len(pr) <= 0:
        raise Exception("Empty strings are not allowed")
    return pr
