import pytest
from hypothesis import given, strategies as st
from .models import mockJob, mockUser, Job, User


@pytest.mark.django_db
def test_correctly_inputs_and_fetches_data():
    assert Job.objects.get(pk=mockJob('Hello').pk) != None
    with pytest.raises(ValueError):
        Job.objects.get(pk='Something')
    with pytest.raises(Job.DoesNotExist):
        Job.objects.get(pk=999999)


@pytest.mark.django_db
def test_correctly_deletes_data():
    assert Job.objects.get(pk=mockJob("Smth").pk).delete() != None


@pytest.mark.django_db
def test_correctly_updates_data():
    firstJob = mockJob("First iteration")
    firstJob.prompt = "Now"
    firstJob.save()
    assert Job.objects.get(pk=firstJob.pk).prompt == "Now"
