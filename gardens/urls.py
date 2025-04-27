from django.urls import path
from .views import PlantListCreate, GardenLayoutView, PlantListView, fetch_common_plants, search_plants

urlpatterns = [
    path('plants/', PlantListCreate.as_view(), name='plant-list'),
    path('garden-layout/', GardenLayoutView.as_view(), name='garden-layout'),
    path('plants/', PlantListView.as_view(), name='plant-list'),
    path('common-plants/', fetch_common_plants, name='common-plants'),
    path('search-plants/', search_plants, name='search-plants'),
]
