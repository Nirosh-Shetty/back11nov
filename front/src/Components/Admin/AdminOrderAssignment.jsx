import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const AdminOrderAssignment = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });
  const [zoom, setZoom] = useState(13);
  const [hubs, setHubs] = useState([]);
  const [selectedHub, setSelectedHub] = useState("all");
  const mapRef = useRef(null);
  const clustererRef = useRef(null);

  // Replace LoadScript with useJsApiLoader hook
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    id: "google-map-script",
  });

  const addressTypeConfig = {
    PG: {
      color: "#8A2BE2", // Deep violet (stands out well)
      icon: "🏠",
      label: "PG",
    },
    School: {
      color: "#FF6B6B", // Vibrant coral red — eye-catching but not harsh
      icon: "🏫",
      label: "School",
    },
    Work: {
      color: "#00796B", // Teal — modern and calm, distinct from blue roads
      icon: "💼",
      label: "Work",
    },
    Home: {
      color: "#FFB300", // Warm amber — rich yellow/orange that pops
      icon: "🏡",
      label: "Home",
    },
  };

  const mapContainerStyle = {
    width: "100%",
    height: "80vh",
    borderRadius: "8px",
    border: "2px solid #e0e0e0",
  };

  // Calculate dynamic offset based on zoom level
  const calculateOffsetRadius = (currentZoom) => {
    // Smaller offsets at higher zoom levels
    if (currentZoom >= 18) return 0.00001; // ~1.1 meters
    if (currentZoom >= 16) return 0.00003; // ~3.3 meters
    if (currentZoom >= 14) return 0.00008; // ~8.8 meters
    if (currentZoom >= 12) return 0.0002; // ~22 meters
    if (currentZoom >= 10) return 0.0005; // ~55 meters
    return 0.001; // ~111 meters at lower zoom
  };

  const offsetOverlappingMarkers = (ordersArray, currentZoom = 13) => {
    const locationMap = new Map();
    const offsetOrders = [];
    const radius = calculateOffsetRadius(currentZoom);

    // First pass: group orders by location with tolerance
    ordersArray.forEach((order, index) => {
      const lat = order.coordinates.coordinates[1];
      const lng = order.coordinates.coordinates[0];

      // Find existing group within tolerance
      let foundGroup = null;
      for (const [groupKey, group] of locationMap.entries()) {
        const [groupLat, groupLng] = groupKey.split("_").map(Number);
        const distance = Math.sqrt(
          Math.pow(lat - groupLat, 2) + Math.pow(lng - groupLng, 2)
        );

        // Use tighter tolerance for grouping (approximately 10 meters at zoom 13)
        if (distance < 0.00009) {
          foundGroup = group;
          break;
        }
      }

      if (!foundGroup) {
        // Create new group
        const locationKey = `${lat.toFixed(6)}_${lng.toFixed(6)}`;
        locationMap.set(locationKey, []);
        offsetOrders.push({
          ...order,
          originalIndex: index,
          displayLat: lat,
          displayLng: lng,
          isGrouped: false,
          groupCount: 1,
          groupKey: locationKey,
        });
        locationMap.get(locationKey).push(offsetOrders.length - 1);
      } else {
        // Add to existing group
        const groupIndex = foundGroup.length;
        const angle = (360 / 8) * groupIndex;
        const offsetLat = lat + radius * Math.cos((angle * Math.PI) / 180);
        const offsetLng = lng + radius * Math.sin((angle * Math.PI) / 180);

        offsetOrders.push({
          ...order,
          originalIndex: index,
          displayLat: offsetLat,
          displayLng: offsetLng,
          isGrouped: true,
          groupCount: foundGroup.length + 1,
          groupKey: foundGroup[0].groupKey,
        });

        // Update the first marker in group to show group count
        const firstMarkerIndex = foundGroup[0];
        offsetOrders[firstMarkerIndex].isGrouped = true;
        offsetOrders[firstMarkerIndex].groupCount = foundGroup.length + 1;

        foundGroup.push(offsetOrders.length - 1);
      }
    });

    return offsetOrders;
  };

  const createPinShapedMarker = (
    orderNumber,
    addressType,
    isGrouped = false,
    groupCount = 1
  ) => {
    const config = addressTypeConfig[addressType] || {
      color: "#6B8e23",
      icon: "🏠",
      label: "Other",
    };

    const pinPaths = {
      PG: "M -12,-30 L 12,-30 L 15,-15 L 8,-8 L 0,5 L -8,-8 L -15,-15 Z",
      School: "M -15,-30 L 15,-30 L 15,-5 L 5,-5 L 0,5 L -5,-5 L -15,-5 Z",
      Work: "M -12,-30 L 12,-30 L 15,-15 L 8,-8 L 0,5 L -8,-8 L -15,-15 Z",
      Home: "M 0,-35 L 15,-20 L 15,-10 L 10,-10 L 10,0 L -10,0 L -10,-10 L -15,-10 L -15,-20 Z",
      Office: "M -15,-30 L 15,-30 L 15,0 L 8,0 L 0,8 L -8,0 L -15,0 Z",
      default:
        "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
    };

    const groupBadge =
      isGrouped && groupCount > 1
        ? `
      <circle cx="15" cy="-30" r="10" fill="#FF0000" stroke="white" stroke-width="2"/>
      <text x="15" y="-26"
            font-family="Arial Black, sans-serif"
            font-size="10"
            font-weight="900"
            text-anchor="middle"
            fill="white">
        ${groupCount}
      </text>
    `
        : "";

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-25 -45 50 60" width="50" height="60">
        <defs>
          <filter id="shadow${orderNumber}">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-opacity="0.6"/>
          </filter>
        </defs>
        <path d="${pinPaths[addressType] || pinPaths.default}"
              fill="${config.color}"
              stroke="white"
              stroke-width="2.5"
              filter="url(#shadow${orderNumber})"/>
        ${groupBadge}
        <text x="0" y="-15"
              font-family="Arial Black, sans-serif"
              font-size="16"
              font-weight="900"
              text-anchor="middle"
              fill="white"
              stroke="#000"
              stroke-width="1">
          ${orderNumber}
        </text>
      </svg>
    `.trim();

    const encodedSvg = encodeURIComponent(svg)
      .replace(/'/g, "%27")
      .replace(/"/g, "%22");

    return {
      url: `data:image/svg+xml,${encodedSvg}`,
      scaledSize: new window.google.maps.Size(50, 60),
      anchor: new window.google.maps.Point(25, 60),
    };
  };

  // Initialize marker clusterer
  const initializeClusterer = useCallback((map) => {
    if (!map) return;

    // Clear existing clusterer
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
    }

    // Create custom cluster icons
    const createClusterIcon = (cluster) => {
      const count = cluster.count;
      let backgroundColor = "#007bff";
      let size = 40;

      if (count > 20) {
        backgroundColor = "#dc3545";
        size = 50;
      } else if (count > 10) {
        backgroundColor = "#fd7e14";
        size = 45;
      } else if (count > 5) {
        backgroundColor = "#ffc107";
        size = 42;
      }

      return {
        url: `data:image/svg+xml,${encodeURIComponent(`
          <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${size / 2}" cy="${size / 2}" r="${
          size / 2 - 2
        }" fill="${backgroundColor}" stroke="white" stroke-width="3"/>
            <text x="${size / 2}" y="${
          size / 2 + 4
        }" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold" font-size="14">${count}</text>
          </svg>
        `)}`,
        scaledSize: new window.google.maps.Size(size, size),
        anchor: new window.google.maps.Point(size / 2, size / 2),
      };
    };

    // Initialize clusterer with custom options
    clustererRef.current = new MarkerClusterer({
      map,
      markers: [],
      renderer: {
        render: ({ count, position }, stats) => {
          // Use custom cluster icon
          const clusterOptions = {
            position,
            icon: createClusterIcon({ count }),
            title: `${count} orders clustered`,
            zIndex: 1000 + count,
          };

          return new window.google.maps.Marker(clusterOptions);
        },
      },
      algorithmOptions: {
        maxZoom: 15,
        gridSize: 60,
      },
    });
  }, []);

  const fetchTodaysOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:7013/api/admin/getPackerOrders"
      );
      const ordersWithCoordinates = res.data.filter(
        (order) =>
          order.coordinates &&
          order.coordinates.coordinates &&
          order.coordinates.coordinates.length === 2
      );

      // Process orders and extract unique hubs
      const processedOrders = offsetOverlappingMarkers(
        ordersWithCoordinates,
        zoom
      );
      setOrders(processedOrders);
      setFilteredOrders(processedOrders);

      // Extract unique hubs from orders
      const uniqueHubs = [
        ...new Set(
          ordersWithCoordinates
            .filter((order) => order.hubName)
            .map((order) => order.hubName)
        ),
      ].map((hubName) => ({
        name: hubName,
        count: ordersWithCoordinates.filter(
          (order) => order.hubName === hubName
        ).length,
      }));

      setHubs(uniqueHubs);

      if (processedOrders.length > 0) {
        const firstOrder = processedOrders[0];
        setMapCenter({
          lat: firstOrder.displayLat,
          lng: firstOrder.displayLng,
        });
      }

      // Update clusterer with new markers
      if (clustererRef.current && mapRef.current) {
        updateClustererMarkers(processedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Update clusterer with current orders
  const updateClustererMarkers = useCallback(
    (ordersArray) => {
      if (!clustererRef.current || !mapRef.current) return;

      // Clear existing markers
      clustererRef.current.clearMarkers();

      // Create new markers
      const markers = ordersArray.map((order, index) => {
        const marker = new window.google.maps.Marker({
          position: {
            lat: order.displayLat,
            lng: order.displayLng,
          },
          icon: createPinShapedMarker(
            index + 1,
            order.addressType,
            order.isGrouped,
            order.groupCount
          ),
          title: `Order ${index + 1}: ${order.username} - ${order.addressType}${
            order.isGrouped ? ` (${order.groupCount} orders here)` : ""
          }`,
          zIndex:
            selectedOrder?._id === order._id
              ? 1000
              : order.isGrouped
              ? 200
              : 100,
        });

        // Add click listener
        marker.addListener("click", () => {
          handleMarkerClick(order, index + 1);
        });

        return marker;
      });

      // Add markers to clusterer
      clustererRef.current.addMarkers(markers);
    },
    [selectedOrder]
  );

  // Filter orders by hub
  const filterOrdersByHub = useCallback(
    (hubName) => {
      setSelectedHub(hubName);

      if (hubName === "all") {
        setFilteredOrders(orders);
        // Reset to default center if showing all orders
        if (orders.length > 0) {
          const firstOrder = orders[0];
          setMapCenter({
            lat: firstOrder.displayLat,
            lng: firstOrder.displayLng,
          });
        }
      } else {
        const hubOrders = orders.filter((order) => order.hubName === hubName);
        setFilteredOrders(hubOrders);

        // Center map on the first order of the selected hub
        if (hubOrders.length > 0) {
          const firstHubOrder = hubOrders[0];
          setMapCenter({
            lat: firstHubOrder.displayLat,
            lng: firstHubOrder.displayLng,
          });
          setZoom(14); // Zoom in a bit when filtering
        }
      }
    },
    [orders]
  );

  useEffect(() => {
    fetchTodaysOrders();
  }, []);

  // Recalculate offsets when zoom changes
  useEffect(() => {
    if (orders.length > 0) {
      const processedOrders = offsetOverlappingMarkers(
        orders.map((order) => ({
          ...order,
          coordinates: order.coordinates, // Preserve original coordinates
        })),
        zoom
      );
      setOrders(processedOrders);
      // Also update filtered orders if hub is selected
      if (selectedHub !== "all") {
        const hubOrders = processedOrders.filter(
          (order) => order.hubName === selectedHub
        );
        setFilteredOrders(hubOrders);
      } else {
        setFilteredOrders(processedOrders);
      }

      // Update clusterer with new marker positions
      if (clustererRef.current && mapRef.current) {
        updateClustererMarkers(
          selectedHub === "all" ? processedOrders : filteredOrders
        );
      }
    }
  }, [zoom]);

  const handleMarkerClick = useCallback((order, orderNumber) => {
    setSelectedOrder({ ...order, orderNumber });
  }, []);

  const handleMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      initializeClusterer(map);

      // Add zoom change listener
      window.google.maps.event.addListener(map, "zoom_changed", () => {
        setZoom(map.getZoom());
      });

      // Update clusterer with existing orders
      if (filteredOrders.length > 0) {
        updateClustererMarkers(filteredOrders);
      }
    },
    [filteredOrders, initializeClusterer, updateClustererMarkers]
  );

  const getLocationGroups = () => {
    const groups = {};
    filteredOrders.forEach((order, index) => {
      if (order.isGrouped && order.groupKey) {
        if (!groups[order.groupKey]) {
          groups[order.groupKey] = [];
        }
        groups[order.groupKey].push({ ...order, orderNumber: index + 1 });
      }
    });
    return groups;
  };

  const locationGroups = getLocationGroups();
  const hasGroupedMarkers = Object.keys(locationGroups).length > 0;

  if (loadError) {
    return <div>Error loading maps: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <h2 style={{ margin: 0, color: "#333" }}>🗺️ Today's Orders Map</h2>

          {/* Hub Filter Dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label
              style={{ fontSize: "14px", fontWeight: "600", color: "#555" }}
            >
              📍 Filter by Hub:
            </label>
            <select
              value={selectedHub}
              onChange={(e) => filterOrdersByHub(e.target.value)}
              style={{
                padding: "10px 16px",
                border: "2px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                backgroundColor: "white",
                color: "#333",
                minWidth: "200px",
                cursor: "pointer",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#007bff";
                e.target.style.boxShadow = "0 0 0 2px rgba(0,123,255,0.25)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="all">🏢 All Hubs ({orders.length} orders)</option>
              {hubs.map((hub, index) => (
                <option key={index} value={hub.name}>
                  🏢 {hub.name} ({hub.count} orders)
                </option>
              ))}
            </select>

            {/* Hub Summary Badge */}
            {selectedHub !== "all" && (
              <div
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>🏢</span>
                <span>
                  {selectedHub}: {filteredOrders.length} orders
                </span>
              </div>
            )}
          </div>
        </div>

        {hasGroupedMarkers && (
          <div
            style={{
              backgroundColor: "#fff3cd",
              padding: "14px",
              borderRadius: "8px",
              marginBottom: "15px",
              border: "1px solid #ffc107",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#856404",
                fontWeight: "500",
              }}
            >
              ⚠️ <strong>Multiple Orders at Same Location:</strong>{" "}
              {Object.keys(locationGroups).length} location(s) have multiple
              orders. Markers with a red badge show the count of orders at that
              location.
            </p>
          </div>
        )}

        <div
          style={{
            backgroundColor: "#e7f3ff",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid #b3d9ff",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#0066cc",
              fontWeight: "500",
            }}
          >
            💡 <strong>Map Guide:</strong> Each order shows as a colored pin
            with order number.
            {selectedHub !== "all" &&
              ` Currently viewing orders for ${selectedHub} hub. `}
            Markers at the same location are automatically spread in a circle
            pattern. Red badge indicates multiple orders at that location. Click
            any marker for details.
          </p>
        </div>

        {/* Enhanced Legend with Visual Markers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ margin: "0 0 15px 0" }}>📍 Order Marker Types</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {Object.entries(addressTypeConfig).map(([type, config]) => {
                const markerIcon = createPinShapedMarker("1", type, false, 1);
                return (
                  <div
                    key={type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      padding: "12px",
                      backgroundColor: "white",
                      borderRadius: "6px",
                      border: `2px solid ${config.color}40`,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                    }}
                  >
                    <img
                      src={markerIcon.url}
                      alt={`${type} marker`}
                      style={{ width: "40px", height: "48px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "15px",
                          marginBottom: "4px",
                          color: "#333",
                        }}
                      >
                        {config.label} {config.icon}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#666",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "12px",
                            height: "12px",
                            backgroundColor: config.color,
                            borderRadius: "2px",
                            border: "1px solid white",
                            boxShadow: "0 0 3px rgba(0,0,0,0.3)",
                          }}
                        ></span>
                        {type !== "default" ? type : "Other locations"}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Group marker example */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "12px",
                  backgroundColor: "#fff3cd",
                  borderRadius: "6px",
                  border: "2px solid #ffc107",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={createPinShapedMarker("1", "PG", true, 3).url}
                  alt="Grouped marker example"
                  style={{ width: "40px", height: "48px" }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      marginBottom: "4px",
                      color: "#333",
                    }}
                  >
                    Grouped Location 🔴
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Red badge shows multiple orders at same location
                  </div>
                </div>
              </div>

              {/* Cluster legend */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "12px",
                  backgroundColor: "#e7f3ff",
                  borderRadius: "6px",
                  border: "2px solid #b3d9ff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "white",
                    background: "linear-gradient(45deg, #007bff, #0056b3)",
                    borderRadius: "50%",
                    border: "3px solid white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  5
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "15px",
                      marginBottom: "4px",
                      color: "#333",
                    }}
                  >
                    Cluster Markers 🔵
                  </div>
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    Shows grouped orders. Click to zoom in and see individual
                    orders.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ margin: "0 0 15px 0" }}>📊 Order Statistics</h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  border: "2px solid #e3f2fd",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <span
                  style={{ fontWeight: "600", fontSize: "16px", color: "#555" }}
                >
                  {selectedHub === "all"
                    ? "Total Orders:"
                    : `Orders in ${selectedHub}:`}
                </span>
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    color: "#007bff",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {filteredOrders.length}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  backgroundColor: "white",
                  borderRadius: "6px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "14px", color: "#555" }}>
                  📍 Mapped Orders:
                </span>
                <strong style={{ color: "#28a745", fontSize: "18px" }}>
                  {filteredOrders.filter((order) => order.coordinates).length}
                </strong>
              </div>

              {hasGroupedMarkers && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px",
                    backgroundColor: "#fff3cd",
                    borderRadius: "6px",
                    alignItems: "center",
                    border: "1px solid #ffc107",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#856404" }}>
                    🔴 Grouped Locations:
                  </span>
                  <strong style={{ color: "#ff6b35", fontSize: "18px" }}>
                    {Object.keys(locationGroups).length}
                  </strong>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px",
                  backgroundColor: "white",
                  borderRadius: "6px",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "14px", color: "#555" }}>
                  🕐 Last Updated:
                </span>
                <strong style={{ color: "#ff6b35", fontSize: "14px" }}>
                  {new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </strong>
              </div>

              {/* Hub Summary */}
              {selectedHub === "all" && hubs.length > 0 && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "12px",
                    backgroundColor: "#f0f9ff",
                    borderRadius: "6px",
                    border: "1px solid #bae6fd",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "13px",
                      marginBottom: "10px",
                      color: "#0369a1",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span>🏢</span>
                    <span>Hub Distribution</span>
                  </div>
                  {hubs.slice(0, 4).map((hub, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        padding: "4px 0",
                        borderBottom:
                          index < Math.min(hubs.length, 4) - 1
                            ? "1px solid #e0f2fe"
                            : "none",
                      }}
                    >
                      <span>🏢 {hub.name}</span>
                      <span style={{ fontWeight: "bold", color: "#0369a1" }}>
                        {hub.count}
                      </span>
                    </div>
                  ))}
                  {hubs.length > 4 && (
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#0ea5e9",
                        textAlign: "center",
                        marginTop: "6px",
                        fontStyle: "italic",
                      }}
                    >
                      +{hubs.length - 4} more hubs
                    </div>
                  )}
                </div>
              )}

              {/* Address Type Breakdown */}
              <div
                style={{
                  marginTop: "8px",
                  padding: "12px",
                  backgroundColor: "white",
                  borderRadius: "6px",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "13px",
                    marginBottom: "10px",
                    color: "#333",
                  }}
                >
                  Order Distribution:
                </div>
                {Object.keys(addressTypeConfig).map((type) => {
                  const count = filteredOrders.filter(
                    (order) => order.addressType === type
                  ).length;
                  if (count === 0 && type === "default") return null;
                  return (
                    <div
                      key={type}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "12px",
                        padding: "4px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <span>
                        {addressTypeConfig[type].icon}{" "}
                        {addressTypeConfig[type].label}
                      </span>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: addressTypeConfig[type].color,
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Grouped Locations Details */}
              {hasGroupedMarkers && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "12px",
                    backgroundColor: "#fff3cd",
                    borderRadius: "6px",
                    border: "1px solid #ffc107",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "13px",
                      marginBottom: "10px",
                      color: "#856404",
                    }}
                  >
                    📍 Orders at Same Location:
                  </div>
                  <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {Object.entries(locationGroups).map(
                      ([groupKey, groupOrders], idx) => (
                        <div
                          key={groupKey}
                          style={{
                            fontSize: "12px",
                            padding: "6px 0",
                            borderBottom:
                              idx < Object.keys(locationGroups).length - 1
                                ? "1px solid #ffc107"
                                : "none",
                          }}
                        >
                          <strong>Location {idx + 1}:</strong>{" "}
                          {groupOrders.length} orders
                          <div
                            style={{
                              paddingLeft: "10px",
                              marginTop: "4px",
                              color: "#666",
                            }}
                          >
                            Orders:{" "}
                            {groupOrders
                              .map((o) => `#${o.orderNumber}`)
                              .join(", ")}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={fetchTodaysOrders}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          🔄 Refresh Orders
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={handleMapLoad}
        options={{
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
          minZoom: 10,
          maxZoom: 20,
        }}
      >
        {/* Individual markers are now handled by the clusterer */}
        {/* Only render InfoWindow for selected order */}
        {selectedOrder && (
          <InfoWindow
            position={{
              lat: selectedOrder.displayLat,
              lng: selectedOrder.displayLng,
            }}
            onCloseClick={() => setSelectedOrder(null)}
          >
            <div
              style={{
                padding: "0",
                maxWidth: "320px",
                fontFamily: "Arial, sans-serif",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "16px",
                  backgroundColor:
                    addressTypeConfig[selectedOrder.addressType]?.color ||
                    "#007bff",
                  color: "white",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color:
                        addressTypeConfig[selectedOrder.addressType]?.color ||
                        "#007bff",
                      fontWeight: "bold",
                      fontSize: "18px",
                      border: "3px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    {selectedOrder.orderNumber}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "18px" }}>
                      Order #{selectedOrder.orderNumber}
                    </h3>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "13px",
                        opacity: 0.9,
                      }}
                    >
                      {addressTypeConfig[selectedOrder.addressType]?.icon}{" "}
                      {selectedOrder.addressType}
                      {selectedOrder.isGrouped && (
                        <span
                          style={{
                            marginLeft: "8px",
                            backgroundColor: "rgba(255,0,0,0.8)",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            fontSize: "11px",
                          }}
                        >
                          {selectedOrder.groupCount} at location
                        </span>
                      )}
                    </p>
                    {selectedOrder.hubName && (
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontSize: "12px",
                          opacity: 0.9,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        🏢 Hub: {selectedOrder.hubName}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "16px" }}>
                <div
                  style={{ display: "grid", gap: "10px", marginBottom: "16px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>👤</span>
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: "15px" }}>
                        {selectedOrder.username}
                      </div>
                      <div style={{ fontSize: "13px", color: "#666" }}>
                        📞 {selectedOrder.Mobilenumber}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details Card */}
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "14px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      fontSize: "14px",
                    }}
                  >
                    <div>
                      <strong>Status:</strong>
                      <div
                        style={{
                          color:
                            selectedOrder.status === "Delivered"
                              ? "#28a745"
                              : selectedOrder.status === "Cooking"
                              ? "#ffc107"
                              : "#007bff",
                          fontWeight: "bold",
                          fontSize: "13px",
                        }}
                      >
                        {selectedOrder.status}
                      </div>
                    </div>
                    <div>
                      <strong>Time Slot:</strong>
                      <div style={{ fontSize: "13px" }}>
                        {selectedOrder.slot}
                      </div>
                    </div>
                    <div>
                      <strong>Total Amount:</strong>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#28a745",
                          fontSize: "13px",
                        }}
                      >
                        ₹{selectedOrder.allTotal}
                      </div>
                    </div>
                    <div>
                      <strong>Items Count:</strong>
                      <div style={{ fontSize: "13px" }}>
                        {selectedOrder.allProduct.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div style={{ fontSize: "13px", marginBottom: "12px" }}>
                  <strong style={{ display: "block", marginBottom: "6px" }}>
                    📦 Order Items:
                  </strong>
                  <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                    {selectedOrder.allProduct.map((product, idx) => (
                      <div
                        key={idx}
                        style={{
                          marginTop: "4px",
                          padding: "6px 0",
                          borderBottom:
                            idx < selectedOrder.allProduct.length - 1
                              ? "1px solid #f0f0f0"
                              : "none",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          • {product.foodItemId?.foodname || "Unknown Item"}
                        </span>
                        <span
                          style={{
                            color: "#666",
                            backgroundColor: "#f0f0f0",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontSize: "11px",
                          }}
                        >
                          Qty: {product.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address */}
                <div
                  style={{
                    padding: "12px",
                    backgroundColor: "#e9ecef",
                    borderRadius: "6px",
                    fontSize: "12px",
                    color: "#495057",
                    lineHeight: "1.4",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <strong>📍 Delivery Address:</strong>
                  <br />
                  {selectedOrder.delivarylocation}
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default AdminOrderAssignment;
