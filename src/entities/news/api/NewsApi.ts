import type { Api } from '@shared/api'
import type {
	TNewsPaginationParams,
	TNewsPaginationResponse,
	TNewsPostResponse,
	TNewsRequest,
} from '../types'

export class NewsApi {
	private readonly apiService: Api
	constructor(apiService: Api) {
		this.apiService = apiService
	}

	async create(data: TNewsRequest) {
		const token = localStorage.getItem('accessToken') as string
		return await this.apiService.post<TNewsPostResponse, TNewsRequest>(
			'',
			data,
			'POST',
			{
				headers: {
					Authorization: token,
				},
			},
		)
	}

	async delete(id: string) {
		const endpoint = `/${id}`
		const token = localStorage.getItem('accessToken') as string
		return await this.apiService.delete<boolean>(endpoint, {
			headers: {
				Authorization: token,
			},
		})
	}

	async getOfPagination(params: TNewsPaginationParams) {
		const token = localStorage.getItem('accessToken') as string
		const response = await this.apiService.get<TNewsPaginationResponse>(
			'/pagination',
			{ ...params },
			{
				headers: {
					Authorization: token,
				},
			},
		)
		return response
	}
}
