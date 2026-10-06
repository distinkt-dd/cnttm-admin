import clsx from 'clsx'
import type { ChangeEvent, FC } from 'react'

interface InputProps {
	label?: string
	type: string
	id: string
	placeholder?: string
	required: boolean
	value?: string
	classNames?: string[]
	name: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	accept?: string
	multiple?: boolean
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
	accept,
	multiple,
}) => {
	return (
		<div className='flex flex-col gap-3'>
			<label htmlFor={id}>{label}</label>
			<input
				name={name}
				accept={accept}
				placeholder={placeholder}
				required={required}
				type={type}
				id={id}
				value={value}
				onChange={onChange}
				className={clsx(classNames)}
				multiple
			/>
		</div>
	)
}
