import React, { useState, useEffect } from 'react';
import LocationList from './LocationList';
import { buildCoordsByDistance } from './services/coordinate-utils';
import { getLatLong, getWeather } from './services/api-utils';
import Spinner from './Spinner';


export default function SearchPage() {
  const [userZip, setUserZip] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userCoords, setUserCoords] = useState({});
  //eslint-disable-next-line
  const [distanceInkm, setDistanceInkm] = useState(200);
  const [forecasts, setForecasts] = useState([]);

  useEffect(() => {
    async function fetch() {
      const latLongArray = buildCoordsByDistance(userCoords.lat, userCoords.long, distanceInkm);
      const promises = latLongArray.map((latLong) => getWeather(latLong.lat, latLong.long));
      const weatherArray = await Promise.all(promises);
      setForecasts(weatherArray);
      setIsLoading(false);
    }

    if (userCoords.lat) {
      fetch();
    }

  }, [userCoords, distanceInkm]);

  async function handleSubmit(e) {
    setIsLoading(true);
    e.preventDefault();
    const latLong = await getLatLong(userZip);
    setUserCoords(latLong);
  }

  return (
    <>
      <div className='search'>
        <form onSubmit={handleSubmit}>
          <input placeholder='Your Zipcode' value={userZip} onChange={e => setUserZip(e.target.value)} />
          <button type='submit'>Search</button>
        </form>
      </div>
      <div className='results'>
        { isLoading && <Spinner/>}
        {forecasts.length
          ? <LocationList locations={forecasts} userCoords={userCoords} /> 
          : <p className='shorten'>Enter your ZIP Code and click search to get a list of sunny locations within 200 km of you! Click on a location to add it to your favorites list.</p>
        }
      </div>
    </>
  );
}
