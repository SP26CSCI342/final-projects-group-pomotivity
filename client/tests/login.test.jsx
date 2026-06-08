import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import React from 'react';

const mockNavigate = vi.fn((arg) => {})
vi.mock('react-router-dom', {
    useNavigate: vi.fn().mockReturnValue((arg) => {})
});

vi.stubGlobal('fetch', vi.fn((arg1, arg2) => {
    return {
        ok: true,
        json: vi.fn(() => {
            return {
                user: { profiles: { firstName: 'test' } },
                data: 'hi'
            };
        })
    };
}));

import Login from '../src/pages/login/login.jsx'

test('tests a successful login', async () => {
    const user = userEvent.setup()

    // create the login component
    render(<Login />);
    
    // enter email
    // get email field
    const emailField = screen.getByLabelText('Login');

    // input to email field
    await user.type(emailField, 'test@email.com');

    // enter password
    // get password field
    const passwordField = screen.getByLabelText('Password');

    // input to password field
    await user.type(passwordField, '1234567890');

    await user.keyboard('{enter}');

    // send it
    // expect navigation to be given '/'
    expect(mockNavigate).toHaveBeenCalledWith('/');
});