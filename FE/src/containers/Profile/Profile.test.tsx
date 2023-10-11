import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Profile from '.';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

// Mock useTokenChecker hook
jest.mock('../../hooks/useTokenChecker', () => jest.fn());

describe('Profile Component', () => {
    const mockResponse = {
        data: {
            id: '123',
            name: 'John Doe',
            email: 'john.doe@example.com',
        },
    };

    // Mock the fetch function to return the desired response
    global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve(mockResponse)
    })

    beforeEach(() => {
        localStorage.setItem('token', 'mockToken');
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should render profile information', async () => {
        render(<Profile />);

        // Wait for API call and state updates
        await screen.findByText(/Name: John Doe/);

        expect(screen.getByText(/ID: 123/)).toBeDefined();
        expect(screen.getByText(/Name: John Doe/)).toBeDefined();
        expect(screen.getByText(/Email: john.doe@example.com/)).toBeDefined();
    });

    it('should navigate to the main page on Back button click', () => {
        const mockNavigate = jest.fn(); //mocked function
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        render(<Profile />);
        
        
        const backButton = screen.getByText('Back to Main Page');
        expect(backButton).toBeDefined();
    
        act(() => {
            fireEvent.click(backButton);
        })
    
        // Ensure navigate is called with the correct argument
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
