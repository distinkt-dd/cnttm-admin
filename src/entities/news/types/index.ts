import type { TResponseWithData } from '@shared/api'

type TNewsContentOptions = {
	text?: string
	urls?: string[]
	listItems?: string[]
	url?: string
}

export type TNewsContent = {
	type: 'PARAGRAPH' | 'IMAGES' | 'VIDEOS' | 'DOCS' | 'LINKS' | 'LISTS'
	onStep: number
	options: TNewsContentOptions
}

export type TNews = {
	id: string
	title: string
	datePost: string
	content: TNewsContent[]
	createdAt: string
	updatedAt: string
}

export type TNewsCreate = Pick<TNews, 'title' | 'content'>

export type TNewsPaginationParams = {
	page?: number
	limit?: number
}

export type TNewsPaginationInfo = {
	total: number
	page: number
	limit: number
	totalPages: number
}

export type TNewsRequest = {
	title: string
	content: TNewsContent[]
}

export type TNewsPaginationResponse = {
	data: TNews[]
} & TNewsPaginationInfo

export type TNewsGetResponse = TResponseWithData<TNews[]>
export type TNewsGetAlone = TResponseWithData<TNews>
export type TNewsPostResponse = TResponseWithData<TNews>
