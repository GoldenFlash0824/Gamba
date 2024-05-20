import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, TextField, Button, Grid } from '@material-ui/core'
import { toast } from 'react-toastify'
import { color, toastStyle } from '../../assets/css/commonStyle'
import ValidateInput from '../common/ValidateInput'
import { api } from '../../api/callAxios'
import DeleteModal from '../common/DeleteModal'

const OrderDetailsForm = ({ user, goBackAllUser }) => {
	useEffect(() => {
		if (user !== null) {
			setId('')
			let date = new Date(user.createdAt).toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
				year: 'numeric'
			})
			setName(date)
			setNickName('')
			setageGroup('')
			//setBio(user.image)
			setimage('')
			setEmail('')
			setphone('')
			setAltitude('')
			setLongitude('')
			setFcmToken('')
		} else {
			_history.push('/viewAllUsers')
		}
	}, [])
	let _history = useHistory()
	const classes = useStyles()
	const [id, setId] = useState('')
	const [image, setimage] = useState('')
	const [name, setName] = useState('')
	const [nickName, setNickName] = useState('')
	const [ageGroup, setageGroup] = useState('')
	const [bio, setBio] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setphone] = useState('')
	const [altitude, setAltitude] = useState('')
	const [longitude, setLongitude] = useState('')
	const [fcmToken, setFcmToken] = useState('')
	const [errorFullName, setErrorFullName] = useState('')
	const [errorNickName, setErrorNickName] = useState('')
	const [errorAgeGroup, setErrorAgeGroup] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorBio, setErrorBio] = useState('')
	const [errorEmail, setErrorEmail] = useState('')
	const [errorphone, setErrorphone] = useState('')
	const [errorAltitude, setErrorAltitude] = useState('')
	const [errorLongitude, setErrorLongitude] = useState('')
	const [deleteUser, setDeleteUser] = useState(false)

	const doSaveUser = () => {
		if (checkValidation()) {
			api.post(`/admin/update_user`, {
				id: id,
				full_name: setName,
				nick_name: nickName,
				age_group: ageGroup,
				bio: bio,
				email: email,
				phone: phone,
				lat: altitude,
				lng: longitude,
				fcm_token: fcmToken
			})
				.then((response) => {
					if (response.data.success) {
						goBackAllUser()
						toast.success('User updated successfully.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					} else {
						toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					}
				})
				.catch(function (error) {
					toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
				})
		}
	}
	const doDeleteUser = () => {
		setIsLoading(true)
		api.delete(`/admin/delete_user?userId=${user.id}`)
			.then((response) => {
				if (response.data.success) {
					toast.success('User delete successfully.', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					setIsLoading(false)
					goBackAllUser()
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
		const errorFullName = ValidateInput('name', name)
		if (errorFullName) {
			setErrorFullName(errorFullName)
			_isValid = false
		} else {
			setErrorFullName(null)
		}

		const errorlasrstName = ValidateInput('nickName', nickName)
		if (errorlasrstName) {
			setErrorNickName(errorlasrstName)
			_isValid = false
		} else {
			setErrorNickName(null)
		}

		const errorBio = ValidateInput('bio', bio)
		if (errorBio) {
			setErrorBio(errorBio)
			_isValid = false
		} else {
			setErrorBio(null)
		}

		const errorEmail = ValidateInput('email', email)
		if (errorEmail) {
			setErrorEmail(errorEmail)
			_isValid = false
		} else {
			setErrorEmail(null)
		}

		const errorAgeGroup = ValidateInput('age', ageGroup)
		if (errorAgeGroup) {
			setErrorAgeGroup(errorAgeGroup)
			_isValid = false
		} else {
			setErrorAgeGroup(null)
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

	const onBlurEmail = () => {
		const errorEmail = ValidateInput('email', email)
		if (errorEmail) {
			setErrorEmail(errorEmail)
		} else {
			setErrorEmail(null)
		}
	}

	return (
		<>
			{isLoading && (
				<div id="loader-div" className={classes.loading}>
					<div id="loadings"></div>
				</div>
			)}
			<img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${image}`} alt="" />,
			<Grid container>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Order Date <span className={classes.danger}>*</span>{' '}
						</Typography>
						<TextField
							type="text"
							size="small"
							className={classes.textField}
							fullWidth
							variant="outlined"
							value={name}
							onChange={(e) => {
								setName(e.target.value.replace(/[^\w\s]/gi, ''))
							}}
						/>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorFullName}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Deliver Date <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={nickName} onChange={(e) => setNickName(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorNickName}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Sold To <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={ageGroup} onChange={(e) => setageGroup(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorAgeGroup}
						</Box>
					</Grid>
				</Grid>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Order Number <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={bio} onChange={(e) => setBio(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorBio}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Sold User Email <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} onKeyUp={onBlurEmail} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorEmail}
						</Box>
					</Grid>

					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Sold User Phone <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={phone} onChange={(e) => setphone(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorphone}
						</Box>
					</Grid>
				</Grid>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Product <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={altitude} onChange={(e) => setAltitude(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorAltitude}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Total <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorLongitude}
						</Box>
					</Grid>
				</Grid>
				<Grid item xs={12} md={12} className={classes.control} style={{ textAlign: 'center', justifyContent: 'flex-end', display: 'flex' }}>
					<Button variant="contained" color="primary" className={classes.deleteButton} onClick={() => setDeleteUser(true)}>
						Delete
					</Button>
					<div style={{ marginLeft: '10px' }} />
					<Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => doSaveUser()}>
						Save Changes
					</Button>
				</Grid>
			</Grid>
			<DeleteModal open={deleteUser} close={() => setDeleteUser(false)} title="Delete User" message="Do you really want to delete user? You cannot undo this action." deleteButtonText="Delete User" deleteAction={doDeleteUser} />
		</>
	)
}

export default OrderDetailsForm

const useStyles = makeStyles((theme) => ({
	danger: {
		color: color.red
	},
	label: {
		color: color.seaGreen
	},
	saveButton: {
		marginTop: '10px',
		backgroundColor: color.seaGreen,
		color: color.white,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: color.lightPurple
		}
	},
	deleteButton: {
		marginTop: '10px',
		marginLeft: '5px',
		backgroundColor: color.darkRed,
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
