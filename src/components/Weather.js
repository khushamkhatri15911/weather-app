import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import humidity_icon from '../assets/humidity.png';
import wind_icon from '../assets/wind.png';

const Weather = () => {
  const inputRef = useRef();
  const [weatherdata, setWeatherdata] = useState(false);

  const search = async (city) => {
    const cityName = city.trim();

    if (cityName === "") {
      alert("Enter city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${process.env.REACT_APP_ID}`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Create the icon URL from the API
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

      setWeatherdata({
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s -> km/h
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: iconUrl,
        description: data.weather[0].description,
      });
    } catch (error) {
      setWeatherdata(false);
      console.error('Error in fetching weather data');
    }
  };

  useEffect(() => {
    search('airdrie');
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={(e) => e.key === 'Enter' && search(inputRef.current.value)}
        />
        <img
          src={search_icon}
          alt="Search Icon"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {weatherdata ? (
        <>
          <img src={weatherdata.icon} alt="Weather Icon" className="weather-icon" />
          <p className="description">{weatherdata.description}</p>
          <p className="temperature">{weatherdata.temperature}°c</p>
          <p className="Location">{weatherdata.location}</p>

          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity Icon" />
              <div>
                <p>{weatherdata.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>

            <div className="col">
              <img src={wind_icon} alt="Wind Speed Icon" />
              <div>
                <p>{weatherdata.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Weather;
