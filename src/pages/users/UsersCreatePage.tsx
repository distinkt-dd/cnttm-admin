import { createUser, selectedUsersError, type TUserRole } from '@entities/users'
import { AuthLayout } from '@pages/layouts'
import { useDispatch, useSelector } from '@shared/store'
import { Button, Input } from '@shared/ui'
import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

type TForm = {
	name: string
	login: string
	password: string
	role: TUserRole
}

const initialState: TForm = {
	name: '',
	login: '',
	password: '',
	role: 'USER',
}

const classNames = [
	'px-3 py-2 border-2 rounded-full border-blue-400 max-w-[500px]',
]

export const UsersCreatePage = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const error = useSelector(selectedUsersError)
	const [formData, setFormData] = useState<TForm>(initialState)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		try {
			await dispatch(createUser(formData)).unwrap()
			alert('Пользователь создан')
			navigate('/users')
		} catch (err: any) {
			alert(`Ошибка: ${err.message ?? 'Не удалось создать'}`)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<AuthLayout>
			<div className='mb-auto flex flex-col gap-7'>
				<div className='flex justify-between items-center'>
					<h1 className='text-5xl font-semibold'>Создание пользователя</h1>
					<Button
						type='Link'
						path='/users'
						typeForHtml='button'
						text='Обратно к списку'
						classNames={[
							'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
						]}
					/>
				</div>

				<form onSubmit={handleSubmit} className='flex flex-col gap-5 max-w-125'>
					<Input
						id='name'
						name='name'
						type='text'
						required
						label='Имя'
						placeholder='Иван Иванов'
						value={formData.name}
						onChange={handleChange}
						classNames={classNames}
					/>
					<Input
						id='login'
						name='login'
						type='text'
						required
						label='Логин'
						placeholder='ivan'
						value={formData.login}
						onChange={handleChange}
						classNames={classNames}
					/>
					<Input
						id='password'
						name='password'
						type='password'
						required
						label='Пароль'
						placeholder='Минимум 6 символов'
						value={formData.password}
						onChange={handleChange}
						classNames={classNames}
					/>
					<div className='flex flex-col gap-3'>
						<label htmlFor='role'>Роль</label>
						<select
							id='role'
							name='role'
							value={formData.role}
							onChange={handleChange}
							className='px-3 py-2 border-2 rounded-full border-blue-400 max-w-125 bg-white'
						>
							<option value='USER'>Пользователь</option>
							<option value='ADMIN'>Администратор</option>
							<option value='SUPERUSER'>Суперпользователь</option>
						</select>
					</div>

					<Button
						type='Button'
						typeForHtml='submit'
						text={isSubmitting ? 'Создание...' : 'Создать'}
						disabled={isSubmitting}
						classNames={[
							'text-green-400 border-green-400 hover:bg-green-400 hover:text-white max-w-[250px]',
						]}
					/>
				</form>
				{error && <p className='text-red-500'>Ошибка: {error}</p>}
			</div>
		</AuthLayout>
	)
}
