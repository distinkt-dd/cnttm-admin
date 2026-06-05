type TConfigItem = {
	id: number
	name: string
	to: string
}

export const homeMenuConfig: TConfigItem[] = [
	{
		id: 1,
		name: 'Управление новостями',
		to: '/news',
	},
]
