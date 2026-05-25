import { createAsyncThunk } from '@reduxjs/toolkit'
import { Api } from '@shared/api'
import { NEWS_URI } from '@shared/api/constants'
import { NewsApi } from '../api'
import type {
	TNewsPaginationParams,
	TNewsPaginationResponse,
	TNewsPostResponse,
	TNewsRequest,
} from '../types'

const api = new Api(NEWS_URI)
const newsApi = new NewsApi(api)

export const create = createAsyncThunk<TNewsPostResponse, TNewsRequest>(
	'news/create',
	async (payload: TNewsRequest) => {
		return await newsApi.create(payload)
	},
)

export const getOfPagination = createAsyncThunk<
	TNewsPaginationResponse,
	TNewsPaginationParams
>('news/getOfPagination', async (payload: TNewsPaginationParams) => {
	return await newsApi.getOfPagination(payload)
})

export const deleteThunk = createAsyncThunk<boolean, string>(
	'news/delete',
	async (id: string) => {
		return await newsApi.delete(id)
	},
)
