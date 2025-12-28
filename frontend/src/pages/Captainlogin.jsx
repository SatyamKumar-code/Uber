import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

const Captainlogin = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isShowPassword, setIsShowPassword] = useState(false);

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()



  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const captain = {
        email: email,
        password
      }

      // if (!error) {
      //   setError('Email and Password is not Valid')
      //   return;
      // }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

      if (response.status === 200) {
        const data = response.data

        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')

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
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

        <form onSubmit={(e) => {
          submitHandler(e)
        }}>
          <h3 className='text-lg font-medium mb-2'>What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

          <div className='relative'>
          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type={isShowPassword===false ? 'password' : 'text'}
            placeholder='password'
          />
          <Button className='!absolute top-[4px] right-[8px] z-50 !w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-black'
            onClick={() => setIsShowPassword(!isShowPassword)}>
            {
              isShowPassword === false ? <IoMdEye className='text-[20px] opacity-75' /> : <IoMdEyeOff className='text-[20px] opacity-75' />
            }
          </Button>
          </div>

          {error && (
            <p className='text-red-500 font-medium text-sm text-center'>{error}</p>
          )}

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >
            {
              isLoading === true ? <CircularProgress color='inherit' />
                :
                "Login"
            }
            </button>

        </form>
        <p className='text-center'>Join a fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link></p>
      </div>
      <div>
        <Link
          to='/login'
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
        >Sign in as User</Link>
      </div>
    </div>
  )
}

export default Captainlogin