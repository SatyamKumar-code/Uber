import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUP'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'


const CaptainHome = () => {

    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [showDropRoute, setShowDropRoute] = useState(false)
    const [currentPosition, setCurrentPosition] = useState(null)
    const [isNearPickup, setIsNearPickup] = useState(false);

    const ridePopupPanelRef = React.useRef(null)
    const confirmRidePopupPanelRef = React.useRef(null)
    const [ride, setRide] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)


    // Track captain's current position
    useEffect(() => {
        const updatePosition = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    setCurrentPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                });
            }
        };
        updatePosition();
        const intervalId = setInterval(updatePosition, 2000);
        return () => clearInterval(intervalId);
    }, []);

    // Show ConfirmRidePopUp only when within 100 meters of pickup
    useEffect(() => {
        if (!ride || !currentPosition || !ride.pickup || showDropRoute) {
            setIsNearPickup(false);
            return;
        }
        if (typeof ride.pickup === 'string' && ride.pickup.includes(',')) {
            const [pickupLat, pickupLng] = ride.pickup.split(',').map(Number);
            const toRad = x => x * Math.PI / 180;
            const R = 6371e3; // meters
            const dLat = toRad(currentPosition.lat - pickupLat);
            const dLng = toRad(currentPosition.lng - pickupLng);
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(pickupLat)) * Math.cos(toRad(currentPosition.lat)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;
            setIsNearPickup(distance <= 100);
        } else {
            setIsNearPickup(false);
        }
    }, [ride, currentPosition, showDropRoute]);
    useEffect(() => {
        if (!socket || !captain?._id) return;


        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        });

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    });
                });
            }
        };
        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation();

        // Listen for new-ride event
        const handleNewRide = (data) => {
            setRide(data);
            setRidePopupPanel(true);
        };
        socket.on('new-ride', handleNewRide);

        // Listen for ride-closed event
        const handleRideClosed = (data) => {
            setRidePopupPanel(false);
        };
        socket.on('ride-closed', handleRideClosed);

        // Cleanup
        return () => {
            clearInterval(locationInterval);
            socket.off('new-ride', handleNewRide);
            socket.off('ride-closed', handleRideClosed);
        };
    }, [socket, captain._id]);

    async function confirmRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        setRidePopupPanel(false)
        // ConfirmRidePopUp will open automatically when within 10 meters
    }

    // After OTP confirmation, show route to drop location
    function handleOtpConfirmed() {
        setShowDropRoute(true);
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])



    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/home' className=' h-9 w-9 bg-white flex items-center justify-center rounded-full'>
                    <i className='text-lg font-medium ri-logout-box-r-line'></i>
                </Link>
            </div>
            <div className='h-3/5'>
                {/* <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" /> */}
                <LiveTracking
                    className="h-full w-full"
                    pickup={
                        ride && !showDropRoute && ride.pickup && typeof ride.pickup === 'string' && ride.pickup.includes(',')
                            ? {
                                lat: Number(ride.pickup.split(',')[0]),
                                lng: Number(ride.pickup.split(',')[1])
                            }
                            : null
                    }
                    drop={
                        ride && showDropRoute && ride.destination && typeof ride.destination === 'string' && ride.destination.includes(',')
                            ? {
                                lat: Number(ride.destination.split(',')[0]),
                                lng: Number(ride.destination.split(',')[1])
                            }
                            : null
                    }
                />
            </div>
            <div className='h-2/5 p-6'>
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirnRidePopupPanel={() => { }}
                    confirmRide={confirmRide}
                />
            </div>
            {isNearPickup && !showDropRoute && (
                <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                    <ConfirmRidePopUp
                        ride={ride}
                        setConfirnRidePopupPanel={() => { }}
                        setRidePopupPanel={setRidePopupPanel}
                        onOtpConfirmed={handleOtpConfirmed}
                    />
                </div>
            )}
        </div>
    )
}

export default CaptainHome