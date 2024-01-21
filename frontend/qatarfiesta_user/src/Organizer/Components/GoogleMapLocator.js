import React, {useState} from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

function GoogleMapLocator({ onLocationSelect }) {

    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleMapClick = (e) => {
      setSelectedLocation({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    };
  
    const handleConfirmLocation = () => {
      if (selectedLocation) {
        onLocationSelect(selectedLocation);
      }
    };
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
    <GoogleMap
      mapContainerStyle={{ height: '400px', width: '100%' }}
      zoom={10}
      center={{ lat: selectedLocation?.lat || 0, lng: selectedLocation?.lng || 0 }}
      onClick={handleMapClick}
    >
      {selectedLocation && <Marker position={selectedLocation} />}
    </GoogleMap>

    <button onClick={handleConfirmLocation}>Confirm Location</button>
  </LoadScript>
  )
}

export default GoogleMapLocator
