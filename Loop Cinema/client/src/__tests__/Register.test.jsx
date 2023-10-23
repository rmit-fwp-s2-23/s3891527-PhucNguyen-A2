import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Register from './Register'; 

test('registers a new user', async () => {
  // Mock the Axios post request
  const mock = new MockAdapter(axios);
  mock.onPost('http://localhost:8000/register').reply(200, {
    data: 'Registration successful!',
  });

  // Render the Register component
  render(<Register />);

  // Fill out the form
  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'Password123' },
  });

  // Submit the form
  fireEvent.click(screen.getByText(/sign up/i));

  // Assert that a success message is displayed
  // This part may need to be adjusted based on how your component shows success or error messages.
  await waitFor(() => 
    expect(screen.getByText('Registration successful!')).toBeInTheDocument()
  );
});
