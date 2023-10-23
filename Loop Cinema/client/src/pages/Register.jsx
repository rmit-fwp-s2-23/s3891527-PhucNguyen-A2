import React, { useState } from 'react';
import axios from 'axios';


const Register = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const validateEmail = (email) => {
        var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(String(email).toLowerCase());
    }

    const register = async (e) => {
        e.preventDefault();
    
        let errors = {};
    
        if (!name) errors.name = 'Name is required';
        if (!email) errors.email = 'Email is required';
        else if (!validateEmail(email)) errors.email = 'Please enter a valid email';
    
        if (!password) errors.password = 'Password is required';
        else if (password.length < 7) errors.password = 'Password must be at least 7 characters';
        else if (password.search(/[a-z]/) < 0) errors.password = 'Password must contain at least one lowercase letter';
        else if (password.search(/[A-Z]/) < 0) errors.password = 'Password must contain at least one uppercase letter';
        else if (password.search(/[0-9]/) < 0) errors.password = 'Password must contain at least one number';
    
        setErrors(errors);
        setSuccessMessage('');
    
        if (Object.keys(errors).length) return;
    
        // Directly attempt to register the user, since the backend will handle duplicate email logic
        axios.post('http://localhost:8000/register', {
            name: name, 
            email: email, 
            password: password
        }).then(res => {
            console.log(res);
            setSuccessMessage('Registration successful! Please login.');
        })
        .catch(err => {
            console.error(err);
            if (err.response && err.response.data && err.response.data.message) {
                // If the backend responded with a message, use that
                setErrors(prev => ({ ...prev, general: err.response.data.message }));
            } else {
                // Otherwise, use a generic error message
                setErrors(prev => ({ ...prev, general: "Registration failed. Please try again." }));
            }
        });
    };

    return (
    <div className='w-full h-screen flex justify-center items-center'>
        <form className='border-2 border-blue rounded-md p-5 flex flex-col gap-3 justify-center items-center'>
            <div className='w-10/12 flex flex-col gap-2'>
                <label className='text-white text-xl font-montserrat' htmlFor='email'>Name</label>
                <input className='w-full p-2 rounded-md outline-none border-2 border-white bg-black focus:border-blue text-white' onChange={(e) => {setName(e.target.value)}} name='name' type='text' id='name' autoComplete='off' placeholder=''></input>
                {errors.name && <p className="text-red">{errors.name}</p>}
            </div>
            <div className='w-10/12 flex flex-col gap-2'>
                <label className='text-white text-xl font-montserrat' htmlFor='email'>Email</label>
                <input className='w-full p-2 rounded-md outline-none border-2 border-white bg-black focus:border-blue text-white' onChange={(e) => {setEmail(e.target.value)}} name='email' type='text' id='email' autoComplete='off' placeholder=''></input>
                {errors.email && <p className="text-red">{errors.email}</p>}
            </div>
            <div className='w-10/12 flex flex-col gap-2'>
                <label className='text-white text-xl font-montserrat' htmlFor='password'>Password</label>
                <input className='w-full p-2 rounded-md outline-none border-2 border-white bg-black focus:border-blue text-white' onChange={(e) => {setPassword(e.target.value)}} name='password' type='password' id='password' autoComplete='off' placeholder=''></input>
                {errors.password && <p className="text-red">{errors.password}</p>}
            </div>
            <p className='text-white'>Already have account? <a className='text-blue' href='/login'>Log In Now</a></p>
            {errors.general && <p className="text-red">{errors.general}</p>}
            {successMessage && <p className="text-green">{successMessage}</p>}
            <button onClick={register} className='bg-blue text-white rounded-md w-10/12 p-2 font-montserrat font-bold' type='submit'>SIGN UP</button>
        </form>
    </div>
  )
}

export default Register