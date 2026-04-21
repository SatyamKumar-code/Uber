import React, { useState, useEffect } from 'react'
import { LoadScript, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api'
// import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';


const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const LiveTracking = ({ className, pickup, drop }) => {
    const [currentPosition, setCurrentPosition] = useState(center);
    const [directions, setDirections] = useState(null);

    function RecenterMap({ currentPosition }) {
        if (currentPosition) {
            const map = useMap()
            map.setView(currentPosition, 16, { animate: true })
        }
        return null

    }

    const onDragEnd = (e) => {

        const { lat, lng } = e.target._latlng
        setCurrentPosition({ lat, lng })
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            });
        }


    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude
            });
        });

        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude
            });
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            });
        };

        updatePosition(); // Initial position update

        const intervalId = setInterval(updatePosition, 1000); // Update every 10 seconds
        return () => clearInterval(intervalId);

    }, []);

    useEffect(() => {
        let destination = null;
        if (drop && drop.lat && drop.lng) {
            destination = drop;
        } else if (pickup && pickup.lat && pickup.lng) {
            destination = pickup;
        }
        if (destination && currentPosition.lat && currentPosition.lng) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
                {
                    origin: { lat: currentPosition.lat, lng: currentPosition.lng },
                    destination: { lat: destination.lat, lng: destination.lng },
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirections(result);
                    } else {
                        setDirections(null);
                    }
                }
            );
        } else {
            setDirections(null);
        }
    }, [pickup, drop, currentPosition]);

    // Car icon for user-side captain marker
    const carIcon = {
        url: 'https://png.pngtree.com/png-vector/20230110/ourmid/pngtree-sedan-car-top-view-image-png-image_6558830.png', // You can use any car image URL
        scaledSize: { width: 40, height: 40 }
    };

    const pickupIcon = {
        url: '/pickup.png',
        scaledSize: { width: 40, height: 40 }
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
            >
                <Marker position={currentPosition} label="You" icon={carIcon} />
                {pickup && pickup.lat && pickup.lng && (
                    <Marker position={pickup} icon={pickupIcon} />
                )}
                {drop && drop.lat && drop.lng && (
                    <Marker position={drop} label="Drop" />
                )}
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </LoadScript>

        // <MapContainer
        //     className={className || 'h-[65%]'}
        //     center={currentPosition}
        //     zoom={13}
        //     scrollWheelZoom={true}
        // >
        //     <TileLayer
        //         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        //         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //     />
        //     <RecenterMap currentPosition={currentPosition} />
        //     <Marker position={currentPosition} draggable eventHandlers={{ dragend: onDragEnd }} />
        // </MapContainer>
    )
}

export default LiveTracking