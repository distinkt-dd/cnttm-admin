import { type NavigateFunction } from 'react-router-dom'

interface IParams {
	path: string
	navigate: NavigateFunction
}

export const locationWithPath = ({ path, navigate }: IParams) => {
	if (!path.startsWith('/')) {
		throw new Error('Ошибка, путь не корректен')
	}

	if (!path) {
		throw new Error('Ошибка, путь не передан!')
	}

	navigate(path)
}
