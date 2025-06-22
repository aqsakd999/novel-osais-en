/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/prefer-screen-queries */
import { act, fireEvent, render } from '@testing-library/react'
import Login from '../Login'
import { BrowserRouter } from 'react-router-dom'
import AppProvider from '@app/config/AppProvider'
import { Provider } from 'react-redux'
import { store } from '@app/store/store'
import { screen } from '@testing-library/dom'
import { mockApi } from '@app/helpers/test-helpers/api-mock'
import axiosInstance from '@app/api/axios'
import { E00001 } from '@app/common/Messages'

describe('LoginScreen', () => {
  it('should display error message if username or password is not provided', async () => {
    render(
      <BrowserRouter>
        <Provider store={store}>
          <AppProvider>
            <Login />
          </AppProvider>
        </Provider>
      </BrowserRouter>,
    )

    const loginButton = screen.getByTestId('loginButton')

    await act(async () => {
      await fireEvent.click(loginButton)
    })

    expect(screen.getByText(E00001(`ログインID`))).toBeInTheDocument()
    expect(screen.getByText(E00001(`パスワード`))).toBeInTheDocument()
  })

  it('store token in local storage when login success', async () => {
    mockApi(axiosInstance)
      .onPost('/api/admin/auth', {
        params: {
          email: 'testuser',
          password: 'password123',
        },
      })
      .reply({
        userInfo: { id: 1, name: 'John Smith' },
        accessToken: 'fakeAccessToken',
        refreshToken: 'fakeRefreshToken',
      })
    render(
      <BrowserRouter>
        <Provider store={store}>
          <AppProvider>
            <Login />
          </AppProvider>
        </Provider>
      </BrowserRouter>,
    )

    const userIdInput = screen.getByTestId('username')
    const passwordInput = screen.getByTestId('password')

    fireEvent.change(userIdInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const loginButton = screen.getByTestId('loginButton')

    await act(async () => {
      await fireEvent.click(loginButton)
    })

    const storedAccessToken = localStorage.getItem('ACCESS_TOKEN')
    const storedRefreshToken = localStorage.getItem('REFRESH_TOKEN')

    expect(storedAccessToken).toBe('fakeAccessToken')
    expect(storedRefreshToken).toBe('fakeRefreshToken')
  })
})
