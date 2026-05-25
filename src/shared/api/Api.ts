type ApiPostMethods = 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export class Api {
	readonly baseUrl: string = import.meta.env.VITE_CNTTM_API_URL
	readonly uri: string
	protected options: RequestInit

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

	protected checkResponse = async <T>(res: Response): Promise<T> =>
		res.ok ? res.json() : res.json().then(err => Promise.reject(err))

	get<T extends object>(
		localUri: string,
		params?: Record<string, string | number>,
		options?: RequestInit,
	): Promise<T> {
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
		}).then(this.checkResponse<T>)
	}

	post<T extends object, K>(
		localUri: string,
		data: K,
		method: ApiPostMethods = 'POST',
		options?: RequestInit,
	): Promise<T> {
		return fetch(this.baseUrl + this.uri + localUri, {
			...this.mergeOptions(options),
			method,
			credentials: 'include',
			body: JSON.stringify(data),
		}).then(this.checkResponse<T>)
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
		return fetch(this.baseUrl + uri, {
			...this.mergeOptions(options),
			method: 'DELETE',
		}).then(this.checkResponse<T>)
	}
}
