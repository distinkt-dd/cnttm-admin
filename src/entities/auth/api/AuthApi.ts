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
		const token = localStorage.getItem('accessToken') as string
		const response = await this.apiService.get<TAuthDataWithOutAccess>(
			'/user',
			undefined,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)
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
}
