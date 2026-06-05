import { locationWithPath } from '@shared/utils/locationWithPath'
import clsx from 'clsx'
import type { FC, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

interface IButton {
	type: 'Link' | 'Button'
	typeForHtml: 'submit' | 'button'
	path?: string
	text: string
	onClick?: (e: MouseEvent) => void
	classNames?: string[]
	disabled?: boolean
}

export const Button: FC<IButton> = ({
	text,
	path,
	type,
	onClick,
	classNames,
	typeForHtml,
	disabled,
}) => {
	const navigate = useNavigate()
	const handleClick = (e: MouseEvent) => {
		if (type === 'Link') {
			if (path) {
				locationWithPath({ path: path, navigate })
			}
		} else if (onClick) {
			onClick(e)
		}
	}

	return (
		<button
			className={clsx(
				'px-3 py-2 border-2 rounded-full border-blue-400 text-base font-medium hover:text-blue-400 transition-all cursor-pointer disabled:text-olive-500 disabled:border-olive-500 disabled:pointer-events-none',
				classNames,
			)}
			onClick={handleClick}
			type={typeForHtml}
			disabled={disabled}
		>
			{text}
		</button>
	)
}
