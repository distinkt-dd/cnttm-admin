import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { LIMIT_NEWS } from '@shared/api/constants'
import type { TNews } from '../types'
import { deleteThunk, getOfPagination } from './actions'

type TInitialStateNewsSlice = {
	news: TNews[] | null
	newNews: TNews | null
	limit: number
	page: number
	totalPages: number | null
	total: number | null
	isResponse: boolean
	error: string
}

const initialState: TInitialStateNewsSlice = {
	news: null,
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
	},
	extraReducers: builder => {
		builder
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
} = newsSlice.selectors

export const { setNews } = newsSlice.actions
