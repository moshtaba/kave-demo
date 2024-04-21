// Home.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // Mock axios for API requests
import Home from '../app/page';
import '@testing-library/jest-dom'; // Import jest-dom for additional matchers
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

// Mock axios.post to simulate successful post request
jest.mock('axios');

describe('Home Page', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient(); // Create a new QueryClient instance for each test
  });

  test('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <QueryClientProvider client={queryClient}> {/* Provide the QueryClient */}
        <Home />
      </QueryClientProvider>
    );
    
    expect(getByText('Create New Post')).toBeInTheDocument();
    expect(getByLabelText('title')).toBeInTheDocument();
    expect(getByLabelText('body')).toBeInTheDocument();
    expect(getByText('Submit')).toBeInTheDocument();
  });
  
  test('disables submit button when form is invalid or submitting', () => {
    const { getByText, getByLabelText } = render(
      <QueryClientProvider client={queryClient}> {/* Provide the QueryClient */}
      <Home />
    </QueryClientProvider>
    );
    const submitButton = getByText('Submit');

    // Invalid form
    fireEvent.change(getByLabelText('title'), { target: { value: '' } });
    fireEvent.change(getByLabelText('body'), { target: { value: '' } });
    fireEvent.click(submitButton);
    expect(submitButton).toBeDisabled();

    // Valid form, submitting
    fireEvent.change(getByLabelText('title'), { target: { value: 'Test Title' } });
    fireEvent.change(getByLabelText('body'), { target: { value: 'Test Body' } });
    fireEvent.click(submitButton);
    expect(submitButton).toBeDisabled();
  });

  test('submits form successfully', async () => {
    const { getByText, getByLabelText } = render(
      <QueryClientProvider client={queryClient}> {/* Provide the QueryClient */}
      <Home />
      <ToastContainer />
    </QueryClientProvider>
    );
    const titleInput = getByLabelText('title');
    const bodyInput = getByLabelText('body');
    const submitButton = getByText('Submit');

    // Fill out form
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(bodyInput, { target: { value: 'Test Body' } });

    // Mock axios post
    axios.post.mockResolvedValueOnce({});

    // Submit form
    fireEvent.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(getByText('Post sent')).toBeInTheDocument();
    });
  });

  test('handles form submission error', async () => {
    const { getByText, getByLabelText } = render(
      <QueryClientProvider client={queryClient}> {/* Provide the QueryClient */}
      <Home />
      <ToastContainer />
    </QueryClientProvider>
    );
    const titleInput = getByLabelText('title');
    const bodyInput = getByLabelText('body');
    const submitButton = getByText('Submit');

    // Fill out form
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(bodyInput, { target: { value: 'Test Body' } });

    // Mock axios post error
    axios.post.mockRejectedValueOnce(new Error('Error'));

    // Submit form
    fireEvent.click(submitButton);

    // Wait for error message
    await waitFor(() => {
      expect(getByText('something went wrong, please try again')).toBeInTheDocument();
    });
  });
});
