import {
	deleteThunk,
	selectedNewsErrors,
	selectedNewsNews,
	setNews,
} from '@entities/news'
import { AuthLayout } from '@pages/layouts'
import { useDispatch, useSelector } from '@shared/store'
import { Button } from '@shared/ui'
import { formatDate } from '@shared/utils/formatDate'
import type { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export const NewsPage = () => {
	const navigate = useNavigate()
	const news = useSelector(selectedNewsNews)
	const errors = useSelector(selectedNewsErrors)
	const dispatch = useDispatch()
	const onChangeContent = (e: MouseEvent) => {
		e.stopPropagation()
		console.log('Редактирование новости...')
	}

	const onDeleteNews = async (e: MouseEvent, id: string, title: string) => {
		e.stopPropagation()
		const successAction = confirm(
			'Вы действительно хотите удалить новость с заголовком: ' + title,
		)

		if (!successAction) {
			return
		}

		try {
			await dispatch(deleteThunk(id))
			const newNews = news?.filter(item => item.id != id)
			if (newNews) {
				dispatch(setNews(newNews))
			}
			return alert(`Успешное удаление новости: ${title}`)
		} catch (err) {
			if (errors) {
				alert(errors)
			}
			alert(err)
		}
	}

	return (
		<AuthLayout>
			<div className='mb-auto flex flex-col gap-7'>
				<div className='flex justify-between items-center'>
					<h1 className='text-5xl font-semibold'>Список новостей</h1>
					<Button
						classNames={[
							'text-green-400 border-green-400 hover:bg-green-400 hover:text-white',
						]}
						type='Link'
						path='/news/create'
						typeForHtml='button'
						text='Создать новость'
					/>
				</div>

				{!news || news.length === 0 ? (
					<p className='text-red-400'>Список новостей пуст!</p>
				) : (
					<>
						<div className='px-6 font-medium flex items-center justify-between'>
							<p className='text-olive-500'>Название новости</p>
							<p className='text-olive-500'>Дата публикации</p>
							<p className='text-olive-500'>Действия над новостью</p>
						</div>

						<ul className='flex flex-col gap-2'>
							{news.map(item => (
								<li key={item.id}>
									<div
										className='w-full py-4 px-6 border-2 border-blue-300 rounded-full hover:border-blue-500 transition-all flex items-center justify-between cursor-pointer'
										onClick={() => navigate(`/news/${item.id}`)}
									>
										<h2 className='font-semibold text-blue-500'>
											{item.title}
										</h2>

										<p className='font-semibold text-olive-400'>
											{`${formatDate(item.createdAt)} ${new Date().getFullYear()} года`}
										</p>

										<div className='flex items-center gap-4'>
											<Button
												text='Редактировать'
												type='Button'
												typeForHtml='button'
												classNames={[
													'text-blue-400 hover:bg-blue-400 hover:text-white',
												]}
												onClick={onChangeContent}
											/>
											<Button
												text='Удалить'
												type='Button'
												typeForHtml='button'
												classNames={[
													'text-red-400 border-red-400 hover:bg-red-400 hover:text-white',
												]}
												onClick={(e: MouseEvent) =>
													onDeleteNews(e, item.id, item.title)
												}
											/>
										</div>
									</div>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		</AuthLayout>
	)
}
