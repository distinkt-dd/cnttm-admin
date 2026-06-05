import type { TResponseWithData } from '@shared/api'

export type TUser = {
	id: string
	name: string
	login: string
}

export type TAuthData = TResponseWithData<{
	user: TUser
	accessToken: string
}>

export type TAuthAccessOnly = TResponseWithData<{
	accessToken: string
}>

export type TAuthLoginRequest = {
	login: string
	password: string
}

export type TAuthDataWithOutAccess = TResponseWithData<{
	user: TUser
}>
