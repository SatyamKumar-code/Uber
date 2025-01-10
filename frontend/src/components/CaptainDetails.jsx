import React, { useContext, useState } from 'react';
import { CaptainDataContext } from '../context/CapatainContext';

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext);

    return (
        <div>
            <div className='flex items-center justify-between'>
                    <div className='flex items-center justify-start gap-3'>
                        <img className='h-10 w-10 rounded-full object-cover' src="https://preview.redd.it/created-random-people-using-chatgpt-midjourney-do-you-know-v0-q1aa450i5dqb1.png?width=1024&format=png&auto=webp&s=c4e9abc47d193474a2fa1a7e337d9d9340dce947" alt="" />
                        <h4 className='text-lg font-medium capitalize'>{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                    </div>
                    <div>
                        <h4 className='text-xl font-semibold'>₹295.20</h4>
                        <p className='text-sm text-gray-600'>Earned</p>
                    </div>
                </div>
                <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                    <div className='text-center'>
                        <i className='text-3xl mb-2 font-thin ri-timer-2-line'></i>
                        <h5 className='text-lg font-medium'>10.2</h5>
                        <p className='text-sm text-gray-600'>Hours Online</p>

                    </div>
                    <div className='text-center'>
                        <i className='text-3xl mb-2 font-thin ri-speed-up-line'></i>
                        <h5 className='text-lg font-medium'>10.2</h5>
                        <p className='text-sm text-gray-600'>Hours Online</p>
                    </div>
                    <div className='text-center'>
                        <i className='text-3xl mb-2 font-thin ri-booklet-line'></i>
                        <h5 className='text-lg font-medium'>10.2</h5>
                        <p className='text-sm text-gray-600'>Hours Online</p>
                    </div>
                </div>
        </div>
    );
};

export default CaptainDetails;