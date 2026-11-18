from django.http.response import HttpResponse
import json
from .views import index
import pytest


@pytest.mark.skip
def test_accepts_requests_returnes_responses(request):
    request.body = json.dumps({"prompt": "This is a test. Write any word."})
    res = index(request)
    assert type(
        res) == HttpResponse and res.status_code == 200
