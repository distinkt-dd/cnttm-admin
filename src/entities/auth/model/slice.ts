import { createSlice } from '@reduxjs/toolkit'
import type { TUser } from '../types'
import { getUser, login, logout } from './actions'

type TAuthInitialState = {
	user: TUser | null
	error: string | ''
	isResponse: boolean
	isAuthChecked: boolean
}

const authInitialState: TAuthInitialState = {
	user: null,
	error: '',
	isResponse: false,
	isAuthChecked: false,
}

export const authSlice = createSlice({
	name: 'auth',
	initialState: authInitialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload
		},
		setIsAuthChecked: (state, action) => {
			state.isAuthChecked = action.payload
		},
		clearAll: state => {
			state.isAuthChecked = true
			state.isResponse = false
			state.error = ''
			state.user = null
		},
	},
	extraReducers: builder => {
		builder
			.addCase(login.fulfilled, (state, action) => {
				state.user = action.payload.data.user
				state.isAuthChecked = true
				state.isResponse = false
				state.error = ''
			})
			.addCase(login.pending, state => {
				state.isResponse = true
				state.error = ''
			})
			.addCase(login.rejected, (state, action) => {
				state.error = action.error.message as string
				state.isResponse = false
				state.isAuthChecked = true
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.isResponse = false
				state.isAuthChecked = true
				state.error = ''
				state.user = action.payload.data.user
			})
			.addCase(getUser.pending, state => {
				state.isAuthChecked = false
			})
			.addCase(getUser.rejected, (state, action) => {
				state.isAuthChecked = true
				state.isResponse = false
				state.user = null
				state.error = action.error.message as string
			})
			.addCase(logout.fulfilled, state => {
				state.user = null
				state.error = ''
				state.isResponse = false
				state.isAuthChecked = true
			})
			.addCase(logout.rejected, (state, action) => {
				state.user = null
				state.error = action.error.message as string
				state.isResponse = false
				state.isAuthChecked = true
			})
			.addCase(logout.pending, state => {
				state.isResponse = true
			})
	},
	selectors: {
		selectedAuthUser: state => state.user,
		selectedAuthError: state => state.error,
		selectedAuthIsResponse: state => state.isResponse,
		selectedAuthIsAuthChecked: state => state.isAuthChecked,
		selectedIsAdmin: state => state.user?.role === 'ADMIN',
	},
})

export const { setIsAuthChecked, setUser } = authSlice.actions

export const {
	selectedAuthError,
	selectedAuthIsAuthChecked,
	selectedAuthIsResponse,
	selectedAuthUser,
	selectedIsAdmin,
} = authSlice.selectors
