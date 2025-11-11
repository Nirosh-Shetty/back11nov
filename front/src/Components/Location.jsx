
import React, { useState, useEffect, useRef, useCallback } from 'react';

const LocationConfirmation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [address, setAddress] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);

  // Replace this with your actual Google Maps API Key
const API_KEY = "";




  // Initialize geocoder
  const initializeGeocoder = useCallback(() => {
    if (window.google && window.google.maps && !geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  }, []);

  // Get address from coordinates
  const getAddressFromCoordinates = useCallback(async (lat, lng) => {
    if (!window.google || !window.google.maps || !geocoderRef.current) {
      console.warn('Geocoder not available');
      setAddress('Address service not available');
      return;
    }

    setIsGeocoding(true);

    try {
      const response = await new Promise((resolve, reject) => {
        geocoderRef.current.geocode(
          { location: { lat, lng } }, 
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              resolve(results[0].formatted_address);
            } else if (status === 'ZERO_RESULTS') {
              resolve('No address found for this location');
            } else {
              reject(new Error(`Geocoding failed: ${status}`));
            }
          }
        );
      });
      
      setAddress(response);
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress('Address not available');
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Load Google Maps script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setScriptLoaded(true);
      initializeGeocoder();
      return;
    }

    if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      const checkGoogle = setInterval(() => {
        if (window.google && window.google.maps) {
          setScriptLoaded(true);
          initializeGeocoder();
          clearInterval(checkGoogle);
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setScriptLoaded(true);
      initializeGeocoder();
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps. Please check your API key.');
      setIsLoading(false);
    };
    
    document.head.appendChild(script);
  }, [initializeGeocoder]);

  // Get current location after script is loaded
  useEffect(() => {
    if (scriptLoaded) {
      getCurrentLocation();
    }
  }, [scriptLoaded]);

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = {
          lat: latitude,
          lng: longitude
        };
        setCurrentLocation(location);
        setSelectedLocation(location);
        
        if (scriptLoaded && mapRef.current) {
          initializeMap(location);
          getAddressFromCoordinates(location.lat, location.lng);
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError(`Unable to retrieve your location: ${error.message}`);
        
        const defaultLocation = { lat: 40.7128, lng: -74.0060 };
        setCurrentLocation(defaultLocation);
        setSelectedLocation(defaultLocation);
        
        if (scriptLoaded && mapRef.current) {
          initializeMap(defaultLocation);
          getAddressFromCoordinates(defaultLocation.lat, defaultLocation.lng);
        }
        
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Initialize Google Map with draggable marker
  const initializeMap = (location) => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.error('Map container not found or Google Maps not loaded');
      return;
    }

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 16,
        center: location,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "on" }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Create draggable marker for delivery location
      markerRef.current = new window.google.maps.Marker({
        position: location,
        map: map,
        title: 'Drag to set delivery location',
        draggable: true,
        animation: window.google.maps.Animation.DROP
      });

      // Add event listener for marker drag
      markerRef.current.addListener('dragend', (event) => {
        const newLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        setSelectedLocation(newLocation);
        setIsConfirmed(false);
        
        // Update map center to follow the marker
        map.panTo(newLocation);
        
        // Get address for new location
        getAddressFromCoordinates(newLocation.lat, newLocation.lng);
      });

      // Add click event to map to move marker
      map.addListener('click', (event) => {
        const newLocation = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        markerRef.current.setPosition(newLocation);
        setSelectedLocation(newLocation);
        setIsConfirmed(false);
        
        // Get address for new location
        getAddressFromCoordinates(newLocation.lat, newLocation.lng);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map. Please try again.');
    }
  };

  // Handle location selection from list
  const handleLocationSelect = (location) => {
    setIsConfirmed(false);
    // In a real app, you would geocode the selected address here
    // For now, we'll just update the address display
    setAddress(location.title + (location.subtitle ? `, ${location.subtitle}` : ''));
  };

  // Handle confirm location
  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setIsConfirmed(true);
      
      if (mapInstanceRef.current && markerRef.current) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; text-align: center;">
              <h3 style="margin: 0 0 8px 0; color: #0f9d58;">✅ Location Confirmed!</h3>
              <p style="margin: 0;">Your order will be delivered here</p>
            </div>
          `
        });
        
        infoWindow.open(mapInstanceRef.current, markerRef.current);
        
        setTimeout(() => {
          infoWindow.close();
        }, 3000);
      }
    }
  };

  // Render location section based on type
  const renderLocationSection = (section, index) => {
    switch (section.type) {
      case 'header':
        return (
          <div
            key={index}
            style={{
              fontSize: section.level === 1 ? '20px' : '18px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '12px',
              marginTop: section.level === 1 ? '0' : '15px',
              padding: section.level === 1 ? '0 0 8px 0' : '0',
              borderBottom: section.level === 1 ? '2px solid #e0e0e0' : 'none'
            }}
          >
            {section.title}
          </div>
        );

      case 'location':
        return (
          <div
            key={index}
            onClick={() => handleLocationSelect(section)}
            style={{
              padding: '14px',
              marginBottom: '10px',
              borderRadius: '10px',
              border: '1px solid #e0e0e0',
              backgroundColor: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              fontSize: '15px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '4px'
            }}>
              {section.title}
            </div>
            {section.subtitle && (
              <div style={{
                fontSize: '13px',
                fontWeight: '500',
                color: '#666',
                marginBottom: '4px'
              }}>
                {section.subtitle}
              </div>
            )}
            {section.description && (
              <div style={{
                fontSize: '12px',
                color: '#888',
                lineHeight: '1.4'
              }}>
                {section.description}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}
    //  className='maincontainer'
    >
      {/* Main Content - Vertical Layout */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh'
      }}>
        
        {/* Top Panel - Map */}
        <div style={{ 
          flex: '1',
          position: 'relative',
          backgroundColor: '#e9ecef',
          minHeight: '50vh'
        }}>
          <div
            ref={mapRef}
            style={{
              width: '100%',
              height: '100%'
            }}
          />
          
          {/* Map Instructions Overlay */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '14px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #e0e0e0',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📍 Order will be delivered here
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666'
            }}>
              Drag the pin or click on the map to set your exact delivery location
            </div>
          </div>

          {/* Loading Overlay */}
          {isLoading && (
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '1000'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e0e0e0',
                borderTop: '4px solid #1976d2',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px'
              }}></div>
              <div style={{
                fontSize: '16px',
                color: '#333',
                fontWeight: '500'
              }}>
                Detecting your location...
              </div>
            </div>
          )}
        </div>

        {/* Bottom Panel - Location List and Confirm */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '20px',
          maxHeight: '50vh',
          overflowY: 'auto',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
        }}>
          {/* Current Location Display */}
          <div style={{ 
            backgroundColor: '#e8f5e8',
            padding: '16px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '1px solid #c8e6c9'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{ 
                fontSize: '20px',
                color: '#4caf50'
              }}>
                📍
              </div>
              <div style={{ flex: '1' }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#2e7d32',
                  marginBottom: '6px'
                }}>
                  Your Location
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#388e3c',
                  marginBottom: '4px'
                }}>
                  Phase 1
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.4'
                }}>
                  {address || 'Detecting your address...'}
                </div>
              </div>
            </div>
          </div>

      

          {/* Confirm Button */}
          <div>
            <button
              onClick={handleConfirmLocation}
              disabled={isLoading || isConfirmed || !selectedLocation}
              style={{
                width: '100%',
                padding: '16px',
                backgroundColor: isConfirmed ? '#4caf50' : '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: (isLoading || isConfirmed || !selectedLocation) ? 'default' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: (isLoading || isConfirmed || !selectedLocation) ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !isConfirmed && selectedLocation) {
                  e.target.style.backgroundColor = '#b71c1c';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !isConfirmed && selectedLocation) {
                  e.target.style.backgroundColor = '#d32f2f';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {isConfirmed ? '✅ Location Confirmed' : 'Confirm Location'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #ffcdd2',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: '2000',
          maxWidth: '400px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <div style={{ fontSize: '18px' }}>⚠️</div>
            <div style={{ flex: '1' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Location Error</div>
              <div style={{ fontSize: '14px' }}>{error}</div>
            </div>
            <button 
              onClick={() => setError('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#c62828',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default LocationConfirmation;




























// import React, { useState, useEffect, useRef, useCallback } from 'react';

// const LocationConfirmation = () => {
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isConfirmed, setIsConfirmed] = useState(false);
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const [address, setAddress] = useState('');
//   const [isGeocoding, setIsGeocoding] = useState(false);
//   const [isLocationAvailable, setIsLocationAvailable] = useState(true);
//   const [mockLocations, setMockLocations] = useState([]);
  
//   const mapRef = useRef(null);
//   const mapInstanceRef = useRef(null);
//   const markerRef = useRef(null);
//   const geocoderRef = useRef(null);
//   const circleRef = useRef(null);

//   // Replace this with your actual Google Maps API Key
//   const API_KEY = 'AIzaSyAofrxaZbc3A2q7oKSXHoZzGPgoiU6XDV4';

//   // Mock location data
//   const mockLocationData = [
//     {
//       title: "Forest Office P.",
//       type: "header",
//       level: 1
//     },
//     {
//       title: "Mac Tarin! Mandir 🌟",
//       type: "header", 
//       level: 2
//     },
//     {
//       title: "Chhend Main Rd",
//       subtitle: "Order will be delivered here",
//       description: "Place the pin accurately on the map",
//       type: "location",
//       highlighted: true
//     },
//     {
//       title: "Kidzee, Chhenc",
//       subtitle: "Chhend Main Rd", 
//       description: "Children's Pa",
//       type: "location"
//     },
//     {
//       title: "Jagannath Temple Dev Vihar",
//       subtitle: "Tution",
//       description: "Shiva Mandir 🌟",
//       type: "location"
//     },
//     {
//       title: "ISKCON Rourkela",
//       type: "location"
//     }
//   ];

//   // Calculate distance between two coordinates in meters
//   const calculateDistance = (lat1, lon1, lat2, lon2) => {
//     const R = 6371000; // Earth's radius in meters
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a = 
//       Math.sin(dLat/2) * Math.sin(dLat/2) +
//       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//       Math.sin(dLon/2) * Math.sin(dLon/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//     return R * c;
//   };

//   // Generate mock locations within 100m radius
//   const generateMockLocations = (centerLat, centerLng) => {
//     const locations = [];
//     const radius = 100; // 100 meters
//     const count = 6; // Number of mock locations
    
//     for (let i = 0; i < count; i++) {
//       // Generate random points within 100m radius
//       const angle = Math.random() * 2 * Math.PI;
//       const distance = Math.random() * radius;
      
//       // Convert distance to latitude/longitude offsets
//       const latOffset = (distance * Math.cos(angle)) / 111320; // 111320m per degree latitude
//       const lngOffset = (distance * Math.sin(angle)) / (111320 * Math.cos(centerLat * Math.PI / 180));
      
//       locations.push({
//         lat: centerLat + latOffset,
//         lng: centerLng + lngOffset,
//         name: `Location ${i + 1}`,
//         address: `Nearby point ${i + 1}`
//       });
//     }
    
//     return locations;
//   };

//   // Check if location is within 100m radius
//   const isWithinDeliveryRange = (location) => {
//     if (!currentLocation) return false;
    
//     const distance = calculateDistance(
//       currentLocation.lat,
//       currentLocation.lng,
//       location.lat,
//       location.lng
//     );
    
//     return distance <= 100; // 100 meters
//   };

//   // Initialize geocoder
//   const initializeGeocoder = useCallback(() => {
//     if (window.google && window.google.maps && !geocoderRef.current) {
//       geocoderRef.current = new window.google.maps.Geocoder();
//     }
//   }, []);

//   // Get address from coordinates
//   const getAddressFromCoordinates = useCallback(async (lat, lng) => {
//     if (!window.google || !window.google.maps || !geocoderRef.current) {
//       console.warn('Geocoder not available');
//       setAddress('Address service not available');
//       return;
//     }

//     setIsGeocoding(true);

//     try {
//       const response = await new Promise((resolve, reject) => {
//         geocoderRef.current.geocode(
//           { location: { lat, lng } }, 
//           (results, status) => {
//             if (status === 'OK' && results && results[0]) {
//               resolve(results[0].formatted_address);
//             } else if (status === 'ZERO_RESULTS') {
//               resolve('No address found for this location');
//             } else {
//               reject(new Error(`Geocoding failed: ${status}`));
//             }
//           }
//         );
//       });
      
//       setAddress(response);
//     } catch (error) {
//       console.error('Geocoding error:', error);
//       setAddress('Address not available');
//     } finally {
//       setIsGeocoding(false);
//     }
//   }, []);

//   // Load Google Maps script
//   useEffect(() => {
//     if (window.google && window.google.maps) {
//       setScriptLoaded(true);
//       initializeGeocoder();
//       return;
//     }

//     if (document.querySelector(`script[src*="maps.googleapis.com"]`)) {
//       const checkGoogle = setInterval(() => {
//         if (window.google && window.google.maps) {
//           setScriptLoaded(true);
//           initializeGeocoder();
//           clearInterval(checkGoogle);
//         }
//       }, 100);
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
//     script.async = true;
//     script.defer = true;
    
//     script.onload = () => {
//       setScriptLoaded(true);
//       initializeGeocoder();
//     };
    
//     script.onerror = () => {
//       setError('Failed to load Google Maps. Please check your API key.');
//       setIsLoading(false);
//     };
    
//     document.head.appendChild(script);
//   }, [initializeGeocoder]);

//   // Get current location after script is loaded
//   useEffect(() => {
//     if (scriptLoaded) {
//       getCurrentLocation();
//     }
//   }, [scriptLoaded]);

//   // Get current location
//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by this browser.');
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         const location = {
//           lat: latitude,
//           lng: longitude
//         };
//         setCurrentLocation(location);
//         setSelectedLocation(location);
        
//         // Generate mock locations within 100m radius
//         const mockLocs = generateMockLocations(latitude, longitude);
//         setMockLocations(mockLocs);
        
//         if (scriptLoaded && mapRef.current) {
//           initializeMap(location);
//           getAddressFromCoordinates(location.lat, location.lng);
//         }
        
//         setIsLoading(false);
//       },
//       (error) => {
//         console.error('Error getting location:', error);
//         setError(`Unable to retrieve your location: ${error.message}`);
        
//         const defaultLocation = { lat: 40.7128, lng: -74.0060 };
//         setCurrentLocation(defaultLocation);
//         setSelectedLocation(defaultLocation);
        
//         // Generate mock locations for default location too
//         const mockLocs = generateMockLocations(defaultLocation.lat, defaultLocation.lng);
//         setMockLocations(mockLocs);
        
//         if (scriptLoaded && mapRef.current) {
//           initializeMap(defaultLocation);
//           getAddressFromCoordinates(defaultLocation.lat, defaultLocation.lng);
//         }
        
//         setIsLoading(false);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 60000
//       }
//     );
//   };

//   // Initialize Google Map with draggable marker and delivery radius
//   const initializeMap = (location) => {
//     if (!mapRef.current || !window.google || !window.google.maps) {
//       console.error('Map container not found or Google Maps not loaded');
//       return;
//     }

//     try {
//       const map = new window.google.maps.Map(mapRef.current, {
//         zoom: 17,
//         center: location,
//         mapTypeControl: false,
//         streetViewControl: false,
//         fullscreenControl: false,
//         zoomControl: true,
//         styles: [
//           {
//             featureType: "poi",
//             elementType: "labels",
//             stylers: [{ visibility: "on" }]
//           }
//         ]
//       });

//       mapInstanceRef.current = map;

//       // Create delivery radius circle (100m)
//       circleRef.current = new window.google.maps.Circle({
//         strokeColor: '#FF0000',
//         strokeOpacity: 0.8,
//         strokeWeight: 2,
//         fillColor: '#FF0000',
//         fillOpacity: 0.1,
//         map: map,
//         center: location,
//         radius: 100, // 100 meters
//         draggable: false
//       });

//       // Create draggable marker for delivery location
//       markerRef.current = new window.google.maps.Marker({
//         position: location,
//         map: map,
//         title: 'Drag to set delivery location',
//         draggable: true,
//         animation: window.google.maps.Animation.DROP
//       });

//       // Add mock location markers
//       mockLocations.forEach((mockLoc, index) => {
//         new window.google.maps.Marker({
//           position: { lat: mockLoc.lat, lng: mockLoc.lng },
//           map: map,
//           title: mockLoc.name,
//           icon: {
//             url: 'data:image/svg+xml;base64,' + btoa(`
//               <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//                 <circle cx="10" cy="10" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
//               </svg>
//             `),
//             scaledSize: new window.google.maps.Size(20, 20),
//             anchor: new window.google.maps.Point(10, 10)
//           }
//         });
//       });

