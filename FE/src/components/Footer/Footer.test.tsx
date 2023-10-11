import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from ".";

describe('test footer', () => {
    it('footer text render correctly', async () => {
        render(<Footer/ >)
        const title = screen.getByText('Adri Antori ©2023 Created for RevoU Week 14')
        expect(title).toBeDefined();
    })
})