import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, TextField, Button, Grid } from '@material-ui/core'
import { toast } from 'react-toastify'
import { color, toastStyle } from '../../assets/css/commonStyle'
import ValidateInput from '../common/ValidateInput'
import { api } from '../../api/callAxios'
import DeleteModal from '../common/DeleteModal'
const CategoryDetailForm = ({ user, goBackAllCategory }) => {
	useEffect(() => {
		if (user !== null) {
			setId(user.id)
			setproduct_id('user')
			settitle(user.title)
			setproductName('user')

			setsetSoldQuantity('')
			setsoldQuantity('')
			setphone('')
			setAltitude('')
			setLongitude('')
			setprice('')
		} else {
			_history.push('/viewAllProduct')
		}
	}, [])
	let _history = useHistory()
	const classes = useStyles()
	const [id, setId] = useState('')
	const [product_id, setproduct_id] = useState('')
	const [title, settitle] = useState('')
	const [productName, setproductName] = useState('')
	const [instock, setinstock] = useState('')
	const [setSoldQuantity, setsetSoldQuantity] = useState('')
	const [soldQuantity, setsoldQuantity] = useState('')
	const [phone, setphone] = useState('')
	const [altitude, setAltitude] = useState('')
	const [longitude, setLongitude] = useState('')
	const [price, setprice] = useState('')
	const [errorFullName, setErrorFullName] = useState('')
	const [errorproductName, setErrorproductName] = useState('')
	const [errorinstock, setErrorinstock] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorsetSoldQuantity, setErrorsetSoldQuantity] = useState('')
	const [errorsoldQuantity, setErrorsoldQuantity] = useState('')
	const [errorphone, setErrorphone] = useState('')
	const [errorAltitude, setErrorAltitude] = useState('')
	const [errorLongitude, setErrorLongitude] = useState('')
	const [deleteproduct, setdeleteproduct] = useState(false)

	const doSaveUser = () => {
		if (checkValidation()) {
			api.post(`/admin/update_category/${id}`, {
				title: title
			})
				.then((response) => {
					if (response.data.success) {
						goBackAllCategory()
						toast.success('updated successfully.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					} else {
						toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					}
				})
				.catch(function (error) {
					toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
				})
		}
	}
	const doDeleteReportedProduct = () => {
		setIsLoading(true)
		api.delete(`admin/delete_product/${user.id}`)
			.then((response) => {
				if (response.data.success) {
					toast.success('product delete successfully.', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					setdeleteproduct(false)
					setIsLoading(false)
					goBackAllCategory()
				} else {
					toast.error('Something went wrong. Please try again later.', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					setIsLoading(false)
				}
			})
			.catch(function (error) {
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
				setIsLoading(false)
			})
	}

	const checkValidation = () => {
		var _isValid = true
		const errorFullName = ValidateInput('name', title)
		if (errorFullName) {
			setErrorFullName(errorFullName)
			_isValid = false
		} else {
			setErrorFullName(null)
		}

		const errorlasrstName = ValidateInput('productName', productName)
		if (errorlasrstName) {
			setErrorproductName(errorlasrstName)
			_isValid = false
		} else {
			setErrorproductName(null)
		}

		const errorsetSoldQuantity = ValidateInput('setSoldQuantity', setSoldQuantity)
		if (errorsetSoldQuantity) {
			setErrorsetSoldQuantity(errorsetSoldQuantity)
			_isValid = false
		} else {
			setErrorsetSoldQuantity(null)
		}

		const errorsoldQuantity = ValidateInput('soldQuantity', soldQuantity)
		if (errorsoldQuantity) {
			setErrorsoldQuantity(errorsoldQuantity)
			_isValid = false
		} else {
			setErrorsoldQuantity(null)
		}

		const errorinstock = ValidateInput('age', instock)
		if (errorinstock) {
			setErrorinstock(errorinstock)
			_isValid = false
		} else {
			setErrorinstock(null)
		}

		const errorphone = ValidateInput('phone', phone)
		if (errorphone) {
			setErrorphone(errorphone)
			_isValid = false
		} else {
			setErrorphone(null)
		}

		const errorAltitude = ValidateInput('altitude', altitude)
		if (errorAltitude) {
			setErrorAltitude(errorAltitude)
			_isValid = false
		} else {
			setErrorAltitude(null)
		}

		const errorLongitude = ValidateInput('longitude', longitude)
		if (errorLongitude) {
			setErrorLongitude(errorLongitude)
			_isValid = false
		} else {
			setErrorLongitude(null)
		}

		return (_isValid = true)
	}

	const onBlursoldQuantity = () => {
		const errorsoldQuantity = ValidateInput('soldQuantity', soldQuantity)
		if (errorsoldQuantity) {
			setErrorsoldQuantity(errorsoldQuantity)
		} else {
			setErrorsoldQuantity(null)
		}
	}

	return (
		<>
			{isLoading && (
				<div id="loader-div" className={classes.loading}>
					<div id="loadings"></div>
				</div>
			)}
			<Grid container>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Title <span className={classes.danger}>*</span>{' '}
						</Typography>
						<TextField
							type="text"
							size="small"
							className={classes.textField}
							fullWidth
							variant="outlined"
							value={title}
							onChange={(e) => {
								settitle(e.target.value.replace(/[^\w\s]/gi, ''))
							}}
						/>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorFullName}
						</Box>
					</Grid>
				</Grid>

				<Grid item xs={12} md={12} className={classes.control} style={{ textAlign: 'center', justifyContent: 'flex-end', display: 'flex' }}>
					<div style={{ padding: '0 10px' }} />
					<Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => doSaveUser()}>
						Save Changes
					</Button>
				</Grid>
			</Grid>

			<DeleteModal
				open={deleteproduct}
				close={() => setdeleteproduct(false)}
				title="Delete product"
				message="Do you really want to delete Reported Product? You cannot undo this action."
				deleteButtonText="Delete User"
				deleteAction={doDeleteReportedProduct}
			/>
		</>
	)
}

export default CategoryDetailForm

const useStyles = makeStyles((theme) => ({
	danger: {
		color: color.red
	},
	label: {
		color: color.blue
	},
	saveButton: {
		marginTop: '10px',
		backgroundColor: color.darkBlue,
		color: color.white,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: color.darkBlue
		}
	},
	deleteButton: {
		marginTop: '10px',
		marginLeft: '5px',
		backgroundColor: color.red,
		color: color.white,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: '#c22b2b'
		}
	},
	textField: {
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		marginTop: '3px'
	},
	control: {
		paddingRight: theme.spacing(2),
		marginTop: '10px'
	},
	errorMessage: {
		color: color.red,
		marginTop: '6px'
	},
	loading: {
		position: 'fixed',
		height: '100%',
		width: '100%',
		left: '0',
		zIndex: ' 99'
	}
}))
