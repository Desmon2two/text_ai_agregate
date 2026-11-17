from django.db import models
from datetime import datetime, timezone
# Create your models here.


def mockUser():
    return User.objects.create()


def mockJob(prompt: str):
    return Job.objects.create(user=mockUser(), prompt=prompt)


class User(models.Model):
    created_at = models.DateTimeField(
        "Date created at", default=datetime.now(timezone.utc))


class Job(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt = models.TextField(max_length=10000)
    data = models.TextField(max_length=10000, null=True)
    created_at = models.DateTimeField(
        "Date created at", default=datetime.now(timezone.utc))
    completed_at = models.DateTimeField(
        "Date completed at", default=datetime.now(timezone.utc))
