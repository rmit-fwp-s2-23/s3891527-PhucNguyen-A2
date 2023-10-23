import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import axios from 'axios';
import AxiosMockAdapter from 'axios-mock-adapter';
import Review from '../pages/Review';
import UserContext from '../tools/UserContext';

// This sets the mock adapter on the default instance
const axiosMock = new AxiosMockAdapter(axios);

// Mock response data for axios calls
const mockMovie = {
  data: { title: "Test Movie", backdrop_path: "/test.jpg" },
};
const mockReviews = {
  data: { reviews: [{ userEmail: "test@example.com", rating: 5, reviewText: "Great!" }] },
};
const mockSubmitResponse = { data: { message: 'Review submitted successfully!' } };

// Mock user context
const mockUser = { email: 'test@example.com' };

describe('Review component', () => {
  beforeEach(() => {
    // Define our mock API responses for each axios call
    axiosMock.onGet(/\/movie-details\/.+/).reply(200, mockMovie.data);
    axiosMock.onGet(/http:\/\/localhost:8000\/reviews\/.+/).reply(200, mockReviews.data);
    axiosMock.onPost('http://localhost:8000/submit-review').reply(200, mockSubmitResponse);
  });

  test('fetches and displays movie data and reviews', async () => {
    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <MemoryRouter initialEntries={['/reviews/1']}>
          <Route path="/reviews/:movieId">
            <Review />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>
    );

    // Wait for axios responses and the DOM to update
    await waitFor(() => screen.getByText(/Test Movie/i));

    expect(screen.getByText(/Test Movie/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Rating/i)).toBeInTheDocument();
    expect(screen.getByText(/Great!/i)).toBeInTheDocument();
  });

  test('allows user to submit a review', async () => {
    render(
      <UserContext.Provider value={{ user: mockUser }}>
        <MemoryRouter initialEntries={['/reviews/1']}>
          <Route path="/reviews/:movieId">
            <Review />
          </Route>
        </MemoryRouter>
      </UserContext.Provider>
    );

    // Wait for axios responses and the DOM to update
    await waitFor(() => screen.getByText(/Test Movie/i));

    // Fill out the review form
    fireEvent.change(screen.getByPlaceholderText(/Write your review here.../i), { target: { value: 'This is my review.' } });
    fireEvent.click(screen.getByText(/Submit Review/i));

    // Wait for the POST request to complete and the DOM to update
    await waitFor(() => screen.getByText(/Review submitted successfully!/i));

    expect(screen.getByText(/Review submitted successfully!/i)).toBeInTheDocument();
  });

  // You can add more tests to check error handling, UI elements, and other user interactions.
});
