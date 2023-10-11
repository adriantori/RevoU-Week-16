import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Datas from '.';
import { AppContext } from '../../Provider/AppProvider';
import { useNavigate } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockCategories = [
  { key: '1', id: '1', name: 'Category 1', is_active: true },
  { key: '2', id: '2', name: 'Category 2', is_active: false },
];

const response = {
  "data": [],
  "current_page": 1,
  "total_item": 0,
  "total_page": 0
}

global.fetch = jest.fn().mockResolvedValue({
  json: () => Promise.resolve(response)
})

const mockNavigate = jest.fn();
(useNavigate as jest.Mock).mockReturnValue(mockNavigate);

describe('Datas Component', () => {
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

  it('renders without crashing', () => {
    render(
      <AppContext.Provider value={{ categories: mockCategories, setCategories: jest.fn(), isNameUnique: jest.fn(), token: null, setToken: jest.fn() }}>
        <Datas />
      </AppContext.Provider>
    );
    expect(screen.getByText('List of Category')).toBeDefined();
  });


  it('displays categories in the table', async () => {
    render(
      <AppContext.Provider value={{ categories: mockCategories, setCategories: jest.fn(), isNameUnique: jest.fn(), token: null, setToken: jest.fn() }}>
        <Datas />
      </AppContext.Provider>
    );
  
    await waitFor(async () => {
      mockCategories.forEach((category) => {
        expect(screen.getByText(category.name)).toBeDefined();
      });
    });
  });

  it('handles logout', () => {
    const setCategoriesMock = jest.fn();
  
    render(
      <AppContext.Provider value={{ categories: mockCategories, setCategories: setCategoriesMock, isNameUnique: jest.fn(), token: null, setToken: jest.fn() }}>
        <Datas />
      </AppContext.Provider>
    );
  
    act(() => {
      fireEvent.click(screen.getByText('Log Out'));
    });
  
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
  
  

  // Add more test cases for other functionalities as needed
});
