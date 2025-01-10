import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios, { Axios } from 'axios'
import { UserDataContext } from '../context/UserContext'
import { useContext } from 'react'


const UserSignup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [userData, setUserData] = useState({})

    const navigate = useNavigate()

    const { user, setUser} = useContext(UserDataContext)


    const submitHandler = async (e) => {
        e.preventDefault()
        const newUser = {
            fullname: {
                firstname: firstName,
                lastname: lastName
            },
            email: email,
            password: password
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser)

        if (response.status === 201) {
            const data = response.data
            setUser(data.user)
            localStorage.setItem('token', data.token)
            navigate('/home')
        }

        setEmail('')
        setFirstName('')
        setLastName('')
        setPassword('')
    }
    return (
        <div>
            <div className='p-7 h-screen flex flex-col justify-between' >
                <div>
                    <img className='w-16 mb-10 ' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber_logo" />

                    <form onSubmit={(e) => {
                        submitHandler(e)
                    }}>

                        <h3 className='text-lg font-medium mb-2'>What's your name</h3>
                        <div className='flex gap-4 mb-6'>
                            <input
                                className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base'
                                required type="text"
                                placeholder='First name'
                                value={firstName}
                                onChange={(e) => {
                                    setFirstName(e.target.value)
                                }}
                            />
                            <input
                                className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base'
                                required type="text"
                                placeholder='Last name'
                                value={lastName}
                                onChange={(e) => {
                                    setLastName(e.target.value)
                                }}
                            />
                        </div>

                        <h3 className='text-lg font-medium mb-2'>What's your email</h3>

                        <input
                            className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                            required type="email"
                            placeholder='email@example.com'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                        />

                        <h3 className='text-lg font-medium mb-2' >Enter Password</h3>

                        <input
                            className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'

                            required type="password"
                            placeholder='password'
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />

                        <button
                            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg placeholder:text-base'
                        >Creat account</button>

                    </form>
                    <p className='text-center'>Already have account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
                </div>
                <div>
                    <p className='text-[10px] leading-tight'>This site is protected by rePAPTCHA and the <span className='underline'>Google Policy</span> and <span className='underline'>Term of Service apply</span>.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserSignup