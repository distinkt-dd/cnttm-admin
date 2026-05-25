import { selectedAuthUser } from '@entities/auth'
import { useSelector } from '@shared/store'
import { Link } from 'react-router-dom'

export const Header = () => {
	const user = useSelector(selectedAuthUser)

	return (
		<header className='bg-olive-50 py-3 px-12 flex flex-row justify-between items-center'>
			<Link to='/'>
				<p className='font-bold text-lg hover:text-blue-400 transition-colors'>
					Управление сайтом ЦНТТМ
				</p>
			</Link>
			{user ? (
				<Link
					to='/profile'
					className='max-w-[50px] py-2 px-2 border-blue-400 border-[2px] rounded-full'
				>
					<img src='/profile.svg' alt='Профиль' />
				</Link>
			) : (
				<p className='font-bold text-lg text-red-500'>
					Необходимо войти в аккаунт
				</p>
			)}
		</header>
	)
}
