import { locationWithPath } from '@shared/utils/locationWithPath'
import clsx from 'clsx'
import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface IButton {
	type: 'Link' | 'Button'
	typeForHtml: 'submit' | 'button'
	path?: string
	text: string
	onClick?: () => void
	classNames?: string[]
}

export const Button: FC<IButton> = ({
	text,
	path,
	type,
	onClick,
	classNames,
	typeForHtml,
}) => {
	const navigate = useNavigate()
	const handleClick = () => {
		if (type === 'Link') {
			if (path) {
				locationWithPath({ path: path, navigate })
			}
		} else if (onClick) {
			onClick()
		}
	}

	return (
		<button
			className={clsx(
				'px-3 py-2 border-2 rounded-full border-blue-400 text-base font-medium hover:text-blue-400 transition-all cursor-pointer',
				classNames,
			)}
			onClick={handleClick}
			type={typeForHtml}
		>
			{text}
		</button>
	)
}
