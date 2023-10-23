import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import App from './App';
import UserContext from './tools/UserContext';

// Mocking the Auth and its children components since we're not testing them here
jest.mock('./tools/Auth', () => ({ children }) => children);

describe('App component', () => {
  test('renders App with all routes', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Check if the routes render without errors
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    // ...similar checks for other links/routes
  });

  test('provides user context', () => {
    let testUserContext;
    render(
      <MemoryRouter>
        <UserContext.Consumer>
          {context => {
            testUserContext = context;
            return null; // render nothing, we're just testing the context
          }}
        </UserContext.Consumer>
        <App />
      </MemoryRouter>
    );

    expect(testUserContext).toBeDefined();
    expect(testUserContext.user).toBeNull(); // initial user state is null
    expect(typeof testUserContext.setUser).toBe('function');
  });

  // You can add more tests to check different aspects of the App component
});
