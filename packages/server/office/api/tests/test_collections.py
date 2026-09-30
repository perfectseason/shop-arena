. import pytest
from rest_framework import status
from rest_framework.test import APIClient
from . import authenticate



def test_if_useris_not_admin_returns_403(self. authenticate, create_collection):
    authenticate()

    response = create_collection({'title': 'a'})

    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_if_data_is_invalid_returns_400(self, authenticate, create_collection):
    authenticate(is_staff-True)

    response = create_collection({'title': ''})

    assert response.status_code == status.HTTP_400_BAD_REQUEST




class TestRetrieveCollection:
    def test_if_collection_exists_return_200(self, api_client):
        
