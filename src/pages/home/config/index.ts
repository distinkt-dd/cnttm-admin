import type { TUserRole } from '@entities/auth'

type TConfigItem = {
	id: number
	name: string
	to: string
	roles?: TUserRole[]
}

export const homeMenuConfig: TConfigItem[] = [
	{
		id: 1,
		name: 'Управление новостями',
		to: '/news',
	},
	{
		id: 2,
		name: 'Управление пользователями',
		to: '/users',
		roles: ['ADMIN'],
	},
]

export const getMenuForRole = (role?: TUserRole) =>
	homeMenuConfig.filter(
		item => !item.roles || (role && item.roles.includes(role)),
	)
