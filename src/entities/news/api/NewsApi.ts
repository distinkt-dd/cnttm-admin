import type { Api } from '@shared/api'
import type {
	TNewsGetAlone,
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

	async uploadFiles(files: File[]) {
		const formData = new FormData()
		files.forEach(file => {
			formData.append('files', file)
		})
		return await this.apiService.fetchWithRefresh(() => {
			return this.apiService.post<any, FormData>(
				'',
				formData,
				'POST',
				{},
				'/file',
			)
		})
	}

	async create(data: TNewsRequest) {
		const token = localStorage.getItem('accessToken') as string
		return await this.apiService.fetchWithRefresh(() => {
			return this.apiService.post<TNewsPostResponse, TNewsRequest>(
				'',
				data,
				'POST',
				{
					headers: {
						Authorization: token,
					},
				},
			)
		})
	}

	async updateNews(id: string, data: TNewsRequest) {
		return await this.apiService.fetchWithRefresh(() => {
			return this.apiService.patch<TNewsPostResponse, TNewsRequest>(
				`/${id}`,
				data,
			)
		})
	}

	async getNewsById(id: string): Promise<TNewsGetAlone> {
		return await this.apiService.get<TNewsGetAlone>(`/${id}`)
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