//       // Add event listener for marker drag
//       markerRef.current.addListener('dragend', (event) => {
//         const newLocation = {
//           lat: event.latLng.lat(),
//           lng: event.latLng.lng()
//         };
//         setSelectedLocation(newLocation);
//         setIsConfirmed(false);
        
//         // Check if location is within delivery range
//         const isAvailable = isWithinDeliveryRange(newLocation);
//         setIsLocationAvailable(isAvailable);
        
//         if (isAvailable) {
//           // Update map center to follow the marker
//           map.panTo(newLocation);
//           // Get address for new location
//           getAddressFromCoordinates(newLocation.lat, newLocation.lng);
//         } else {
//           setAddress('Location unavailable - Outside delivery area');
//         }
//       });

//       // Add click event to map to move marker
//       map.addListener('click', (event) => {
//         const newLocation = {
//           lat: event.latLng.lat(),
//           lng: event.latLng.lng()
//         };
        
//         // Check if clicked location is within delivery range
//         const isAvailable = isWithinDeliveryRange(newLocation);
        
//         if (isAvailable) {
//           markerRef.current.setPosition(newLocation);
//           setSelectedLocation(newLocation);
//           setIsConfirmed(false);
//           setIsLocationAvailable(true);
//           getAddressFromCoordinates(newLocation.lat, newLocation.lng);
//         } else {
//           setError('This location is outside our delivery area. Please select a location within the red circle.');
//           setTimeout(() => setError(''), 3000);
//         }
//       });

