import {
	deleteUser,
	getUsers,
	selectedUsers,
	selectedUsersError,
} from '@entities/users'
import { AuthLayout } from '@pages/layouts'
import { useDispatch, useSelector } from '@shared/store'
import { Button } from '@shared/ui'
import { formatDate } from '@shared/utils/formatDate'
import { useEffect, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

const ROLE_LABELS: Record<string, string> = {
	USER: 'Пользователь',
	ADMIN: 'Администратор',
}

export const UsersPage = () => {
	const navigate = useNavigate()
	const users = useSelector(selectedUsers)
	const error = useSelector(selectedUsersError)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getUsers())
	}, [dispatch])

	const onDelete = async (e: MouseEvent, id: string, login: string) => {
		e.stopPropagation()
		if (!confirm(`Удалить пользователя "${login}"?`)) return
		try {
			await dispatch(deleteUser(id)).unwrap()
			alert(`Пользователь ${login} удалён`)
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Ошибка удаления')
		}
	}

	return (
		<AuthLayout>
			<div className='mb-auto flex flex-col gap-7'>
				<div className='flex justify-between items-center'>
					<h1 className='text-5xl font-semibold'>Пользователи</h1>
					<Button
						classNames={[
							'text-green-400 border-green-400 hover:bg-green-400 hover:text-white',
						]}
						type='Link'
						path='/users/create'
						typeForHtml='button'
						text='Создать пользователя'
					/>
				</div>

				{!users || users.length === 0 ? (
					<p className='text-red-400'>Список пользователей пуст!</p>
				) : (
					<>
						<div className='px-6 font-medium flex items-center justify-between gap-4'>
							<p className='text-olive-500 flex-1'>Имя</p>
							<p className='text-olive-500 flex-1'>Логин</p>
							<p className='text-olive-500 flex-1'>Роль</p>
							<p className='text-olive-500 flex-1'>Создан</p>
							<p className='text-olive-500'>Действия</p>
						</div>

						<ul className='flex flex-col gap-2'>
							{users.map(u => (
								<li key={u.id}>
									<div className='w-full py-4 px-6 border-2 border-blue-300 rounded-3xl hover:border-blue-500 transition-all flex items-center justify-between gap-4'>
										<h2 className='font-semibold text-blue-500 flex-1'>
											{u.name}
										</h2>
										<p className='text-olive-500 flex-1'>{u.login}</p>
										<p className='font-medium flex-1'>
											{ROLE_LABELS[u.role] ?? u.role}
										</p>
										<p className='text-olive-400 flex-1'>
											{'createdAt' in u && (u as any).createdAt
												? formatDate((u as any).createdAt)
												: '—'}
										</p>
										<div className='flex items-center gap-3'>
											<Button
												text='Редактировать'
												type='Button'
												typeForHtml='button'
												classNames={[
													'border-green-400 text-green-400 hover:bg-green-400 hover:text-white',
												]}
												onClick={() => navigate(`/users/update/${u.id}`)}
											/>
											<Button
												text='Удалить'
												type='Button'
												typeForHtml='button'
												classNames={[
													'text-red-400 border-red-400 hover:bg-red-400 hover:text-white',
												]}
												onClick={(e: MouseEvent) => onDelete(e, u.id, u.login)}
											/>
										</div>
									</div>
								</li>
							))}
						</ul>
					</>
				)}
				{error && <p className='text-red-500'>Ошибка: {error}</p>}
			</div>
		</AuthLayout>
	)
}
