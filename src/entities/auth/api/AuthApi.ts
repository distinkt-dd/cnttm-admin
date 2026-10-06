import { Api } from '@shared/api'
import type {
	TAuthData,
	TAuthDataWithOutAccess,
	TAuthLoginRequest,
} from '../types'

export class AuthApi {
	private readonly apiService: Api
	constructor(apiService: Api) {
		this.apiService = apiService
	}

	async getUser() {
		const response = await this.apiService.fetchWithRefresh(() =>
			this.apiService.get<TAuthData | TAuthDataWithOutAccess>(
				'/user',
				undefined,
			),
		)
		const data = response.data
		if (data && 'accessToken' in data) {
			localStorage.setItem('accessToken', data.accessToken)
		}
		return response
	}

	async login(data: TAuthLoginRequest) {
		const response = await this.apiService.post<TAuthData, TAuthLoginRequest>(
			'/login',
			data,
		)
		const authData = response.data

		localStorage.setItem('accessToken', authData.accessToken)
		return response
	}

	async logout() {
		const response = await this.apiService.post<
			{ success: boolean },
			undefined
		>('/logout', undefined)
		localStorage.removeItem('accessToken')
		return response
	}
}
