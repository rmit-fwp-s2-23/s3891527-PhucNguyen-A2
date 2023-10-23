import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom'; 
import LogIn from '../pages/LogIn';
import UserContext from '../tools/UserContext';

// Mock the axios requests
const mock = new AxiosMockAdapter(axios);

describe("LogIn Component", () => {
  let setUser;

  beforeEach(() => {
    setUser = jest.fn();
    render(
      <UserContext.Provider value={{ user: null, setUser }}>
        <Router>
          <LogIn />
        </Router>
      </UserContext.Provider>
    );
  });

  test("successful login and display of welcome message", async () => {
    // Mock the successful login response
    mock.onPost('http://localhost:8000/login').reply(200, {
      success: true,
      user: {
        name: 'John Doe',
        date: '2023-10-23T14:48:00.000Z', // Example date
      },
    });

    // Fill out the login form
    userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    userEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Await the async actions (API request, state updates)
    await waitFor(() => expect(setUser).toHaveBeenCalled());

    // Assert that setUser was called with the correct data
    expect(setUser).toHaveBeenCalledWith({
      email: 'john@example.com',
      name: 'John Doe',
      date: expect.any(String), // since the date is formatted, we check for any string
    });

    // Here, you would check for the presence of the "Welcome, username" message and logout link.
    // However, since those likely exist outside of the `LogIn` component, you would need to 
    // render the parent component or context provider that handles those elements.
  });

  // Add more tests to handle failed login attempts, validation errors, etc.
});
