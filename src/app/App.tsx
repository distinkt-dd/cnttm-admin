import { getUser } from '@entities/auth'
import { getOfPagination, selectedNewsNews } from '@entities/news'
import { Home, LoginPage, ProfilePage } from '@pages'
import { NewsPage } from '@pages/news'
import { useDispatch, useSelector } from '@shared/store'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './route/ProtectedRoute'

export const App = () => {
	const news = useSelector(selectedNewsNews)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getUser())
		dispatch(getOfPagination({}))
	}, [dispatch])

	useEffect(() => {
		console.log('change news: ', news)
	}, [news])

	return (
		<Routes>
			<Route path='/' element={<Home />}></Route>
			<Route
				path='/login'
				element={
					<ProtectedRoute onlyUnAuth>
						<LoginPage />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/profile'
				element={
					<ProtectedRoute>
						<ProfilePage />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/news'
				element={
					<ProtectedRoute>
						<NewsPage />
					</ProtectedRoute>
				}
			/>
		</Routes>
	)
}
