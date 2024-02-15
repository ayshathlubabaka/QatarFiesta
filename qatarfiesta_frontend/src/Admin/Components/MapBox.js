import React, {useEffect} from 'react'
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from 'mapbox-gl';

function MapBox({longitude, latitude}) {
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYXlzaGF0aGx1YmFiYWthIiwiYSI6ImNscmUwb3B6cTFpY2Eya3J2OWlkc3UyNnUifQ.cxRoYt7udL1JuqPO4HTPOg';
        const map = new mapboxgl.Map({
          container: 'map', 
          style: 'mapbox://styles/mapbox/streets-v11', 
          center: [longitude,latitude], 
          zoom: 12, 
        });
    
        
        new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
      }, [])
  return (
    <div>
    <div id="map" style={{ width: '100%', height: '400px' }}></div>
  </div>
  )
}

export default MapBox
