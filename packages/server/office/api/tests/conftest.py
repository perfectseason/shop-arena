from rest_framework import APIClient

from packages.server.office.core.models import User
. import pytest


@pytest.fixure
def authenticate(api_client): 
    def do_authenticate(is_staff=False):
       return api_client.force_authenticate(user=User(is_staff=is_staff))
    return do_authenticate
