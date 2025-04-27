from rest_framework import serializers
from .models import Plant, GardenLayout

class PlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plant
        fields = '__all__'


class GardenLayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = GardenLayout
        fields = '__all__'