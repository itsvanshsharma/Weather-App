const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Weather data endpoint
app.get('/api/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=447fffe54fef4ecd80f143636251703&q=${city}`);
        
        // Transform the data to our custom format
        const weatherData = {
            name: response.data.location.name,
            coord: {
                lat: response.data.location.lat,
                lon: response.data.location.lon
            },
            temp: response.data.current.temp_c,
            humidity: response.data.current.humidity,
            wind_speed: response.data.current.wind_kph,
            description: response.data.current.condition.text,
            icon: response.data.current.condition.icon,
            location: {
                name: response.data.location.name,
                region: response.data.location.region,
                country: response.data.location.country,
                lat: response.data.location.lat,
                lon: response.data.location.lon,
                localtime: response.data.location.localtime
            },
            current: {
                temp_c: response.data.current.temp_c,
                temp_f: response.data.current.temp_f,
                humidity: response.data.current.humidity,
                wind_kph: response.data.current.wind_kph,
                wind_dir: response.data.current.wind_dir,
                pressure_mb: response.data.current.pressure_mb,
                precip_mm: response.data.current.precip_mm,
                cloud: response.data.current.cloud,
                feelslike_c: response.data.current.feelslike_c,
                uv: response.data.current.uv
            }
        };
        
        res.json(weatherData);
    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Daily forecast endpoint
app.get('/api/forecast/:lat/:lon', async (req, res) => {
    try {
        const { lat, lon } = req.params;
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json?key=447fffe54fef4ecd80f143636251703&q=${lat},${lon}&days=7`);
        
        const forecastData = {
            daily: response.data.forecast.forecastday.map(day => ({
                day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' }),
                temp: day.day.avgtemp_c,
                temp_min: day.day.mintemp_c,
                temp_max: day.day.maxtemp_c,
                humidity: day.day.avghumidity,
                wind_speed: day.day.maxwind_kph,
                description: day.day.condition.text,
                icon: day.day.condition.icon,
                sunrise: day.astro.sunrise,
                sunset: day.astro.sunset,
                population: response.data.location.country
            }))
        };

        // Ensure we have exactly 7 days of forecast
        if (forecastData.daily.length !== 7) {
            console.error('Expected 7 days of forecast, got:', forecastData.daily.length);
            throw new Error('Invalid forecast data');
        }

        res.json(forecastData);
    } catch (error) {
        console.error('Error fetching forecast:', error);
        res.status(500).json({ error: 'Failed to fetch forecast data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});