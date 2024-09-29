// MapView.js
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

const MapView = ({ aiResponseLocation, onLocationSelect }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Initialize map only once
  useEffect(() => {
    // Create the map instance
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9,
    });

    // Add navigation control (optional)
    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add click event listener
    mapRef.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      console.log(`Clicked at longitude: ${lng}, latitude: ${lat}`);

      if (onLocationSelect) {
        onLocationSelect({ lng, lat });
      }
    });

    // Clean up on unmount
    return () => mapRef.current.remove();
  }, [onLocationSelect]); // Include 'onLocationSelect' in the dependency array

  // Add marker when aiResponseLocation changes
  useEffect(() => {
    if (aiResponseLocation && mapRef.current) {
      if (mapRef.current.marker) {
        mapRef.current.marker.remove();
      }

      mapRef.current.marker = new mapboxgl.Marker()
        .setLngLat([aiResponseLocation.lng, aiResponseLocation.lat])
        .addTo(mapRef.current);

      mapRef.current.flyTo({
        center: [aiResponseLocation.lng, aiResponseLocation.lat],
        zoom: 12,
      });
    }
  }, [aiResponseLocation]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default MapView;
