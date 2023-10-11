import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '.';

interface MenuItem {
  label: string;
  key: string;
}

jest.mock('antd', () => ({
  Menu: ({ items }: { items: MenuItem[] }) => {
    return (
      <ul data-testid="menu">
        {items.map(item => (
          <li key={item.key}>
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    );
  },
}));

describe('test navbar', () => {
    
  test('navbar title render correctly', async () => {
    render(<Navbar />);
    const title = screen.getByText('React Unit Testing');
    expect(title).toBeDefined();
  });

  test('navbar author render correctly', async () => {
    render(<Navbar />);
    const author = screen.getByText('Adri Antori');
    expect(author).toBeDefined();
  });

  test('navbar week render correctly', async () => {
    render(<Navbar />);
    const week = screen.getByText('RevoU Week 14');
    expect(week).toBeDefined();
  });
});
