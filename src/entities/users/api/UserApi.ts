import type { Api } from '@shared/api'
import type {
	TUserCreateRequest,
	TUserDeleteResponse,
	TUserGetAlone,
	TUserPostResponse,
	TUserUpdateRequest,
	TUsersGetResponse,
} from '../types'

export class UsersApi {
	private readonly apiService: Api

	constructor(apiService: Api) {
		this.apiService = apiService
	}

	async getAll() {
		return await this.apiService.fetchWithRefresh(() =>
			this.apiService.get<TUsersGetResponse>(''),
		)
	}

	async getById(id: string) {
		return await this.apiService.fetchWithRefresh(() =>
			this.apiService.get<TUserGetAlone>(`/${id}`),
		)
	}

	async create(data: TUserCreateRequest) {
		return await this.apiService.fetchWithRefresh(() =>
			this.apiService.post<TUserPostResponse, TUserCreateRequest>('', data),
		)
	}

	async update(id: string, data: TUserUpdateRequest) {
		return await this.apiService.fetchWithRefresh(() =>
			this.apiService.patch<TUserPostResponse, TUserUpdateRequest>(
				`/${id}`,
				data,
			),
		)
	}

	async delete(id: string) {
		return await this.apiService.fetchWithRefresh(() =>
			this.apiService.delete<TUserDeleteResponse>(`/${id}`),
		)
	}
}
