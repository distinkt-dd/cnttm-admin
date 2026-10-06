import { logout, selectedAuthUser } from '@entities/auth';
import { AuthLayout } from '@pages/layouts';
import { useDispatch, useSelector } from '@shared/store';
import { Button } from '@shared/ui';
import { useNavigate } from 'react-router-dom';

const ROLE_LABELS: Record<string, string> = {
	USER: 'Пользователь',
	ADMIN: 'Администратор',
}

export const ProfilePage = () => {
	const user = useSelector(selectedAuthUser)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const handleLogout = async () => {
		await dispatch(logout())
		navigate('/login')
	}

	if (!user) return null

	return (
		<AuthLayout>
			<div className='mb-auto flex flex-col gap-7 max-w-150'>
				<h1 className='text-5xl font-semibold'>Профиль</h1>

				<div className='flex flex-col gap-3 p-6 border-2 border-blue-300 rounded-3xl'>
					<div className='flex justify-between'>
						<span className='text-olive-500'>Имя</span>
						<span className='font-medium'>{user.name}</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-olive-500'>Логин</span>
						<span className='font-medium'>{user.login}</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-olive-500'>Роль</span>
						<span className='font-medium'>
							{ROLE_LABELS[user.role] ?? user.role}
						</span>
					</div>
				</div>

				<Button
					type='Button'
					typeForHtml='button'
					text='Выйти из аккаунта'
					onClick={handleLogout}
					classNames={[
						'text-red-400 border-red-400 hover:bg-red-400 hover:text-white max-w-[250px]',
					]}
				/>
			</div>
		</AuthLayout>
	)
}