//     } catch (error) {
//       console.error('Error initializing map:', error);
//       setError('Failed to initialize map. Please try again.');
//     }
//   };

//   // Handle location selection from list
//   const handleLocationSelect = (location) => {
//     setIsConfirmed(false);
//     // For mock locations, we would normally geocode the address
//     // For now, we'll simulate a nearby location
//     if (mockLocations.length > 0) {
//       const randomMockLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
//       setSelectedLocation(randomMockLocation);
//       setAddress(`${location.title}, Nearby area`);
//       setIsLocationAvailable(true);
      
//       if (mapInstanceRef.current && markerRef.current) {
//         markerRef.current.setPosition(randomMockLocation);
//         mapInstanceRef.current.panTo(randomMockLocation);
//       }
//     }
//   };

//   // Handle confirm location
//   const handleConfirmLocation = () => {
//     if (selectedLocation && isLocationAvailable) {
//       setIsConfirmed(true);
      
//       if (mapInstanceRef.current && markerRef.current) {
//         const infoWindow = new window.google.maps.InfoWindow({
//           content: `
//             <div style="padding: 10px; text-align: center;">
//               <h3 style="margin: 0 0 8px 0; color: #0f9d58;">✅ Location Confirmed!</h3>
//               <p style="margin: 0;">Your order will be delivered here</p>
//             </div>
//           `
//         });
        
