import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Profile from '../pages/Profile';
import UserContext from '../tools/UserContext'; 
import axios from 'axios';

jest.mock('axios'); // This line mocks all axios calls

describe('Profile component', () => {
  let user;
  let setUser;

  beforeEach(() => {
    user = {
      email: 'test@example.com',
      name: 'Test User',
      date: 'January 1, 2022',
    };

    setUser = jest.fn();

    render(
      <UserContext.Provider value={{ user, setUser }}>
        <Profile />
      </UserContext.Provider>
    );
  });

  test('displays user information correctly', () => {
    expect(screen.getByText('Name:')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Joined:')).toBeInTheDocument();
    expect(screen.getByText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(screen.getByText(user.date)).toBeInTheDocument();
  });

  test('allows the user to edit their name', async () => {
    axios.put.mockResolvedValue({ data: { success: true } });

    fireEvent.click(screen.getByText('Edit Name'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Name' } });
    fireEvent.click(screen.getByText('Save Name'));

    await waitFor(() => expect(setUser).toHaveBeenCalled());

    expect(axios.put).toHaveBeenCalledWith('http://localhost:8000/user/name', { name: 'New Name', email: user.email });
    expect(screen.getByText('Name change successfully!')).toBeInTheDocument();
  });

  test('handles failed name update', async () => {
    axios.put.mockResolvedValue({ data: { success: false, message: 'Error updating name.' } });

    fireEvent.click(screen.getByText('Edit Name'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Name' } });
    fireEvent.click(screen.getByText('Save Name'));

    await waitFor(() => expect(setUser).not.toHaveBeenCalled());

    expect(axios.put).toHaveBeenCalledWith('http://localhost:8000/user/name', { name: 'New Name', email: user.email });
    expect(screen.getByText('Error updating name.')).toBeInTheDocument();
  });

  test('allows the user to change their password', async () => {
    axios.put.mockResolvedValue({ data: { success: true } });

    fireEvent.click(screen.getByText('Change Password'));
    fireEvent.change(screen.getByPlaceholderText('Current Password'), { target: { value: 'oldPassword' } });
    fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newPassword' } });
    fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'newPassword' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => expect(axios.put).toHaveBeenCalled());

    expect(axios.put).toHaveBeenCalledWith('http://localhost:8000/user/password', {
      email: user.email,
      currentPassword: 'oldPassword',
      newPassword: 'newPassword',
    });
    expect(screen.getByText('Password changed successfully!')).toBeInTheDocument();
  });

  // Add more tests here to cover other functionalities like failed password change, account deletion, etc.
});
