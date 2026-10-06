import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { LIMIT_NEWS } from '@shared/api/constants'
import type { TNews } from '../types'
import {
	create,
	deleteThunk,
	getNewsById,
	getOfPagination,
	uploadFiles,
} from './actions'

type TInitialStateNewsSlice = {
	news: TNews[] | null
	newNews: TNews | null
	limit: number
	page: number
	totalPages: number | null
	total: number | null
	isResponse: boolean
	error: string
	currentNews: TNews | null
}

const initialState: TInitialStateNewsSlice = {
	news: null,
	currentNews: null,
	newNews: null,
	limit: LIMIT_NEWS,
	page: 1,
	totalPages: null,
	total: null,
	isResponse: false,
	error: '',
}

export const newsSlice = createSlice({
	name: 'news',
	initialState,
	reducers: {
		setNews: (state, action: PayloadAction<TNews[]>) => {
			state.news = action.payload
			state.total = state.news?.length as number
			state.totalPages = Math.ceil(state.total / state.limit)
		},
	},
	selectors: {
		selectedNewsNews: state => state.news,
		selectedNewsNewNews: state => state.newNews,
		selectedNewsLimit: state => state.limit,
		selectedNewsPage: state => state.page,
		selectedNewsTotalPages: state => state.totalPages,
		selectedNewsTotal: state => state.total,
		selectedNewsIsResponse: state => state.isResponse,
		selectedNewsErrors: state => state.error,
		selectedNewsCurrent: state => state.currentNews,
	},
	extraReducers: builder => {
		builder
			.addCase(create.fulfilled, (state, action) => {
				state.error = ''
				state.isResponse = false
				state.news?.push(action.payload.data)
				state.total = state.news?.length as number
				state.totalPages = Math.ceil(state.total / state.limit)
			})
			.addCase(create.rejected, (state, action) => {
				state.error = action.error.message as string
				state.isResponse = false
			})
			.addCase(create.pending, state => {
				state.isResponse = false
				state.error = ''
			})

			.addCase(getNewsById.fulfilled, (state, action) => {
				state.error = ''
				state.isResponse = false
				state.currentNews = action.payload.data
			})

			.addCase(getNewsById.pending, state => {
				state.error = ''
				state.isResponse = true
			})

			.addCase(getNewsById.rejected, (state, action) => {
				state.error = action.error.message as string
				state.isResponse = false
			})

			.addCase(getOfPagination.fulfilled, (state, action) => {
				state.news = action.payload.data
				state.limit = action.payload.limit
				state.page = action.payload.page
				state.total = action.payload.total
				state.totalPages = action.payload.totalPages
				state.isResponse = false
			})
			.addCase(getOfPagination.rejected, (state, action) => {
				state.isResponse = false
				state.error = action.error.message as string
			})
			.addCase(getOfPagination.pending, state => {
				state.isResponse = true
				state.error = ''
			})
			.addCase(deleteThunk.pending, state => {
				state.isResponse = true
				state.error = ''
			})
			.addCase(deleteThunk.fulfilled, state => {
				state.isResponse = false
				state.error = ''
			})
			.addCase(deleteThunk.rejected, (state, action) => {
				state.isResponse = false
				state.error = action.error.message as string
			})
			.addCase(uploadFiles.fulfilled, state => {
				state.error = ''
				state.isResponse = false
			})
			.addCase(uploadFiles.rejected, (state, action) => {
				state.error = action.error.message as string
				state.isResponse = false
			})
			.addCase(uploadFiles.pending, state => {
				state.isResponse = true
				state.error = ''
			})
	},
})

export const {
	selectedNewsIsResponse,
	selectedNewsLimit,
	selectedNewsNewNews,
	selectedNewsNews,
	selectedNewsPage,
	selectedNewsTotal,
	selectedNewsTotalPages,
	selectedNewsErrors,
	selectedNewsCurrent,
} = newsSlice.selectors

export const { setNews } = newsSlice.actions
