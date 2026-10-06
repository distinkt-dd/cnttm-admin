import { type TAuthAccessOnly } from '@entities/auth'

type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export class Api {
	readonly baseUrl: string = import.meta.env.VITE_CNTTM_API_URL
	readonly uri: string
	protected options: RequestInit
	private isRefreshing = false
	private refreshQueue: ((token: string) => void)[] = []

	constructor(uri: string, options: RequestInit = {}) {
		this.uri = uri
		this.options = {
			headers: {
				'Content-Type': 'application/json',
				...((options.headers as object) ?? {}),
			},
		}
	}

	private mergeOptions(customOptions?: RequestInit): RequestInit {
		return {
			...this.options,
			...customOptions,
			headers: {
				...this.options.headers,
				...customOptions?.headers,
			},
		}
	}

	async refresh() {
		const response = await this.post<TAuthAccessOnly, undefined>(
			'/refresh',
			undefined,
			'POST',
			{},
			'/auth',
		)
		const authData = response.data
		localStorage.setItem('accessToken', authData.accessToken)

		return response
	}

	async fetchWithRefresh<T>(apiCall: () => Promise<T>): Promise<T> {
		try {
			return await apiCall()
		} catch (err: any) {
			if (err.statusCode === 401) {
				if (this.isRefreshing) {
					return new Promise((resolve, reject) => {
						this.refreshQueue.push((newToken: string) => {
							resolve(apiCall())
						})
					})
				}
				this.isRefreshing = true

				try {
					const response = await this.refresh()
					const newToken = response.data.accessToken

					this.isRefreshing = false
					this.refreshQueue.forEach(callback => callback(newToken))
					this.refreshQueue = []
					return await apiCall()
				} catch (refreshErr) {
					console.log('error')
					this.isRefreshing = false
					this.refreshQueue = []
					localStorage.removeItem('accessToken')
					return Promise.reject(refreshErr)
				}
			}
			return Promise.reject(err)
		}
	}

	protected checkResponse = async <T>(res: Response): Promise<T> => {
		if (res.ok) {
			return res.json()
		}
		const errorData = await res.json().catch(() => ({}))

		const error: any = new Error(errorData.message || 'API Error')
		error.statusCode = res.status
		error.data = errorData
		return Promise.reject(error)
	}

	get<T extends object>(
		localUri: string,
		params?: Record<string, string | number>,
		options?: RequestInit,
	): Promise<T> {
		const token = localStorage.getItem('accessToken')
		const queryString = params
			? '?' +
				new URLSearchParams(
					Object.fromEntries(
						Object.entries(params).map(([k, v]) => [k, String(v)]),
					),
				).toString()
			: ''

		return fetch(this.baseUrl + this.uri + localUri + queryString, {
			...this.mergeOptions(options),
			credentials: 'include',
			method: 'GET',
			headers: {
				...this.mergeOptions(options).headers,
				Authorization: `Bearer ${token}`,
			},
		}).then(this.checkResponse<T>)
	}

	post<T extends object, K>(
		localUri: string,
		data: K,
		method: ApiPostMethods = 'POST',
		options?: RequestInit,
		yourLink?: string,
	): Promise<T> {
		const token = localStorage.getItem('accessToken')

		const isFormData = data instanceof FormData
		const body = isFormData ? data : JSON.stringify(data)

		const mergedOptions = this.mergeOptions(options)
		const headers = { ...mergedOptions.headers } as Record<string, string>

		if (isFormData) {
			delete headers['Content-Type']
		}

		return fetch(
			yourLink
				? this.baseUrl + yourLink + localUri
				: this.baseUrl + this.uri + localUri,
			{
				...mergedOptions,
				method,
				credentials: 'include',
				body, // Используем обработанный body
				headers: {
					...headers,
					Authorization: `Bearer ${token}`,
				},
			},
		).then(this.checkResponse<T>) // Теперь ошибки 400 будут лететь в catch!
	}

	put<T extends object, K>(
		uri: string,
		data: K,
		options?: RequestInit,
	): Promise<T> {
		return this.post(uri, data, 'PUT', options)
	}

	patch<T extends object, K>(
		uri: string,
		data: K,
		options?: RequestInit,
	): Promise<T> {
		return this.post(uri, data, 'PATCH', options)
	}

	delete<T>(uri: string, options?: RequestInit): Promise<T> {
		const token = localStorage.getItem('accessToken')
		return fetch(this.baseUrl + this.uri + uri, {
			...this.mergeOptions(options),
			method: 'DELETE',
			credentials: 'include',
			headers: {
				...this.mergeOptions(options).headers,
				Authorization: `Bearer ${token}`,
			},
		}).then(this.checkResponse<T>)
	}
}
