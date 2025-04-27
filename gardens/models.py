from django.db import models
from django.contrib.auth.models import User

class Plant(models.Model):
    name = models.CharField(max_length=100)
    sunlight = models.CharField(max_length=50)
    water_needs = models.CharField(max_length=50)
    planting_season = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class GardenLayout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    layout_data = models.JSONField()  # Stores grid data as JSON

    def __str__(self):
        return f"Garden Layout for {self.user.username}"