//         infoWindow.open(mapInstanceRef.current, markerRef.current);
        
//         setTimeout(() => {
//           infoWindow.close();
//         }, 3000);
//       }
//     }
//   };

//   // Render location section based on type
//   const renderLocationSection = (section, index) => {
//     switch (section.type) {
//       case 'header':
//         return (
//           <div
//             key={index}
//             style={{
//               fontSize: section.level === 1 ? '20px' : '18px',
//               fontWeight: 'bold',
//               color: '#333',
//               marginBottom: '12px',
//               marginTop: section.level === 1 ? '0' : '15px',
//               padding: section.level === 1 ? '0 0 8px 0' : '0',
//               borderBottom: section.level === 1 ? '2px solid #e0e0e0' : 'none'
//             }}
//           >
//             {section.title}
//           </div>
//         );

//       case 'location':
//         return (
//           <div
//             key={index}
//             onClick={() => handleLocationSelect(section)}
//             style={{
//               padding: '14px',
//               marginBottom: '10px',
//               borderRadius: '10px',
//               border: '1px solid #e0e0e0',
//               backgroundColor: section.highlighted ? '#e3f2fd' : 'white',
//               cursor: 'pointer',
//               transition: 'all 0.2s ease',
//               borderLeft: section.highlighted ? '4px solid #1976d2' : '1px solid #e0e0e0'
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.backgroundColor = section.highlighted ? '#bbdefb' : '#f8f9fa';
//               e.target.style.transform = 'translateY(-1px)';
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.backgroundColor = section.highlighted ? '#e3f2fd' : 'white';
//               e.target.style.transform = 'translateY(0)';
//             }}
//           >
//             <div style={{
//               fontSize: '15px',
//               fontWeight: '600',
//               color: '#333',
//               marginBottom: '4px'
//             }}>
//               {section.title}
//             </div>
//             {section.subtitle && (
//               <div style={{
//                 fontSize: '13px',
//                 fontWeight: '500',
//                 color: '#666',
//                 marginBottom: '4px'
//               }}>
//                 {section.subtitle}
//               </div>
//             )}
//             {section.description && (
//               <div style={{
//                 fontSize: '12px',
//                 color: '#888',
//                 lineHeight: '1.4'
//               }}>
//                 {section.description}
//               </div>
//             )}
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div style={{ 
//       minHeight: '100vh', 
//       backgroundColor: '#f5f5f5',
//       fontFamily: 'Arial, sans-serif'
//     }}>
//       {/* Main Content - Vertical Layout */}
//       <div style={{ 
//         display: 'flex', 
//         flexDirection: 'column',
//         height: '100vh'
//       }}>
        
//         {/* Top Panel - Map */}
//         <div style={{ 
//           flex: '1',
//           position: 'relative',
//           backgroundColor: '#e9ecef',
//           minHeight: '50vh'
//         }}>
//           <div
//             ref={mapRef}
//             style={{
//               width: '100%',
//               height: '100%'
//             }}
//           />
          
//           {/* Map Instructions Overlay */}
//           <div style={{
//             position: 'absolute',
//             top: '16px',
//             left: '16px',
//             right: '16px',
//             backgroundColor: isLocationAvailable ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 235, 238, 0.95)',
//             padding: '14px',
//             borderRadius: '10px',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//             border: isLocationAvailable ? '1px solid #e0e0e0' : '1px solid #ffcdd2',
//             backdropFilter: 'blur(10px)'
//           }}>
//             <div style={{
//               fontSize: '14px',
//               fontWeight: '600',
//               color: isLocationAvailable ? '#333' : '#c62828',
//               marginBottom: '4px',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px'
//             }}>
//               {isLocationAvailable ? '📍 Order will be delivered here' : '⚠️ Location unavailable'}
//             </div>
//             <div style={{
//               fontSize: '12px',
//               color: isLocationAvailable ? '#666' : '#c62828'
//             }}>
//               {isLocationAvailable 
//                 ? 'Drag the pin within the red circle (100m radius) to set your exact delivery location'
//                 : 'This location is outside our delivery area. Please move the pin inside the red circle.'
//               }
//             </div>
//           </div>

//           {/* Loading Overlay */}
//           {isLoading && (
//             <div style={{
//               position: 'absolute',
//               top: '0',
//               left: '0',
//               right: '0',
//               bottom: '0',
//               backgroundColor: 'rgba(255, 255, 255, 0.9)',
//               display: 'flex',
//               flexDirection: 'column',
//               alignItems: 'center',
//               justifyContent: 'center',
//               zIndex: '1000'
//             }}>
//               <div style={{
//                 width: '40px',
//                 height: '40px',
//                 border: '4px solid #e0e0e0',
//                 borderTop: '4px solid #1976d2',
//                 borderRadius: '50%',
//                 animation: 'spin 1s linear infinite',
//                 marginBottom: '16px'
//               }}></div>
//               <div style={{
//                 fontSize: '16px',
//                 color: '#333',
//                 fontWeight: '500'
//               }}>
//                 Detecting your location...
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Bottom Panel - Location List and Confirm */}
//         <div style={{ 
//           backgroundColor: 'white',
//           padding: '20px',
//           maxHeight: '50vh',
//           overflowY: 'auto',
//           boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
//         }}>
//           {/* Current Location Display */}
//           <div style={{ 
//             backgroundColor: isLocationAvailable ? '#e8f5e8' : '#ffebee',
//             padding: '16px',
//             borderRadius: '10px',
//             marginBottom: '20px',
//             border: isLocationAvailable ? '1px solid #c8e6c9' : '1px solid #ffcdd2'
//           }}>
//             <div style={{
//               display: 'flex',
//               alignItems: 'flex-start',
//               gap: '12px'
//             }}>
//               <div style={{ 
//                 fontSize: '20px',
//                 color: isLocationAvailable ? '#4caf50' : '#f44336'
//               }}>
//                 {isLocationAvailable ? '📍' : '⚠️'}
//               </div>
//               <div style={{ flex: '1' }}>
//                 <div style={{
//                   fontSize: '16px',
//                   fontWeight: '600',
//                   color: isLocationAvailable ? '#2e7d32' : '#c62828',
//                   marginBottom: '6px'
//                 }}>
//                   {isLocationAvailable ? 'Your Location' : 'Location Unavailable'}
//                 </div>
//                 <div style={{
//                   fontSize: '14px',
//                   color: isLocationAvailable ? '#388e3c' : '#c62828',
//                   marginBottom: '4px'
//                 }}>
//                   {isLocationAvailable ? 'Phase 1' : 'Outside Delivery Area'}
//                 </div>
//                 <div style={{
//                   fontSize: '13px',
//                   color: isLocationAvailable ? '#666' : '#c62828',
//                   lineHeight: '1.4'
//                 }}>
//                   {address || 'Detecting your address...'}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Location List */}
//           <div style={{ marginBottom: '20px' }}>
//             {mockLocationData.map((section, index) => 
//               renderLocationSection(section, index)
//             )}
//           </div>

//           {/* Confirm Button */}
//           <div>
//             <button
//               onClick={handleConfirmLocation}
//               disabled={isLoading || isConfirmed || !selectedLocation || !isLocationAvailable}
//               style={{
//                 width: '100%',
//                 padding: '16px',
//                 backgroundColor: isConfirmed ? '#4caf50' : 
//                                isLocationAvailable ? '#d32f2f' : '#9e9e9e',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '10px',
//                 fontSize: '16px',
//                 fontWeight: 'bold',
//                 cursor: (isLoading || isConfirmed || !selectedLocation || !isLocationAvailable) ? 'default' : 'pointer',
//                 transition: 'all 0.3s ease',
//                 opacity: (isLoading || isConfirmed || !selectedLocation || !isLocationAvailable) ? 0.6 : 1
//               }}
//               onMouseEnter={(e) => {
//                 if (!isLoading && !isConfirmed && selectedLocation && isLocationAvailable) {
//                   e.target.style.backgroundColor = '#b71c1c';
//                   e.target.style.transform = 'translateY(-2px)';
//                 }
//               }}
//               onMouseLeave={(e) => {
//                 if (!isLoading && !isConfirmed && selectedLocation && isLocationAvailable) {
//                   e.target.style.backgroundColor = '#d32f2f';
//                   e.target.style.transform = 'translateY(0)';
//                 }
//               }}
//             >
//               {isConfirmed 
//                 ? '✅ Location Confirmed' 
//                 : !isLocationAvailable 
//                   ? 'Location Unavailable' 
//                   : 'Confirm Location'
//               }
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div style={{
//           position: 'fixed',
//           top: '20px',
//           right: '20px',
//           backgroundColor: '#ffebee',
//           color: '#c62828',
//           padding: '16px',
//           borderRadius: '8px',
//           border: '1px solid #ffcdd2',
//           boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//           zIndex: '2000',
//           maxWidth: '400px'
//         }}>
//           <div style={{
//             display: 'flex',
//             alignItems: 'flex-start',
//             gap: '12px'
//           }}>
//             <div style={{ fontSize: '18px' }}>⚠️</div>
//             <div style={{ flex: '1' }}>
//               <div style={{ fontWeight: '600', marginBottom: '4px' }}>Location Error</div>
//               <div style={{ fontSize: '14px' }}>{error}</div>
//             </div>
//             <button 
//               onClick={() => setError('')}
//               style={{
//                 background: 'none',
//                 border: 'none',
//                 color: '#c62828',
//                 cursor: 'pointer',
//                 fontSize: '18px',
//                 padding: '0',
//                 width: '24px',
//                 height: '24px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               ×
//             </button>
//           </div>
//         </div>
//       )}

//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default LocationConfirmation;