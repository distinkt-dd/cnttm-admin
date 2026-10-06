import { createSlice } from '@reduxjs/toolkit'
import type { TUser } from '../types'
import {
	createUser,
	deleteUser,
	getUserById,
	getUsers,
	updateUser,
} from './actions'

type TUsersInitialState = {
	users: TUser[] | null
	currentUser: TUser | null
	isResponse: boolean
	error: string
}

const initialState: TUsersInitialState = {
	users: null,
	currentUser: null,
	isResponse: false,
	error: '',
}

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		clearCurrentUser: state => {
			state.currentUser = null
		},
	},
	selectors: {
		selectedUsers: state => state.users,
		selectedUsersCurrent: state => state.currentUser,
		selectedUsersIsResponse: state => state.isResponse,
		selectedUsersError: state => state.error,
	},
	extraReducers: builder => {
		builder
			.addCase(getUsers.fulfilled, (state, action) => {
				state.users = action.payload.data
				state.isResponse = false
				state.error = ''
			})
			.addCase(getUsers.pending, state => {
				state.isResponse = true
				state.error = ''
			})
			.addCase(getUsers.rejected, (state, action) => {
				state.isResponse = false
				state.error = action.error.message as string
			})

			.addCase(getUserById.fulfilled, (state, action) => {
				state.currentUser = action.payload.data
				state.isResponse = false
				state.error = ''
			})
			.addCase(getUserById.rejected, (state, action) => {
				state.isResponse = false
				state.error = action.error.message as string
			})

			.addCase(createUser.fulfilled, (state, action) => {
				if (state.users) state.users.unshift(action.payload.data)
				state.isResponse = false
				state.error = ''
			})
			.addCase(createUser.rejected, (state, action) => {
				state.isResponse = false
				state.error = action.error.message as string
			})

			.addCase(updateUser.fulfilled, (state, action) => {
				if (state.users) {
					state.users = state.users.map(u =>
						u.id === action.payload.data.id ? action.payload.data : u,
					)
				}
				state.currentUser = action.payload.data
				state.isResponse = false
				state.error = ''
			})
			.addCase(updateUser.rejected, (state, action) => {
				state.isResponse = false
				state.error = action.error.message as string
			})

			.addCase(deleteUser.fulfilled, state => {
				state.isResponse = false
				state.error = ''
			})
			.addCase(deleteUser.rejected, (state, action) => {
				state.isResponse = false
				state.error = action.error.message as string
			})
	},
})

export const { clearCurrentUser } = usersSlice.actions

export const {
	selectedUsers,
	selectedUsersCurrent,
	selectedUsersIsResponse,
	selectedUsersError,
} = usersSlice.selectors
