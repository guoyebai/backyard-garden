from django.shortcuts import render
from rest_framework import generics
from .models import Plant, GardenLayout
from .serializers import PlantSerializer, GardenLayoutSerializer
import requests
from django.http import JsonResponse
from django.conf import settings

class PlantListCreate(generics.ListCreateAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer

class PlantListView(generics.ListAPIView):
    queryset = Plant.objects.all()
    serializer_class = PlantSerializer

class GardenLayoutView(generics.ListCreateAPIView):
    queryset = GardenLayout.objects.all()
    serializer_class = GardenLayoutSerializer

# Predefined list of common vegetables and fruits
COMMON_PLANTS = [
    "Tomato", "Carrot", "Lettuce", "Spinach", "Potato",
    "Cucumber", "Strawberry", "Pepper", "Corn", "Pumpkin",
    "Watermelon", "Onion", "Garlic", "Cabbage", "Zucchini"
]

def fetch_common_plants(request):
    plants = []

    for plant_name in COMMON_PLANTS:
        url = f"https://openfarm.cc/api/v1/crops/?filter={plant_name}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            if data.get("data"):
                plant_data = data["data"][0]  # Get first match
                plants.append({
                    "id": plant_data["id"],
                    "name": plant_data["attributes"]["name"],
                    "image": plant_data["attributes"].get("main_image_path", ""),
                    "sunlight": plant_data["attributes"].get("sun_requirements", "Unknown"),
                    "water_needs": plant_data["attributes"].get("watering", "Unknown"),
                    "planting_season": plant_data["attributes"].get("sowing_method", "Unknown"),
                })

    return JsonResponse(plants, safe=False)
    
def search_plants(request):
    query = request.GET.get("query", "").strip()
    if not query:
        return JsonResponse({"error": "No search query provided"}, status=400)

    url = f"https://openfarm.cc/api/v1/crops/?filter={query}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        plants = [
            {
                "id": plant["id"],
                "name": plant["attributes"]["name"],
                "image": plant["attributes"].get("main_image_path", ""),
                "sunlight": plant["attributes"].get("sun_requirements", "Unknown"),
                "water_needs": plant["attributes"].get("watering", "Unknown"),
                "planting_season": plant["attributes"].get("sowing_method", "Unknown"),
            }
            for plant in data.get("data", []) if plant.get("attributes")
        ]
        return JsonResponse(plants, safe=False)
    else:
        return JsonResponse({"error": "Failed to fetch plants"}, status=500)
