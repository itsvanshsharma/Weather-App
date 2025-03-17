# Weather Application

A modern, responsive weather application that provides real-time weather information and 7-day forecasts for any location worldwide. Built with Node.js, Express, and vanilla JavaScript.

## Features

- 🌍 Real-time weather data for any location
- 📱 Responsive design that works on all devices
- 🗺️ Interactive Google Maps integration
- 📊 Detailed weather information including:
  - Current temperature
  - Humidity
  - Wind speed and direction
  - Pressure
  - Precipitation
  - Cloud cover
- 📅 7-day weather forecast
- 📍 Location-based weather using geolocation
- 🔍 City search functionality

## Technologies Used

- **Frontend:**
  - HTML5
  - CSS3
  - Vanilla JavaScript
  - Google Maps API

- **Backend:**
  - Node.js
  - Express.js
  - WeatherAPI.com API

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- A WeatherAPI.com API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/itsvanshsharma/Weather-App.git
cd Weather-App
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your WeatherAPI.com API key:
```env
WEATHER_API_KEY=your_api_key_here
```

4. Start the server:
```bash
npm start
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. **Search by City:**
   - Enter a city name in the search box
   - Click the search button or press Enter

2. **Use Current Location:**
   - Click the geolocation button
   - Allow location access when prompted

3. **View Weather Details:**
   - Current weather conditions
   - Detailed weather metrics
   - 7-day forecast
   - Location on map

## API Endpoints

- `GET /api/weather/:city` - Get current weather for a city
- `GET /api/weather/:lat,:lon` - Get current weather by coordinates
- `GET /api/forecast/:lat/:lon` - Get 7-day forecast by coordinates

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

