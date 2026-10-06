import { getUser } from '@entities/auth'
import { getOfPagination, selectedNewsNews } from '@entities/news'
import { Home, LoginPage, ProfilePage } from '@pages'
import { NewsCreatePage, NewsPage, NewsUpdatePage } from '@pages/news'
import { UsersCreatePage, UsersPage, UsersUpdatePage } from '@pages/users'
import { useDispatch, useSelector } from '@shared/store'
import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SuperuserRoute } from './route/AdminRoute'
import { ProtectedRoute } from './route/ProtectedRoute'

export const App = () => {
	const news = useSelector(selectedNewsNews)
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getUser())
			.unwrap()
			.catch(() => {
			})
		dispatch(getOfPagination({}))
	}, [dispatch])

	useEffect(() => {
		console.log('change news: ', news)
	}, [news])

	return (
		<Routes>
			<Route path='/' element={<Home />} />
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
			<Route
				path='/news/create'
				element={
					<ProtectedRoute>
						<NewsCreatePage />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/news/update/:news_id'
				element={
					<ProtectedRoute>
						<NewsUpdatePage />
					</ProtectedRoute>
				}
			/>

			<Route
				path='/users'
				element={
					<SuperuserRoute>
						<UsersPage />
					</SuperuserRoute>
				}
			/>
			<Route
				path='/users/create'
				element={
					<SuperuserRoute>
						<UsersCreatePage />
					</SuperuserRoute>
				}
			/>
			<Route
				path='/users/update/:user_id'
				element={
					<SuperuserRoute>
						<UsersUpdatePage />
					</SuperuserRoute>
				}
			/>
		</Routes>
	)
}
