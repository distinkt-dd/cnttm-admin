type TServerResponse<T> = {
	success: boolean
} & T

export type TResponseWithData<T> = TServerResponse<{
	data: T
}>
