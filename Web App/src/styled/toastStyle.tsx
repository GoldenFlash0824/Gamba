import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const toastStyle: any = {
	position: 'top-center',
	closeDuration: 1000
}
export const toastError: any = (message: any) => {
	toast.error(message, {
		position: toastStyle.position,
		autoClose: toastStyle.closeDuration
	})
}
export const toastSuccess: any = (message: any) => {
	toast.success(message, {
		position: toastStyle.position,
		autoClose: toastStyle.closeDuration
	})
}
