import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../tools/UserContext';

const Header = () => {

    const { user, setUser } = useContext(UserContext);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    }

    return (
        <header className='flex justify-between items-center absolute w-full p-5 font-moneserrat z-10'>
            <div>
                <Link to='/'>
                    <h1 className='text-4xl font-bold text-white'>LOOP CINEMA</h1>
                </Link>                    
            </div>
            {user ? (
                <div className='flex flex-row gap-2'>
                    <Link to='/profile'>
                        <button className='border p-2 rounded-md font-semibold text-blue bg-white'>Account</button>
                    </Link>
                    <Link to={`/user-reviews/${user.email}`}>
                        <button className='border p-2 rounded-md font-semibold text-blue bg-white'>Your Review</button>
                    </Link>
                    <Link to='/login'>
                        <button onClick={handleLogout} className='border p-2 rounded-md font-semibold text-blue bg-white'>Log Out</button> 
                    </Link>                                        
                </div>
            ) : (
                <div className='flex flex-row gap-2'>
                    <Link to='/login'>
                        <button className='border p-2 rounded-md font-semibold text-blue bg-white'>Log In</button>
                    </Link>
                    <Link to='/register'>
                        <button className='border p-2 rounded-md font-semibold text-blue bg-white'>Register</button> 
                    </Link>                                        
                </div>
            )}
        </header>
    );
};

export default Header;