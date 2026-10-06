import {
	create,
	selectedNewsErrors,
	uploadFiles,
	type TNewsContent,
	type TNewsRequest,
} from '@entities/news'
import { AuthLayout } from '@pages/layouts'
import { useDispatch, useSelector } from '@shared/store'
import { Button, Input } from '@shared/ui'
import { useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

// 1. Создаем расширенный тип для внутреннего использования в форме
type TInternalNewsContent = TNewsContent & { id: string }

// 2. Создаем тип для состояния формы, где контент имеет ID
type TNewsFormState = {
	title: string
	content: TInternalNewsContent[]
}

type TAttachedFile = {
	contentId: string
	file: File
}

const initialState: TNewsFormState = {
	title: '',
	content: [],
}

export const NewsCreatePage = () => {
	const dispatch = useDispatch()
	const error = useSelector(selectedNewsErrors)
	const navigation = useNavigate()

	// Используем наш локальный тип состояния формы
	const [formData, setFormData] = useState<TNewsFormState>(initialState)
	const [editingIdx, setEditingIdx] = useState<number | null>(null)
	const [attachedFiles, setAttachedFiles] = useState<TAttachedFile[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)

	const classNames = [
		'px-3 py-2 border-2 rounded-full border-blue-400 max-w-[500px]',
	]

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const addingContent = (
		type: 'PARAGRAPH' | 'IMAGES' | 'VIDEOS' | 'DOCS' | 'LINKS' | 'LISTS',
	) => {
		const contentId = crypto.randomUUID()
		const newContent: TInternalNewsContent = {
			id: contentId,
			type,
			onStep: formData.content.length + 1,
			options: { text: '' },
		}
		setFormData(prev => ({ ...prev, content: [...prev.content, newContent] }))
		setEditingIdx(formData.content.length)
	}

	const handleContentListChange = (idx: number, value: string) => {
		const list = value.split('\n')

		setFormData(prev => ({
			...prev,
			content: prev.content.map((item, index) =>
				index === idx
					? { ...item, options: { ...item.options, listItems: list } }
					: item,
			),
		}))
		setEditingIdx(idx)
	}

	const moveContent = (idx: number, direction: 'up' | 'down') => {
		if (editingIdx !== null) {
			return false
		}

		const newContent = [...formData.content]
		const targetIdx = direction === 'up' ? idx - 1 : idx + 1

		if (targetIdx < 0 || targetIdx >= newContent.length) return
		;[newContent[idx], newContent[targetIdx]] = [
			newContent[targetIdx],
			newContent[idx],
		]

		const updatedContent = newContent.map((item, index) => ({
			...item,
			onStep: index + 1,
		}))

		setFormData(prev => ({ ...prev, content: updatedContent }))
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

	const handleContentFileChange = (
		idx: number,
		e: ChangeEvent<HTMLInputElement>,
	) => {
		const files = e.target.files
		if (!files) return

		const contentId = formData.content[idx].id // Теперь TS знает, что id существует

		const newFilesForStep: TAttachedFile[] = Array.from(files).map(file => ({
			contentId: contentId,
			file: file,
		}))

		const fileNames = newFilesForStep.map(item => item.file.name).join(', ')

		setFormData(prev => ({
			...prev,
			content: prev.content.map((item, index) =>
				index === idx
					? { ...item, options: { ...item.options, text: fileNames } }
					: item,
			),
		}))

		setAttachedFiles(prev => {
			const filteredFiles = prev.filter(f => f.contentId !== contentId)
			return [...filteredFiles, ...newFilesForStep]
		})
		setEditingIdx(idx)
	}

	const handleDeleteContent = (idx: number) => {
		const contentId = formData.content[idx].id
		setAttachedFiles(prev => prev.filter(f => f.contentId !== contentId))

		setFormData(prev => ({
			...prev,
			content: prev.content.filter((_, i) => i !== idx),
		}))
		if (editingIdx === idx) setEditingIdx(null)
	}

	const handleSaveContent = () => setEditingIdx(null)
	const handleContentUrlChange = (idx: number, value: string) => {
		setFormData(prev => ({
			...prev,
			content: prev.content.map((item, index) =>
				index === idx
					? { ...item, options: { ...item.options, url: value } }
					: item,
			),
		}))
		setEditingIdx(idx)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			// Типизируем как внутренний контент
			let finalContent: TInternalNewsContent[] = [...formData.content]

			if (attachedFiles.length > 0) {
				const filesToUpload = attachedFiles.map(f => f.file)
				const uploadResponse = await dispatch(
					uploadFiles(filesToUpload),
				).unwrap()

				uploadResponse.forEach((fileInfo: any, index: number) => {
					const contentIdOfFile = attachedFiles[index].contentId

					finalContent = finalContent.map(item => {
						if (item.id === contentIdOfFile) {
							return {
								...item,
								options: {
									...item.options,
									urls: [...(item.options.urls || []), fileInfo.path],
								},
							}
						}
						return item
					})
				})
			}

			const cleanedContent = finalContent.map(({ id, ...rest }) => {
				if (rest.type === 'LISTS' && rest.options.listItems) {
					return {
						...rest,
						options: {
							...rest.options,
							listItems: rest.options.listItems.filter(
								item => item.trim() !== '',
							),
						},
					}
				}
				return rest
			})

			const finalRequest: TNewsRequest = {
				title: formData.title,
				content: cleanedContent,
			}

			await dispatch(create(finalRequest)).unwrap()
			alert('Новость успешно создана!')
			navigation('/news')
		} catch (error: any) {
			console.error('Ошибка при создании новости:', error)
			alert(`Ошибка: ${error.message || 'Не удалось создать новость'}`)
		} finally {
			setIsSubmitting(false)
		}
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
				<form onSubmit={handleSubmit} className='flex flex-col gap-7'>
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
									key={item.id}
									className='flex flex-col gap-2 p-4 border rounded-lg'
								>
									<div className='flex justify-between items-center'>
										<span className='text-sm font-medium text-gray-500'>
											Шаг {item.onStep}: {item.type}
										</span>
										<div className='flex gap-2'>
											<Button
												text='↑'
												type='Button'
												typeForHtml='button'
												classNames={['text-xs w-8 h-8 p-0 border-gray-300']}
												onClick={() => moveContent(idx, 'up')}
												disabled={idx === 0 && editingIdx === null}
											/>
											<Button
												text='↓'
												type='Button'
												typeForHtml='button'
												classNames={['text-xs w-8 h-8 p-0 border-gray-300']}
												onClick={() => moveContent(idx, 'down')}
												disabled={
													idx === formData.content.length - 1 &&
													editingIdx === null
												}
											/>
										</div>
									</div>

									{item.type === 'PARAGRAPH' && (
										<Input
											id={`content-p-` + item.id}
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

									{item.type === 'IMAGES' && (
										<div className='flex flex-col gap-1'>
											<Input
												required
												name='images'
												id={`content-img-` + item.id}
												type='file'
												accept='image/*'
												multiple
												onChange={e => handleContentFileChange(idx, e)}
												placeholder='Выберите изображения...'
												classNames={classNames}
											/>
											{item.options.text && (
												<span className='text-xs text-blue-500 ml-3 italic'>
													Выбрано: {item.options.text}
												</span>
											)}
										</div>
									)}

									{item.type === 'VIDEOS' && (
										<div className='flex flex-col gap-1'>
											<Input
												id={`content-vid-` + item.id}
												type='file'
												required
												name='videos'
												accept='video/*'
												multiple
												onChange={e => handleContentFileChange(idx, e)}
												placeholder='Выберите видео...'
												classNames={classNames}
											/>
											{item.options.text && (
												<span className='text-xs text-blue-500 ml-3 italic'>
													Выбрано: {item.options.text}
												</span>
											)}
										</div>
									)}

									{item.type === 'DOCS' && (
										<div className='flex flex-col gap-1'>
											<Input
												required
												name='docs'
												id={`content-doc-` + item.id}
												type='file'
												multiple
												onChange={e => handleContentFileChange(idx, e)}
												placeholder='Выберите документы...'
												classNames={classNames}
											/>
											{item.options.text && (
												<span className='text-xs text-blue-500 ml-3 italic'>
													Выбрано: {item.options.text}
												</span>
											)}
										</div>
									)}

									{item.type === 'LINKS' && (
										<div className='flex flex-col gap-3'>
											<Input
												id={`content-link-text-` + item.id}
												type='text'
												required={false}
												name={`link-text-${idx}`}
												value={(item.options.text as string) || ''}
												onChange={e =>
													handleContentTextChange(idx, e.target.value)
												}
												placeholder='Текст ссылки (например: Перейти на сайт)'
												classNames={classNames}
											/>
											<Input
												id={`content-link-url-` + item.id}
												type='text'
												required={false}
												name={`link-url-${idx}`}
												value={(item.options.url as string) || ''}
												onChange={e =>
													handleContentUrlChange(idx, e.target.value)
												}
												placeholder='URL ссылки (https://example.com)'
												classNames={classNames}
											/>
										</div>
									)}

									{item.type === 'LISTS' && (
										<div className='flex flex-col gap-2'>
											<label className='text-sm text-gray-400 ml-3'>
												Введите каждый пункт с новой строки:
											</label>
											<textarea
												id={`content-list-` + item.id}
												className='px-3 py-2 border-2 rounded-lg border-blue-400 max-w-[500px] h-32'
												value={(item.options.listItems || []).join('\n')}
												onChange={e =>
													handleContentListChange(idx, e.target.value)
												}
												placeholder='Пункт 1&#10;Пункт 2&#10;Пункт 3'
											/>
										</div>
									)}

									<div className='flex items-center gap-3'>
										<Button
											text='Удалить'
											type='Button'
											typeForHtml='button'
											classNames={['text-red-400 text-xs w-fit']}
											onClick={() => handleDeleteContent(idx)}
										/>
										{editingIdx === idx && (
											<Button
												text='Сохранить'
												type='Button'
												typeForHtml='button'
												classNames={['text-green-400 text-xs w-fit']}
												onClick={() => handleSaveContent()}
											/>
										)}
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
							disabled={editingIdx !== null || isSubmitting}
							type='Button'
							typeForHtml='button'
							text='Добавить параграф'
							onClick={() => addingContent('PARAGRAPH')}
						/>
						<Button
							classNames={[
								'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
							]}
							disabled={editingIdx !== null || isSubmitting}
							type='Button'
							typeForHtml='button'
							text='Добавить фотографии'
							onClick={() => addingContent('IMAGES')}
						/>
						<Button
							classNames={[
								'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
							]}
							disabled={editingIdx !== null || isSubmitting}
							type='Button'
							typeForHtml='button'
							text='Добавить видео'
							onClick={() => addingContent('VIDEOS')}
						/>
						<Button
							classNames={[
								'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
							]}
							disabled={editingIdx !== null || isSubmitting}
							type='Button'
							typeForHtml='button'
							text='Добавить документы'
							onClick={() => addingContent('DOCS')}
						/>
						<Button
							classNames={[
								'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
							]}
							disabled={editingIdx !== null || isSubmitting}
							type='Button'
							typeForHtml='button'
							text='Добавить ссылку'
							onClick={() => addingContent('LINKS')}
						/>
						<Button
							classNames={[
								'text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white',
							]}
							disabled={editingIdx !== null || isSubmitting}
							type='Button'
							typeForHtml='button'
							text='Добавить список'
							onClick={() => addingContent('LISTS')}
						/>
					</div>
					{editingIdx !== null && (
						<p className='text-red-400'>
							Чтобы добавить новый контент, завершите заполнение текущего или
							удалите его!
						</p>
					)}
					<Button
						classNames={[
							'text-green-400 border-green-400 hover:bg-green-400 hover:text-white max-w-[300px]',
						]}
						type='Button'
						typeForHtml='submit'
						text={isSubmitting ? 'Создание...' : 'Создать новость'}
						disabled={
							isSubmitting ||
							!(formData.title.length > 0 && formData.content.length > 0)
						}
					/>
				</form>
				<p className='text-olive-500 max-w-[300px]'>
					Внимание: контент на странице новости будет идти в том порядке, в
					котором вы его добавили*
				</p>
				{error && <p className='text-red-500'>Произошла ошибка: {error}</p>}
			</div>
		</AuthLayout>
	)
}
