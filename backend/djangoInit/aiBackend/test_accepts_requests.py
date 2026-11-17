from django.http.response import HttpResponse
from .views import index


def test_accepts_requests_returnes_responses(request):
    request.body = 'Hello!'
    res = index(request)
    assert type(
        res) == HttpResponse and res.status_code == 200
