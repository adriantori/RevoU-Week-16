import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import EditItem from '.';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('../../hooks', () => ({
    useTokenChecker: jest.fn(() => { })
}));

let mockValue = 'true'; // Initialize with a default value

jest.mock('antd', () => ({
    ...jest.requireActual('antd'),
    Select: jest.fn(({ value, onChange }) => {
        const handleChange = (newValue: string) => {
            mockValue = newValue;
            onChange(newValue);
        };

        return (
            <select
                data-testid="mock-select"
                value={mockValue}
                onChange={(e) => handleChange(e.target.value)}
            >
                <option value="true">Active</option>
                <option value="false">Deactive</option>
            </select>
        );
    }),
}));

const response = {
    "data": {
        "id": "ad8d0f3b-1ebe-4f55-80a5-b3ee60b182c9",
        "is_active": true,
        "name": "mock category",
        "updated_at": "2023-09-28T04:12:13.890Z",
        "created_at": "2023-09-28T04:12:13.890Z"
    }
}

global.fetch = jest.fn().mockResolvedValue({
    json: () => Promise.resolve(response)
})

describe('test add item', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: jest.fn(),
                removeListener: jest.fn(),
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                dispatchEvent: jest.fn(),
            })),
        });
    });

    test('add item title text render correctly', () => {
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        render(
            <MemoryRouter>
                <EditItem />
            </MemoryRouter>
        );

        const title = screen.getByText('Back to Main Page');
        expect(title).toBeDefined();
        act(() => {
            fireEvent.click(title);
        })
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    // test('submit data correctly', async () => {
    //     const mockNavigate = jest.fn();
    //     (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    
    //     render(
    //         <MemoryRouter>
    //             <AddItem />
    //         </MemoryRouter>
    //     );
    
    //     const nameInput = screen.getByPlaceholderText('Name');
    //     const statusInput = screen.getByTestId('mock-select');
    //     const submitButton = screen.getByText('Submit');
    
    //     // Ensure mockValue is 'true' initially
    //     expect(mockValue).toBe('true');
    
    //     await act(async () => {
    //         fireEvent.change(nameInput, { target: { value: 'testName' } });
    
    //         // Change the value to true (boolean)
    //         mockValue = 'true';
    
    //         // Select the option that corresponds to true
    //         fireEvent.change(statusInput, { target: { value: 'true' } });
    
    //         fireEvent.click(submitButton);
    //     });
    
    //     // Wait for the fetch to complete
    //     await waitFor(() => {
    //         expect(global.fetch).toHaveBeenCalledWith('https://mock-api.arikmpt.com/api/category/create', expect.any(Object));
    //     });
    // }, 30000);

});
