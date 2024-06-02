import {letterColors} from '../styled/colors'

export const colorPicker = async (value: any) => {
	let colorValue: any = null

	letterColors &&
		(await letterColors?.find((obj: any) => {
			let key = Object?.keys(obj)
			if (key.length && key[0] == value) {
				let value = Object?.values(obj)
				colorValue = value[0]
				return value[0]
			}
		}))

	return colorValue
}
