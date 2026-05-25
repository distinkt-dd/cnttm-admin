import { selectedNewsNews } from '@entities/news'
import { AuthLayout } from '@pages/layouts'
import { useSelector } from '@shared/store'
import { Button } from '@shared/ui'
import { formatDate } from '@shared/utils/formatDate'
import { Link } from 'react-router-dom'

export const NewsPage = () => {
	const news = useSelector(selectedNewsNews)
	return (
		<AuthLayout>
			<div className='mb-auto flex flex-col gap-7'>
				<h1 className='text-5xl font-semibold'>Список новостей</h1>
				{!news ? (
					<p className='text-red-400'>Список новостей пуст!</p>
				) : (
					<>
						<div className='px-6 font-medium flex items-center justify-between'>
							<p className='text-olive-500'>Название новости</p>
							<p className='text-olive-500'>Дата публикации</p>
							<p className='text-olive-500'>Действия над новостью</p>
						</div>
						<ul>
							{news.map(item => (
								<li key={item.id}>
									<Link
										className='w-full py-4 px-6 border-2 border-blue-300 rounded-full hover:border-blue-500 transition-all flex items-center justify-between'
										to={`/news/${item.id}`}
									>
										<h2 className='font-semibold text-blue-500'>
											{item.title}
										</h2>
										<p className='font-semibold text-olive-400'>{`${formatDate(item.createdAt)} ${new Date().getFullYear()} года`}</p>
										<div className='flex items-center gap-4'>
											<Button
												text='Редактировать'
												type='Button'
												classNames={[
													'text-green-400 border-green-400 hover:bg-green-400 hover:text-white',
												]}
												typeForHtml='button'
											/>
											<Button
												text='Удалить'
												type='Button'
												classNames={[
													'text-red-400 border-red-400 hover:bg-red-400 hover:text-white',
												]}
												typeForHtml='button'
											/>
										</div>
									</Link>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</AuthLayout>
	)
}
