import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

const UserLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userData, setUserData] = useState({})
    const [error, setError] = useState('')
    const [isShowPassword, setIsShowPassword] = useState(false);

    const { user, setUser } = useContext(UserDataContext)
    const navigate = useNavigate()



    const submitHandler = async (e) => {
        try {
            e.preventDefault();

        setIsLoading(true);

        // if (!error) {
        //     setIsLoading(false);
        //     setError('Email and Password is not Valid')
        //     return;
        // }

        const userData = {
            email: email,
            password: password
        }
        
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);
        

        if (response.status === 200) {
            const data = response.data
            setUser(data.User)
            localStorage.setItem('token', data.token)
            navigate('/home')
        }
        setError('')
        setEmail('')
        setPassword('')
        setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setError(error.response && error.response.data.message
                ? error.response.data.message
                : error.message)
        }
    }

    return (
        <div className='p-7 h-screen flex flex-col justify-between' >
            <div>
                <img className='w-16 mb-10 ' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber_logo" />

                <form onSubmit={(e) => {
                    submitHandler(e)
                }}>
                    <h3 className='text-lg font-medium mb-2'>What's your email</h3>

                    <input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                        required type="email"
                        placeholder='email@example.com'
                    />

                    <h3 className='text-lg font-medium mb-2' >Enter Password</h3>
                    
                    <div className='relative'>
                    <input
                        className='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        required  type={isShowPassword===false ? 'password' : 'text'}
                        placeholder='password'
                    />
                     <Button className='!absolute top-[4px] right-[8px] z-50 !w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-black'
                        onClick={()=> setIsShowPassword(!isShowPassword)}>
                            {
                                isShowPassword === false ? <IoMdEye className='text-[20px] opacity-75' /> : <IoMdEyeOff className='text-[20px] opacity-75' />
                            }
                        </Button>
                    </div>

                    {error && (
                        <p className='text-red-500 font-medium text-sm text-center'>{error}</p>
                    )}

                    <button
                        className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'
                        
                    >
                        {
                            isLoading === true ? <CircularProgress color='inherit' size={18} />
                                :
                                "Login"
                        }
                    </button>

                </form>
                <p className='text-center'>New hear? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
            </div>
            <div>
                <Link
                    to='/captain-login'
                    className='bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base'
                >Sign in as Captain</Link>
            </div>
        </div>
    )
}

export default UserLogin