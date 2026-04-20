import React, { useState, useEffect } from 'react'
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'
// import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';


const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: -3.745,
    lng: -38.523
};

const LiveTracking = ({ className }) => {
    const [currentPosition, setCurrentPosition] = useState(center);

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

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={currentPosition}
                zoom={15}
            >
                <Marker position={currentPosition} />
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