import { createAsyncThunk } from '@reduxjs/toolkit'
import { Api } from '@shared/api'
import { NEWS_URI } from '@shared/api/constants'
import { NewsApi } from '../api'
import type {
	TNewsGetAlone,
	TNewsPaginationParams,
	TNewsPaginationResponse,
	TNewsPostResponse,
	TNewsRequest,
} from '../types'

const api = new Api(NEWS_URI)
const newsApi = new NewsApi(api)

export type TUpdateNewsRequest = TNewsRequest & { id: string }

export const create = createAsyncThunk<TNewsPostResponse, TNewsRequest>(
	'news/create',
	async (payload: TNewsRequest) => {
		return await newsApi.create(payload)
	},
)

export const updateNews = createAsyncThunk<
	TNewsPostResponse,
	TUpdateNewsRequest
>('news/update', async (payload: TUpdateNewsRequest) => {
	const { id, ...data } = payload
	return await newsApi.updateNews(id, data)
})

export const getNewsById = createAsyncThunk<TNewsGetAlone, string>(
	'news/getById',
	async (id: string) => {
		return await newsApi.getNewsById(id)
	},
)

export const uploadFiles = createAsyncThunk(
	'news/uploadFiles',
	async (payload: File[]) => {
		return await newsApi.uploadFiles(payload)
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
