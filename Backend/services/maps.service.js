
const axios = require('axios');
const captainModel = require('../models/captain.model');

// Photon API geocoding (address to coordinates)
module.exports.getAddressCoordinate = async (address) => {
    if (!address) throw new Error('Address is required');
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`;
    try {
        const response = await axios.get(url);
        if (response.data && response.data.features && response.data.features.length > 0) {
            const coords = response.data.features[0].geometry.coordinates;
            return {
                lng: coords[0],
                ltd: coords[1]
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Distance calculation using Haversine formula (since Photon/OSM does not provide direct distance matrix)
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    // origin and destination should be in 'lat,lng' format
    const [originLat, originLng] = origin.split(',').map(Number);
    const [destLat, destLng] = destination.split(',').map(Number);
    if (
        isNaN(originLat) || isNaN(originLng) ||
        isNaN(destLat) || isNaN(destLng)
    ) {
        throw new Error('Invalid coordinates');
    }

    // Haversine formula
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371; // km
    const dLat = toRad(destLat - originLat);
    const dLon = toRad(destLng - originLng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(originLat)) * Math.cos(toRad(destLat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Assume average speed 40km/h for time estimate
    const duration = (distance / 40) * 60; // in minutes

    return {
        distance: { value: distance * 1000, text: `${distance.toFixed(2)} km` },
        duration: { value: duration * 60, text: `${duration.toFixed(0)} mins` }
    };
};

// Photon API autocomplete
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=7`;
    try {
        const response = await axios.get(url);
        if (response.data && response.data.features) {
            return response.data.features.map(f => ({
                description: f.properties.name + (f.properties.city ? ', ' + f.properties.city : ''),
                coordinates: f.geometry.coordinates
            }));
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    // Manual Haversine filtering since location is not GeoJSON
    const allCaptains = await captainModel.find({ 'location.ltd': { $exists: true }, 'location.lng': { $exists: true } });
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371; // km
    const filtered = allCaptains.filter(captain => {
        const clat = captain.location.ltd;
        const clng = captain.location.lng;
        if (typeof clat !== 'number' || typeof clng !== 'number') return false;
        const dLat = toRad(clat - ltd);
        const dLon = toRad(clng - lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(ltd)) * Math.cos(toRad(clat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance <= radius;
    });
    return filtered;
};