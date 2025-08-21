import React, { useState, useEffect } from 'react';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = 'f73476cd654d4a6bb8352455250708'; // Replace with your WeatherAPI key
  const location = 'Chennai';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=yes`
        );
        const data = await res.json();
        setWeatherData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWeather();
  }, []);

  const isThunderstorm = weatherData?.current?.condition?.text
    ?.toLowerCase()
    .includes('thunder');

  const boxStyle = {
  fontFamily: 'Segoe UI, sans-serif',
  background: 'rgba(255, 255, 255, 0.15)', // translucent white
  backdropFilter: 'blur(10px)', // glass blur
  WebkitBackdropFilter: 'blur(10px)', // Safari support
  borderRadius: '18px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  maxWidth: '850px',
  margin: '30px auto',
  padding: '30px',
  color: '#fff', // white text on glass
  border: '1px solid rgba(255, 255, 255, 0.18)',
};


  const sectionStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const col = {
    flex: '1 1 45%',
    margin: '10px 0',
  };

  const largeTemp = {
    fontSize: '60px',
    fontWeight: 'bold',
    margin: '0',
  };

  const forecastStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  };

  const card = {
    backgroundColor: '#ffffff',
    padding: '12px',
    borderRadius: '12px',
    textAlign: 'center',
    width: '90px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  const label = {
    fontWeight: 'bold',
    marginBottom: '4px',
  };

  return (
    <div style={boxStyle}>
      {weatherData ? (
        <>
          <h2>
            {weatherData.location.name}, {weatherData.location.region}{' '}
            <span style={{ fontWeight: 'normal' }}>
              {new Date().toLocaleTimeString()}
            </span>
          </h2>
          <p>Updated a few minutes ago</p>

          <div style={sectionStyle}>
            <div style={col}>
              <div style={largeTemp}>
                {weatherData.current.temp_c}°<span style={{ fontSize: '30px' }}>C</span>
              </div>
              <p style={{ fontSize: '20px' }}>
                {weatherData.current.condition.text}
              </p>
              <p>
                H{weatherData.forecast.forecastday[0].day.maxtemp_c}° L
                {weatherData.forecast.forecastday[0].day.mintemp_c}°
              </p>
              <p>
                {isThunderstorm
                  ? '⚠️ Not safe for fishing (Thunderstorm)'
                  : '✅ Safe for fishing'}
              </p>
            </div>

            <div style={col}>
              <p style={label}>Humidity: {weatherData.current.humidity}%</p>
              <p style={label}>Wind: {weatherData.current.wind_kph} km/h</p>
              <p style={label}>Pressure: {weatherData.current.pressure_mb} mb</p>
              <p style={label}>Visibility: {weatherData.current.vis_km} km</p>
              <p style={label}>AQI: {weatherData.current.air_quality.pm2_5.toFixed(1)}</p>
            </div>
          </div>

          <h3>3-Day Forecast</h3>
          <div style={forecastStyle}>
            {weatherData.forecast.forecastday.map((day, index) => (
              <div key={index} style={card}>
                <p style={label}>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <img src={day.day.condition.icon} alt="icon" />
                <p>{day.day.avgtemp_c}°C</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading weather info...</p>
      )}
    </div>
  );
}

export default Weather;
