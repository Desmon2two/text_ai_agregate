from django.http.response import HttpResponse
from .helpers_for_tests import promptJsonConstructor, assertNotNullAndIsOfType
from .views import index
import pytest


def test_controller_accepts_requests_returnes_responses(request):
    request.body = promptJsonConstructor("Hello!")
    res = index(request)
    assertNotNullAndIsOfType(res, HttpResponse)
    assert res.status_code == 200
