import React from "react";

const VehiclePanel = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className='text-3xl text-gray-200 ri-arrow-down-wide-line'></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>Chose a Vehicle</h3>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('car')
            }} className='flex border-2 active:border-black  mb-2 rounded-xl w-full p-3 items-center justify-between'>
                <img className='h-14' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
                <div className='-ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>UberGO <span><i className='ri-user-3-fill'></i>4</span></h4>
                    <h5 className='font-medium text-sm'>2 mins away </h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, compact ride</p>
                </div>
                <h2 className={`text-lg font-semibold ${!props.fare.car && 'text-sm text-gray-700 font-normal'}`}>
                    ₹{props.fare.car ? props.fare.car : 'Loading...'}
                </h2>
            </div>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('moto')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
                <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="Uber Bike png" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>Moto <span><i className='ri-user-3-fill'></i>1</span></h4>
                    <h5 className='font-medium text-sm'>3 mins away </h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, motorcyle ride</p>
                </div>
                <h2 className={`text-lg font-semibold ${!props.fare.moto && 'text-sm text-gray-700 font-normal'}`}>
                    ₹{props.fare.moto ? props.fare.moto : 'Loading...'}
                </h2>
            </div>
            <div onClick={() => {
                props.setConfirmRidePanel(true)
                props.selectVehicle('auto')
            }} className='flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between'>
                <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png" alt="Uber auto png" />
                <div className='ml-2 w-1/2'>
                    <h4 className='font-medium text-base'>UberAuto <span><i className='ri-user-3-fill'></i>3</span></h4>
                    <h5 className='font-medium text-sm'>3 mins away </h5>
                    <p className='font-normal text-xs text-gray-600'>Affordable, Auto ride</p>
                </div>
                <h2 className={`text-lg font-semibold ${!props.fare.auto && 'text-sm text-gray-700 font-normal'}`}>
                    ₹{props.fare.auto ? props.fare.auto : 'Loading...'}
                </h2>
            </div>
        </div>
    )
}

export default VehiclePanel