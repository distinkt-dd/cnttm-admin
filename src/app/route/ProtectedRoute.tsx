import { selectedAuthIsAuthChecked, selectedAuthUser } from '@entities/auth'
import { useSelector } from '@shared/store'
import type { FC, ReactElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

type TProtectedRouteProps = {
	children: ReactElement
	onlyUnAuth?: boolean
}

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
	children,
	onlyUnAuth = false,
}) => {
	const user = useSelector(selectedAuthUser)
	const isAuthChecked = useSelector(selectedAuthIsAuthChecked)
	const location = useLocation()

	if (!isAuthChecked) {
		return <>Loading</>
	}

	if (!onlyUnAuth && !user) {
		return <Navigate to='/login' state={{ from: location }} />
	}

	if (onlyUnAuth && user) {
		const { from } = location.state ?? { from: { pathname: '/' } }
		return <Navigate to={from} />
	}

	return children
}
