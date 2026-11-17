from django.http import HttpRequest


def validateRequest(request: HttpRequest):
    if hasattr(request, 'body') == False:
        raise Exception("No body attribute")
    bd = request.body
    if isinstance(bd, str) != True:
        raise Exception("Non strings are not allowed")
    if len(bd) <= 0:
        raise Exception("Empty strings are not allowed")
