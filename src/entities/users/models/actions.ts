import { createAsyncThunk } from '@reduxjs/toolkit'
import { Api } from '@shared/api'
import { USERS_URI } from '@shared/api/constants'
import { UsersApi } from '../api'
import type {
	TUserCreateRequest,
	TUserGetAlone,
	TUserPostResponse,
	TUserUpdateRequest,
	TUsersGetResponse,
} from '../types'

const api = new Api(USERS_URI)
const usersApi = new UsersApi(api)

export type TUpdateUserThunk = TUserUpdateRequest & { id: string }

export const getUsers = createAsyncThunk<TUsersGetResponse>(
	'users/getAll',
	async () => await usersApi.getAll(),
)

export const getUserById = createAsyncThunk<TUserGetAlone, string>(
	'users/getById',
	async (id: string) => await usersApi.getById(id),
)

export const createUser = createAsyncThunk<
	TUserPostResponse,
	TUserCreateRequest
>('users/create', async (payload: TUserCreateRequest) => {
	return await usersApi.create(payload)
})

export const updateUser = createAsyncThunk<TUserPostResponse, TUpdateUserThunk>(
	'users/update',
	async (payload: TUpdateUserThunk) => {
		const { id, ...data } = payload
		return await usersApi.update(id, data)
	},
)

export const deleteUser = createAsyncThunk<boolean, string>(
	'users/delete',
	async (id: string) => {
		const res = await usersApi.delete(id)
		return res.data
	},
)
