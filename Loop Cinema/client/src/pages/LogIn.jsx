import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import UserContext from '../tools/UserContext';

const LogIn = () => {

  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  }

  const login = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!email) errors.email = 'Email is required';
    else if (!validateEmail(email)) errors.email = 'Please enter a valid email';
    if (!password) errors.password = 'Password is required';
    
    setErrors(errors);

    if (Object.keys(errors).length) {
      setErrors(errors)
      return;
    }

    axios.post('http://localhost:8000/login', {
      email: email,
      password: password
    })
    .then(response => {
      if (response.data.success) {
        const formattedDate = new Date(response.data.user.date).toLocaleString('en-US', {
          day: '2-digit',
          month: 'long', 
          year: 'numeric', 
        });
        setUser({ email: email, name: response.data.user.name, date: formattedDate })
        localStorage.setItem('user', JSON.stringify({ email: email, name: response.data.user.name, date: formattedDate }))
        navigate('/')
      } else {
        setErrors({ general: "Invalid email or password." })
      }
    }).catch(error => {
      console.error('Error on login:', error)
      setErrors({ general: "An error occurred during login. Please try again." })
    });
  }

  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <form className='border-2 border-blue rounded-md p-5 flex flex-col gap-3 justify-center items-center'>
            <div className='w-10/12 flex flex-col gap-2'>
                <label className='text-white text-xl font-montserrat' htmlFor='email'>Email</label>
                <input className='w-full p-2 rounded-md outline-none border-2 border-white bg-black focus:border-blue text-white' onChange={(e) => {setEmail(e.target.value)}} name='email' type='text' id='email' autoComplete='off' placeholder=''></input>
                {errors.email && <p className="text-red">{errors.email}</p>}
            </div>
            <div className='w-10/12 flex flex-col gap-2'>
                <label className='text-white text-xl font-montserrat' htmlFor='password'>Password</label>
                <input className='w-full p-2 rounded-md outline-none border-2 border-white bg-black focus:border-blue text-white' onChange={(e) => {setPassword(e.target.value)}} name='password' type='password' id='password' placeholder=''></input>
                {errors.password && <p className="text-red">{errors.password}</p>}
            </div>
            <p className='text-white'>New to Loop Cinema <a className='text-blue' href='/register'>Register Now</a></p>
            {errors.general && <p className="text-red">{errors.general}</p>}
            <button onClick={login} className='bg-blue text-white rounded-md w-10/12 p-2 font-montserrat font-bold' type='submit'>LOG IN</button>
        </form>
    </div>
  )
}

export default LogIn