import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import locations from './locations.json';
import { Search } from 'lucide-react';
import './style.css';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(locations);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setFilteredLocations(
      locations.filter(
        loc =>
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]);

  // Initialize the map only once
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-2.3, 53.0],
      zoom: 6.5
    });

    map.current.on('load', () => {
      renderMarkers(filteredLocations);
    });

    // Clean up on unmount
    return () => map.current.remove();
  }, []);

  // Update markers when filteredLocations change
  useEffect(() => {
    if (!map.current.loaded()) return;
    renderMarkers(filteredLocations);
  }, [filteredLocations]);

  // Function to handle marker rendering
  const renderMarkers = (locations) => {
    // Clear existing markers first
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    locations.forEach(loc => {
      const marker = new mapboxgl.Marker({ color: '#ff7f00' })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map.current)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(loc.name));

      marker.getElement().addEventListener('click', () => {
        setSelectedLocation(loc);
        setSidebarOpen(true);
      });

      markers.current.push(marker);
    });
  };

  return (
    <div className="container">
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <button className="toggle-btn" onClick={() => setSidebarOpen(false)}>
          Close
        </button>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search stores or countries"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="location-details">
          {selectedLocation ? (
            <>
              <h2>{selectedLocation.name}</h2>
              <p>{selectedLocation.address}</p>
            </>
          ) : (
            <p>Click a pin for details.</p>
          )}
        </div>

        <hr />

        <div className="search-results">
          {filteredLocations.map((loc, idx) => (
            <div
              key={idx}
              className="result-item"
              onClick={() => {
                map.current.flyTo({ center: [loc.lng, loc.lat], zoom: 12 });
                setSelectedLocation(loc);
              }}
            >
              {loc.name}
            </div>
          ))}
        </div>
      </div>

      {!sidebarOpen && (
        <div className="sidebar-tab" onClick={() => setSidebarOpen(true)}>
          Open
        </div>
      )}

      <div ref={mapContainer} className="map-container"></div>
    </div>
  );
}

export default App;
