import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import UserContext from '../tools/UserContext';

const Profile = () => {

    const navigate = useNavigate();

    const { user, setUser } = useContext(UserContext);

    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    
    useEffect(() => {
        const storedData = localStorage.getItem('user');
        if (storedData) {
          const userData = JSON.parse(storedData);
          setUser(userData);
        }
      }, []);
      
    const handleNameChange = (event) => {
        setNewName(event.target.value);
    };

    const validatePassword = (password) => {
      if (!password) return 'Missing fields'
      else if (password.length < 7) {
          return 'Password must be at least 7 characters';
      } else if (password.search(/[a-z]/) < 0) {
          return 'Password must contain at least one lowercase letter';
      } else if (password.search(/[A-Z]/) < 0) {
          return 'Password must contain at least one uppercase letter';
      } else if (password.search(/[0-9]/) < 0) {
          return 'Password must contain at least one number';
      }
      return '';
    };

    const handlePasswordChange = async () => {
      setError(null);

      const validationResult = validatePassword(newPassword);
        if (validationResult) {
            setError(validationResult);
            return;
      }

      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match");
        return;
    } try {
      const response = await axios.put('http://localhost:8000/user/password', { 
        email: user.email, 
        currentPassword, 
        newPassword 
      });

      if (response.data.success) {
        setSuccessMessage('Password changed successfully!');
        setIsChangingPassword(false);
      } else {
        setError(response.data.message || "Could not change password");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error changing password");
    }
  };

    const saveNewName = async () => {
        try {
          const response = await axios.put('http://localhost:8000/user/name', { name: newName, email: user.email }, {
          });
    
          if (response.data.success) {
            setUser(prevUser => {
                const updatedUser = {
                  ...prevUser,
                  name: newName,
                };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
            })
            setSuccessMessage('Name change successfully!');
            setIsEditing(false);
            setError(null);
          } else {
            setError(response.data.message || 'Error updating name.');
          }
        } catch (error) {
          setError(error.response?.data?.message || 'Error updating name.');
        }
      };

      const deleteAccount = async () => {
        try {
            const response = await axios.delete('http://localhost:8000/user/delete', { data: { email: user.email } });

            if (response.data.success) {
                // Clear any user data from local storage or context
                localStorage.removeItem('user');
                setUser(null);
                // Redirect to home or login page, or show a message indicating account deletion
                console.log('Account has been deleted');
                navigate('/login')
            } else {
                setError(response.data.message || "Could not delete account");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Error deleting account");
        }
    };

  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <div className='border-2 w-1/3 text-lg border-blue rounded-md p-5 flex flex-col gap-3 justify-center items-center'>
            <h1 className='text-white font-montserrat font-bold text-4xl'>Profile</h1>
            <div className='flex flex-row gap-2'>
                <div className='flex flex-col text-right'>
                    <p className='text-white h-8'>Name: </p>
                    <p className='text-white h-8'>Email: </p>
                    <p className='text-white h-8'>Joined: </p>
                </div>
                <div className='flex flex-col text-left'>
                {isEditing ? (
                        <input className='rounded-md p-1 outline-none text-black'
                            type='text'
                            value={newName}
                            onChange={handleNameChange}
                        />
                    ) : (
                        <p className='text-white h-8'>{user.name}</p>
                    )}
                    <p className='text-white h-8'>{user.email}</p>
                    <p className='text-white h-8'>{user.date}</p>
                </div>
            </div>
            {successMessage && <p className="text-green">{successMessage}</p>}
            {error && <p className='text-red'>{error}</p>}
            {isEditing ? (
                <div className='flex flex-row gap-2'>                
                    <button onClick={saveNewName} className='bg-blue text-white rounded-md p-2 font-montserrat'>Save Name</button>
                    <button onClick={() => setIsEditing(false)} className='bg-blue text-white rounded-md p-2 font-montserrat'>Cancel</button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className='bg-blue text-white rounded-md p-2 font-montserrat'>Edit Name</button>
            )}
      {isChangingPassword ? (
        <div className='flex flex-col gap-2'>
          <input className='rounded-md p-2 outline-none'
            type='password' 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder='Current Password'
          />
          <input className='rounded-md p-2 outline-none'
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder='New Password'
          />
          <input className='rounded-md p-2 outline-none'
            type='password'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder='Confirm New Password'
          />
          <div className='flex flex-row justify-center gap-2'>
            <button onClick={handlePasswordChange} className='bg-blue text-white rounded-md p-2 font-montserrat'>Submit</button>
            <button onClick={() => setIsChangingPassword(false)} className='bg-blue text-white rounded-md p-2 font-montserrat'>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsChangingPassword(true)} className='bg-blue text-white rounded-md p-2 font-montserrat'>Change Password</button>
      )}
        <button onClick={deleteAccount} className='bg-red text-white rounded-md p-2 font-montserrat'>Delete Account</button>
        </div>    
    </div>
  )
}

export default Profile
