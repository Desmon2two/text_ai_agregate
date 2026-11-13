import pytest
from hypothesis import given, strategies as st
from database import


def test_creates_tables():
    createOne()
    assert findOne() != None


@given(st.lists(st.integers() | st.floats() | st.text()))
def test_does_not_allow_invalid_inputs():
    assert pytest.raises(dbTemplateInput(1st)):
        1 / 0


def test_correctly_fetches_data():
def test_correctly_inputs_data():
def test_correctly_deletes_data():
def test_correctly_updates_data():
def test_():
def test_():
def test_():
