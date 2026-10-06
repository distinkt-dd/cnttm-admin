import { selectedAuthUser } from '@entities/auth'
import { useSelector } from '@shared/store'
import { Link } from 'react-router-dom'

export const Header = () => {
	const user = useSelector(selectedAuthUser)
	const isAdmin = user?.role === 'ADMIN'

	return (
		<header className='bg-olive-50 py-3 px-12 flex flex-row justify-between items-center'>
			<Link to='/'>
				<p className='font-bold text-lg hover:text-blue-400 transition-colors'>
					Управление сайтом ЦНТТМ
				</p>
			</Link>
			<div className='flex items-center gap-4'>
				{isAdmin && (
					<Link
						to='/users'
						className='px-3 py-2 border-2 rounded-full border-blue-400 text-sm font-medium hover:text-blue-400 transition-colors'
					>
						Пользователи
					</Link>
				)}
				{user ? (
					<Link
						to='/profile'
						className='max-w-12.5 py-2 px-2 border-blue-400 border-2 rounded-full'
					>
						<img src='/profile.svg' alt='Профиль' />
					</Link>
				) : (
					<p className='font-bold text-lg text-red-500'>
						Необходимо войти в аккаунт
					</p>
				)}
			</div>
		</header>
	)
}
