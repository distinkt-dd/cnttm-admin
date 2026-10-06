import {
	login,
	selectedAuthError,
	type TAuthLoginRequest,
} from '@entities/auth'
import { UnAuthLayout } from '@pages'
import { useDispatch } from '@shared/store'
import { Button, Input } from '@shared/ui'
import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import { useSelector } from 'react-redux'

const initialState: TAuthLoginRequest = {
	login: '',
	password: '',
}

export const LoginPage = () => {
	const dispatch = useDispatch()
	const error = useSelector(selectedAuthError)

	const [loginFormData, setFormData] = useState<TAuthLoginRequest>(initialState)

	const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault()
		dispatch(login(loginFormData))
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target

		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	return (
		<>
			<UnAuthLayout>
				<div className='flex justify-center'>
					<div className='max-w-[400px] w-full flex flex-col gap-3 p-4 border-2 border-blue-50 rounded-2xl'>
						<h2 className='font-semibold text-3xl text-blue-400'>
							Форма входа
						</h2>
						<form
							action=''
							onSubmit={handleSubmit}
							className='flex flex-col gap-3'
						>
							<Input
								name='login'
								onChange={handleChange}
								id='login'
								type='text'
								required
								label='Введите логин'
								value={loginFormData.login}
								placeholder='Логин'
								classNames={['px-3 py-2 border-2 rounded-full border-blue-400']}
							/>
							<Input
								name='password'
								onChange={handleChange}
								id='password'
								type='password'
								required
								label='Введите пароль'
								value={loginFormData.password}
								placeholder='Пароль'
								classNames={['px-3 py-2 border-2 rounded-full border-blue-400']}
							/>
							<Button type='Button' text='Войти' typeForHtml='submit' />
						</form>
						{error ? <p className='text-red-400'>{error}</p> : ''}
					</div>
				</div>
			</UnAuthLayout>
		</>
	)
}
