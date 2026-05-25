import {
	useDispatch as dispatchHook,
	useSelector as selectorHook,
	type TypedUseSelectorHook,
} from 'react-redux'

export const useDispatch = dispatchHook.withTypes<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook
