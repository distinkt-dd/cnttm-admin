import type { TUser, TUserRole } from '@entities/auth'
import type { TResponseWithData } from '@shared/api'

export type { TUser, TUserRole }

export type TUserCreateRequest = {
	name: string
	login: string
	password: string
	role?: TUserRole
}

export type TUserUpdateRequest = {
	name?: string
	login?: string
	password?: string
	role?: TUserRole
}

export type TUsersGetResponse = TResponseWithData<TUser[]>
export type TUserGetAlone = TResponseWithData<TUser>
export type TUserPostResponse = TResponseWithData<TUser>
export type TUserDeleteResponse = TResponseWithData<boolean>
