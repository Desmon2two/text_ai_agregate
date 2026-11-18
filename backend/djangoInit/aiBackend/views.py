from .requestValidation import validateRequestBodyAndReturnPrompt
from django.shortcuts import render
# Create your views here.
from django.http import HttpRequest, HttpResponse
from .localAiProvider import sendRequestToLocalModel


def index(request: HttpRequest):
    if hasattr(request, 'body') == False:
        raise Exception("No body attribute")
    prompt = validateRequestBodyAndReturnPrompt(request)
    response = sendRequestToLocalModel(prompt)
    return HttpResponse(response)
