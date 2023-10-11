import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import Register from '.';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Mock the Notification component
jest.mock('../../components', () => jest.fn());

describe('Register Component', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(), // Deprecated
                removeListener: jest.fn(), // Deprecated
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    })

    const mockResponse = {
        "data": {
            "id": "59daacec-3936-4f29-a16b-695370bb2cf6",
            "name": "user mock2",
            "email": "mockapi2@email.com",
            "password": "$2b$05$OTCX7T5.vS/voV/pCDUUFeNSp.RIzYXb87WQ5rfKVGwoAK4xw.h7y",
            "updated_at": "2023-09-29T02:51:32.181Z",
            "created_at": "2023-09-29T02:51:32.181Z"
        }
    };

    // Mock the fetch function to return the desired response
    global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockResponse)
    })

    const mockNavigate = jest.fn(); //mocked function
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    it('should display and submit the form', async () => {

        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        // Fill in the form fields
        fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        // Submit the form
        fireEvent.click(screen.getByText('Register'));

        // Wait for the API call to complete
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('https://mock-api.arikmpt.com/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password123',
                }),
            });
        });

        // Ensure navigate is called
        //expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should navigate to the login page when Login is clicked', () => {
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );

        act(() => {
            fireEvent.click(screen.getByText('Login now!'));
        })

        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
