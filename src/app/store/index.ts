import { authSlice } from '@entities/auth'
import { newsSlice } from '@entities/news';
import { combineSlices, configureStore } from '@reduxjs/toolkit'

const rootReducer = combineSlices(authSlice, newsSlice)

export const store = configureStore({
	reducer: rootReducer,
})

declare global {
	type RootState = ReturnType<typeof rootReducer>
	type AppDispatch = typeof store.dispatch
}
