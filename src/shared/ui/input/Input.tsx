import clsx from 'clsx'
import type { ChangeEvent, FC } from 'react'

interface InputProps {
	label?: string
	type: string
	id: string
	placeholder?: string
	required: boolean
	value: string
	classNames?: string[]
	name: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export const Input: FC<InputProps> = ({
	label,
	type,
	name,
	id,
	placeholder,
	required,
	value,
	onChange,
	classNames,
}) => {
	return (
		<div className='flex flex-col gap-3'>
			<label htmlFor={id}>{label}</label>
			<input
				name={name}
				placeholder={placeholder}
				required={required}
				type={type}
				id={id}
				value={value}
				onChange={onChange}
				className={clsx(classNames)}
			/>
		</div>
	)
}
