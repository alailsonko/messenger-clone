from django.urls import path, include
from .viewsets import RegisterAPI

urlpatterns = [
    path('auth/register', RegisterAPI.as_view()),
]