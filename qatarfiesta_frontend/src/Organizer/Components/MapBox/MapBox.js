import React, {useState, useEffect} from 'react';
import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGl, { Marker, NavigationControl } from "react-map-gl";
import RoomIcon from '@mui/icons-material/Room';

function MapBox({ location, onLocationChange }) {

    const [newPlace, setNewPlace] = useState(null)
    const [zoomLevel, setZoomLevel] = useState(10);

    const [viewport, setViewport] = useState({
      latitude: location.latitude,
      longitude: location.longitude,
        zoom:zoomLevel,
    });

    const handleClick = (e) => {
        const { lng, lat } = e.lngLat;
        setNewPlace({
          lat: lat,
          long: lng,
        });
        onLocationChange({
          latitude: lat,
          longitude: lng,
        });
      };
    
    const handleZoom = (zoomDirection) => {
        const newZoom = zoomLevel + zoomDirection;
        const clampedZoom = Math.max(1, Math.min(newZoom, 20)); // Adjust the minimum and maximum zoom levels as needed
        setZoomLevel(clampedZoom);
        setViewport((prevViewport) => ({
          ...prevViewport,
          zoom: clampedZoom,
        }));
      };

      const handleDrag = (newViewport) => {
        setViewport(newViewport);
      };
      
      useEffect(() => {
        onLocationChange({
          latitude: newPlace?.lat || location.latitude,
          longitude: newPlace?.long || location.longitude,
        });
      }, [newPlace]);
    
  return (
    <div style={{width:"55vw", height:"50vh", zIndex:999}}>
          <ReactMapGl
        {...viewport}
        mapboxAccessToken="pk.eyJ1IjoiYXlzaGF0aGx1YmFiYWthIiwiYSI6ImNscmUwb3B6cTFpY2Eya3J2OWlkc3UyNnUifQ.cxRoYt7udL1JuqPO4HTPOg"
        width="100%"
        height="100%"
        transitionDuration={200}
        mapStyle="mapbox://styles/ayshathlubabaka/clre284hd00bo01qq6p35eyfi"
        onDrag={handleDrag}
        onDblClick={handleClick}
        
      >
        {newPlace && (
          <Marker
            latitude={newPlace?.lat}
            longitude={newPlace.long}
            offsetLeft={-12}
            offsetTop={-24}
          >
            <RoomIcon style={{ fontSize: 24, color: 'tomato', cursor: 'pointer' }} />
          </Marker>
        )}

        {/* Zoom In and Zoom Out Controls */}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <NavigationControl
            showCompass={false}
            captureScroll={true}
          />
        </div>
        {/* Custom Zoom In and Zoom Out Buttons */}
        <div style={{ position: 'absolute', top: 40, left: 10 }}>
        <button onClick={() => handleZoom(1)}>Zoom In</button>
          <button onClick={() => handleZoom(-1)}>Zoom Out</button>
        </div>
      </ReactMapGl>
    </div>
  )
}

export default MapBox
