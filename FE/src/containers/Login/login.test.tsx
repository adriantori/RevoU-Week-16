import { fireEvent, getByText, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Login from '.';
import { MemoryRouter, useNavigate } from 'react-router-dom';

const mockPostLoginData = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: { token: 'mockedToken' } }),
});
global.fetch = jest.fn().mockImplementation(mockPostLoginData);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Testing Login Container', () => {
    
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

    test('label email render correctly', async () => {
        render(<Login />)
        const emailInput = screen.getByPlaceholderText('Email');
        expect(emailInput).toBeDefined();
    })

    test('label password render correctly', async () => {
        render(<Login />)
        const passwordInput = screen.getByPlaceholderText('Password')
        expect(passwordInput).toBeDefined();
    })

    test('button submit render correctly', async () => {
        render(<Login />)
        const buttonLogin = screen.getByText('Log in')
        expect(buttonLogin).toBeDefined();
    })

    test('submit login form and set token in localStorage', async() => {
        const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');
        const mockNavigate = jest.fn(); //mocked function
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );
    
        const emailInput = screen.getByPlaceholderText('Email');
        const passwordInput = screen.getByPlaceholderText('Password');
        const submitButton = screen.getByText('Log in');
    
        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'testingUser123' } });
            fireEvent.click(submitButton);
        });
    
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('https://mock-api.arikmpt.com/api/user/login', expect.any(Object));
            
            // Add an expectation to verify localStorage.setItem usage
            expect(mockSetItem).toHaveBeenCalledWith('token', 'mockedToken');
    
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
})