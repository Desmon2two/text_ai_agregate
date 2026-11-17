from .requestValidation import validateRequest

from django.shortcuts import render

# Create your views here.
from django.http import HttpRequest, HttpResponse


def index(request: HttpRequest):
    validateRequest(request)
    return HttpResponse(b"Hello work. This is the start page")
