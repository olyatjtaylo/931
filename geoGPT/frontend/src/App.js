// App.js
import React, { useState, useCallback } from 'react';
import './App.css';
import MapView from './MapView';
import ChatInterface from './ChatInterface';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [aiResponseLocation, setAiResponseLocation] = useState(null);

  // Memoize the handleLocationSelect function
  const handleLocationSelect = useCallback((location) => {
    setSelectedLocation(location);
  }, []);

  return (
    <div className="App">
      <div className="main-container">
        <div className="map-container">
          <MapView
            onLocationSelect={handleLocationSelect}
            aiResponseLocation={aiResponseLocation}
          />
        </div>
        <div className="chat-container">
          <ChatInterface
            selectedLocation={selectedLocation}
            setAiResponseLocation={setAiResponseLocation}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
