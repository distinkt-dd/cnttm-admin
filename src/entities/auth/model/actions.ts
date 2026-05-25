import { createAsyncThunk } from '@reduxjs/toolkit'
import { Api } from '@shared/api'
import { AUTH_URI } from '@shared/api/constants'
import { AuthApi } from '../api'
import type {
	TAuthData,
	TAuthDataWithOutAccess,
	TAuthLoginRequest,
} from '../types'

const api = new Api(AUTH_URI)
const authApi = new AuthApi(api)

export const login = createAsyncThunk<TAuthData, TAuthLoginRequest>(
	'auth/login',
	async (payload: TAuthLoginRequest) => {
		return await authApi.login(payload)
	},
)

export const getUser = createAsyncThunk<TAuthDataWithOutAccess>(
	'auth/getUser',
	async () => {
		return await authApi.getUser()
	},
)
