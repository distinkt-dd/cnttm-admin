import { selectedAuthUser } from '@entities/auth'
import { AuthLayout, UnAuthLayout } from '@pages'
import { useSelector } from '@shared/store'
import { Button } from '@shared/ui'
import { homeMenuConfig } from '../config'

export const Home = () => {
	const user = useSelector(selectedAuthUser)
	return user ? (
		<AuthLayout>
			<div className='container flex items-center justify-between grow min-w-full'>
				<div className='flex flex-col gap-3'>
					<h1 className='text-7xl font-semibold text-blue-400'>
						Добро пожаловать!
					</h1>
					<p className='text-2xl'>Вы в центре управления сайтом ЦНТТМ</p>
					<p>Справа в меню выберите то, что хотите добавить на сайт!</p>
				</div>
				<div className='flex flex-col text-4xl min-h-full font-semibold text-blue-400 mb-auto gap-3'>
					<h2>Меню действий</h2>
					<ul className='flex flex-col gap-3'>
						{homeMenuConfig.map(item => {
							return (
								<li>
									<Button
										type='Link'
										key={item.name}
										path={item.to}
										typeForHtml='button'
										text={item.name}
										classNames={[
											'w-full hover:bg-blue-400 hover:text-white transition-all',
										]}
									/>
								</li>
							)
						})}
					</ul>
				</div>
			</div>
		</AuthLayout>
	) : (
		<UnAuthLayout>
			<div className='container flex flex-col justify-center gap-3'>
				<h1 className='text-7xl font-semibold text-blue-400'>
					Добро пожаловать!
				</h1>
				<p className='text-2xl'>Вы в центре управления сайтом ЦНТТМ</p>
				<p>Необходимо авторизоваться</p>
				<div className='max-w-[150px] w-full'>
					<Button
						typeForHtml='button'
						classNames={['w-full']}
						text='Войти'
						type='Link'
						path='/login'
					/>
				</div>
			</div>
		</UnAuthLayout>
	)
}
