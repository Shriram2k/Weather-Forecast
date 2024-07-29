import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import axios from "axios";
import searchIcon from "./assets/search.svg";
import humidityIcon from "./assets/humidity.svg";
import windIcon from "./assets/wind.svg";

const CitySuggestions = ({
  text,
  setText,
  showSuggestions,
  onSuggestionClick,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (text.length < 1 || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      const apiKey = "3e97b9ceafb17e679bf73a275473a6d9";
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=${apiKey}`;

      try {
        const response = await axios.get(url);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(debounceFetch);
  }, [text, showSuggestions]);

  const handleSuggestionClick = (cityName) => {
    onSuggestionClick(cityName);
    setSuggestions([]);
  };

  return (
    <div className="suggestions-container">
      {loading && <div className="loading-msg">Loading...</div>}
      {showSuggestions && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() =>
                handleSuggestionClick(
                  `${suggestion.name}, ${suggestion.country}`
                )
              }
            >
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  long,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Weather Icon" />
      </div>
      <div className="temp">{temp} °C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cords">
        <div>
          <span className="lat">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="long">Longitude</span>
          <span>{long}</span>
        </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="humidity" className="icon" />
          <div className="data"></div>
          <div className="humidity-percentage">{humidity} %</div>
          <div className="text">Humidity</div>
        </div>
        <div className="element">
          <img src={windIcon} alt="wind" className="icon" />
          <div className="data">
            <div className="wind-percentage">{wind} km/h</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

WeatherDetails.propTypes = {
  icon: propTypes.string.isRequired,
  temp: propTypes.number.isRequired,
  city: propTypes.string.isRequired,
  country: propTypes.string.isRequired,
  humidity: propTypes.number.isRequired,
  wind: propTypes.number.isRequired,
  lat: propTypes.number.isRequired,
  long: propTypes.number.isRequired,
};

const WeatherForecast = () => {
  const apiKey = "3e97b9ceafb17e679bf73a275473a6d9";
  const [text, setText] = useState("");
  const [icon, setIcon] = useState("");
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const search = async () => {
    if (!text) return;
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod === "404") {
        console.error("City not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLong(data.coord.lon);
      const icon_Code = data.weather[0].icon;
      const site = `https://openweathermap.org/img/wn/${icon_Code}@2x.png`;
      setIcon(site || "");
      setCityNotFound(false);
    } catch (error) {
      console.error("An Error Occurred:", error.message);
      setError("An Error occurred while fetching data.");
    } finally {
      setLoading(false);
      setError(false);
    }
  };

  const handleCityChange = (e) => {
    setText(e.target.value);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (cityName) => {
    setText(cityName);
    search();
    setShowSuggestions(false);
  };

  useEffect(() => {
    // Removed the automatic search trigger
  }, [text]);

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          className="cityInput"
          placeholder="Search City"
          onChange={handleCityChange}
          value={text}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        <div className="search-icon">
          <img src={searchIcon} alt="Search" onClick={() => search()} />
        </div>
      </div>
      <CitySuggestions
        text={text}
        setText={setText}
        showSuggestions={showSuggestions}
        onSuggestionClick={handleSuggestionClick}
      />
      {loading && <div className="loading-msg">Loading...</div>}
      {error && <div className="error-msg">{error}</div>}
      {cityNotFound && <div className="city-not-found">City Not Found</div>}
      {!loading && !cityNotFound && (
        <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          long={long}
          humidity={humidity}
          wind={wind}
        />
      )}
      <p className="copyright">
        Design by{" "}
        <span>
          <a href="https://www.instagram.com/shriramkrishnan/">Shriram</a>
        </span>
      </p>
    </div>
  );
};

export default WeatherForecast;
