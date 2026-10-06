import { selectedAuthIsAuthChecked, selectedAuthUser } from '@entities/auth'
import { useSelector } from '@shared/store'
import type { FC, ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type TAdminRouteProps = {
	children: ReactElement
}

export const SuperuserRoute: FC<TAdminRouteProps> = ({ children }) => {
	const user = useSelector(selectedAuthUser)
	const isAuthChecked = useSelector(selectedAuthIsAuthChecked)
	const location = useLocation()

	if (!isAuthChecked) return <>Loading</>
	if (!user) return <Navigate to='/login' state={{ from: location }} />
	if (user.role !== 'ADMIN') return <Navigate to='/' replace />

	return children
}
