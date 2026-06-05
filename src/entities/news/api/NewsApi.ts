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
		return await this.apiService.fetchWithRefresh(() =>
			this.apiService.delete<boolean>(endpoint),
		)
	}

	async getOfPagination(params: TNewsPaginationParams) {
		const token = localStorage.getItem('accessToken') as string
		const response = await this.apiService.get<TNewsPaginationResponse>(
			'/pagination',
			{ ...params },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)
		return response
	}
}
