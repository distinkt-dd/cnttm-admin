import type { TNewsContent, TNewsCreate } from '@entities/news'
import { AuthLayout } from '@pages/layouts'
import { Button, Input } from '@shared/ui'
import { useState, type ChangeEvent } from 'react'

const initialState: TNewsCreate = {
	title: '',
	content: [],
}

export const NewsCreatePage = () => {
	const [formData, setFormData] = useState<TNewsCreate>(initialState)
	const [editingIdx, setEditingIdx] = useState<number | null>(null)

	const classNames = [
		'px-3 py-2 border-2 rounded-full border-blue-400 max-w-[500px]',
	]

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({
			...prev,
			[name]: value,
		}))
	}

	const addingContent = (type: 'PARAGRAPH' | 'IMAGES' | 'VIDEOS' | 'DOCS') => {
		const newContent: TNewsContent = {
			type,
			onStep: formData.content.length + 1,
			options: { text: '' },
		}

		setFormData(prev => ({
			...prev,
			content: [...prev.content, newContent],
		}))
		setEditingIdx(formData.content.length)
	}

	const handleContentTextChange = (idx: number, value: string) => {
		setFormData(prev => ({
			...prev,
			content: prev.content.map((item, index) =>
				index === idx
					? { ...item, options: { ...item.options, text: value } }
					: item,
			),
		}))
		setEditingIdx(idx)
	}

	const handleDeleteContent = (idx: number) => {
		setFormData(prev => ({
			...prev,
			content: prev.content.filter((_, i) => i !== idx),
		}))
		if (editingIdx === idx) {
			setEditingIdx(null)
		}
	}

	const handleSaveContent = () => {
		setEditingIdx(null)
	}

	return (
		<AuthLayout>
			<div className='mb-auto flex flex-col gap-10'>
				<div className='flex justify-between items-center'>
					<h1 className='text-5xl font-semibold'>Создание новости</h1>
					<Button
						classNames={[
							'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
						]}
						type='Link'
						path='/news'
						typeForHtml='button'
						text='Обратно к списку новостей'
					/>
				</div>
				<form action='' className='flex flex-col gap-7'>
					<Input
						name='title'
						type='text'
						required
						id='title'
						label='Заголовок новости'
						value={formData.title}
						onChange={handleChange}
						placeholder='Введите заголовок новости'
						classNames={classNames}
					/>
					<h2 className='font-semibold text-2xl'>
						Добавление контента к новости
					</h2>
					<div className='flex flex-col gap-4'>
						{formData.content.length === 0 ? (
							<p>Контента для новости нет!</p>
						) : (
							formData.content.map((item, idx) => (
								<div
									key={idx}
									className='flex flex-col gap-2 p-4 border rounded-lg'
								>
									<span className='text-sm font-medium text-gray-500'>
										Шаг {item.onStep}: {item.type}
									</span>
									{item.type === 'PARAGRAPH' && (
										<Input
											id={`content-p-${idx}`}
											type='text'
											required
											name={`p-${idx}`}
											value={(item.options.text as string) || ''}
											onChange={e =>
												handleContentTextChange(idx, e.target.value)
											}
											placeholder='Введите текст параграфа...'
											classNames={classNames}
										/>
									)}
									{item.type !== 'PARAGRAPH' && (
										<p>Настройка для {item.type} еще не реализована</p>
									)}

									<div className='flex items-center gap-3'>
										<Button
											text='Удалить'
											type='Button'
											typeForHtml='button'
											classNames={['text-red-400 text-xs w-fit']}
											onClick={() => handleDeleteContent(idx)}
										/>
										{editingIdx === idx ? (
											<Button
												text='Сохранить'
												type='Button'
												typeForHtml='button'
												classNames={['text-green-400 text-xs w-fit']}
												onClick={() => handleSaveContent()}
											/>
										) : null}
									</div>
								</div>
							))
						)}
					</div>
					<div className='flex items-center gap-7 p-10 border-2 rounded-2xl border-olive-300 max-w-fit w-full'>
						<Button
							classNames={[
								'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
							]}
							disabled={editingIdx !== null}
							type='Button'
							typeForHtml='button'
							text='Добавить параграф'
							onClick={() => addingContent('PARAGRAPH')}
						/>
						<Button
							classNames={[
								'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
							]}
							disabled={editingIdx !== null}
							type='Button'
							typeForHtml='button'
							text='Добавить фотографии'
						/>
						<Button
							classNames={[
								'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
							]}
							disabled={editingIdx !== null}
							type='Button'
							typeForHtml='button'
							text='Добавить видео'
						/>
						<Button
							classNames={[
								'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
							]}
							disabled={editingIdx !== null}
							type='Button'
							typeForHtml='button'
							text='Добавить документы'
						/>
					</div>
					{editingIdx !== null ? (
						<p className='text-red-400'>
							Чтобы добавить новый контент, завершите заполнение текущего или
							удалите его!
						</p>
					) : null}
					<Button
						classNames={[
							'text-green-400 border-green-400 hover:bg-green-400 hover:text-white max-w-[300px]',
						]}
						type='Button'
						typeForHtml='submit'
						text='Создать новость'
						disabled={
							!(formData.title.length > 0 && formData.content.length > 0)
						}
					/>
				</form>

				<p className='text-olive-500 max-w-[300px]'>
					Внимание: контент на странице новости, будет идти в том порядке, в
					котором вы его добавили*
				</p>
			</div>
		</AuthLayout>
	)
}
