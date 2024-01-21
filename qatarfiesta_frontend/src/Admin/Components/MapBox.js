import React, {useEffect} from 'react'
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from 'mapbox-gl';

function MapBox({longitude, latitude}) {
    useEffect(() => {
        // Initialize Mapbox GL map
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXlzaGF0aGx1YmFiYWthIiwiYSI6ImNscmUwb3B6cTFpY2Eya3J2OWlkc3UyNnUifQ.cxRoYt7udL1JuqPO4HTPOg';
        const map = new mapboxgl.Map({
          container: 'map', // Specify the container ID
          style: 'mapbox://styles/mapbox/streets-v11', // Specify the map style
          center: [longitude,latitude], // Specify the initial center of the map [longitude, latitude]
          zoom: 12, // Specify the initial zoom level
        });
    
        // Add a marker for your location
        new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
      }, [])
  return (
    <div>
    <div id="map" style={{ width: '100%', height: '400px' }}></div>
    {/* Additional content goes here */}
  </div>
  )
}

export default MapBox
