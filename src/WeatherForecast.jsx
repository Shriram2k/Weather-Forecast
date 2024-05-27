// import

import searchIcon from "./assets/search.svg";
import cloudyIcon from "./assets/cloudy.svg";
import drizzleIcon from "./assets/drizzle.svg";
import humidityIcon from "./assets/humidity.svg";
import rainingIcon from "./assets/raining.svg";
import snowIcon from "./assets/snow.svg";
import stormIcon from "./assets/storm.svg";
import sunIcon from "./assets/sun.svg";
import sunnyIcon from "./assets/sunny.svg";
import windIcon from "./assets/wind.svg";
import { useEffect, useState } from "react";
import propTypes from "prop-types";

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
        <img src={icon} alt="Image" />
      </div>
      <div className="temp">{temp} °C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cords">
        <div>
          <span className="lat">Lattitude</span>
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
  let api_key = "3e97b9ceafb17e679bf73a275473a6d9";
  const [text, setText] = useState("Batman");
  const [icon, setIcon] = useState("");
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [cords, setCords] = useState(0);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();
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
      setIcon(site || clearIcon);
      setCityNotFound(false);
    } catch (error) {
      console.error("An Error Occured:", error.message);
      setError("An Error occured while fetching data.");
    } finally {
      setLoading(false);
      setError(false);
    }
  };
  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };
  useEffect(function () {
    search();
  }, []);

  return (
    <div className="container">
      <div className="input-container">
        <input
          type="text"
          className="cityInput"
          placeholder="Search City"
          onChange={handleCity}
          value={text}
          onKeyDown={handleKeyDown}
        />
        <div className="search-icon">
          <img src={searchIcon} alt="Search" onClick={() => search()} />
        </div>
      </div>

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
          {" "}
          <a href="https://www.instagram.com/shriramkrishnan/">Shriram</a>
        </span>
      </p>
    </div>
  );
};

export default WeatherForecast;
