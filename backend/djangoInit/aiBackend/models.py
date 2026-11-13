from django.db import models

# Create your models here.


class User(models.Model):
    created_at = models.DateTimeField("Date created at")


class Job(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    prompt = models.TextField(max_length=10000).default
    data = models.TextField(max_length=10000).null
    created_at = models.DateTimeField("Date created at")
    completed_at = models.DateTimeField("Date completed at")
