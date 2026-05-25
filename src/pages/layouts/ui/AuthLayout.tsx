import { Header } from '@widgets'
import type { FC, ReactNode } from 'react'

interface AuthLayoutProps {
	children: ReactNode
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
	return (
		<div className='p-0 m-0 box-border flex flex-col min-h-dvh'>
			<Header />
			<main className='grow flex flex-col justify-center py-3 px-12'>
				{children}
			</main>
		</div>
	)
}
