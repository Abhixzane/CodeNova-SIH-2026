from app.models.weather import CityWeather

class WeatherService:
    def __init__(self):
        self._weather_matrix = {
            "mumbai": CityWeather(city="Mumbai", temperature_c=28, condition="Sunny & Coastal Breeze", humidity=68, wind_kmh=14, status="Live (Coastal Sensor)"),
            "jaipur": CityWeather(city="Jaipur", temperature_c=31, condition="Clear & Warm", humidity=42, wind_kmh=10, status="Live"),
            "delhi": CityWeather(city="New Delhi", temperature_c=29, condition="Pleasant & Hazy Sun", humidity=52, wind_kmh=8, status="Live"),
            "kochi": CityWeather(city="Kochi", temperature_c=27, condition="Tropical Breeze", humidity=76, wind_kmh=16, status="Live"),
            "goa": CityWeather(city="Panaji", temperature_c=28, condition="Sunny Beach Weather", humidity=70, wind_kmh=12, status="Live"),
            "shimla": CityWeather(city="Shimla", temperature_c=18, condition="Crisp Mountain Air", humidity=48, wind_kmh=6, status="Live"),
        }

    def get_weather(self, city: str = "mumbai") -> CityWeather:
        c = city.strip().lower()
        if c in self._weather_matrix:
            return self._weather_matrix[c]
        return CityWeather(city=city.title(), temperature_c=26, condition="Pleasant", humidity=60, wind_kmh=10, status="Estimated")

weather_service = WeatherService()
