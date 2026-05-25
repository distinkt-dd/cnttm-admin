export const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	return new Intl.DateTimeFormat('ru-RU', {
		day: 'numeric',
		month: 'long',
	}).format(date)
}
