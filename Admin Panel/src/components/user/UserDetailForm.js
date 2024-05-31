import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { toast } from 'react-toastify'
import { color, toastStyle } from '../../assets/css/commonStyle'
import ValidateInput from '../common/ValidateInput'
import { api } from '../../api/callAxios'
import DeleteModal from '../common/DeleteModal'
import moment from 'moment'
import UploadUserImage from '../common/UploadUserImage'
const UserDetailForm = ({ user, goBackAllUser }) => {
	useEffect(() => {
		if (user !== null) {
			setId(user.id)
			setName(user.first_name)
			setlastname(user?.last_name)
			//setBio(user.image)
			// setimage(user.image)
			setEmail(user.email)
			setphone(user.phone)
			setAltitude(user.lat)
			setLongitude(user.lng)
			setFcmToken(user.fcm_token)
			setDob(user.dob)
			setGender(user.gender)
			setcity(user?.address)
			setAbout(user?.about)
		} else {
			_history.push('/viewAllUsers')
		}
	}, [])

	let _history = useHistory()
	const classes = useStyles()
	const [id, setId] = useState('')
	const [name, setName] = useState('')
	const [lastname, setlastname] = useState('')
	const [nickName, setNickName] = useState('')
	const [ageGroup, setageGroup] = useState('')
	const [bio, setBio] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setphone] = useState('')
	const [altitude, setAltitude] = useState('')
	const [longitude, setLongitude] = useState('')
	const [fcmToken, setFcmToken] = useState('')
	const [errorFullName, setErrorFullName] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorEmail, setErrorEmail] = useState('')
	const [errorConfirmPassword, setConfrimPasswordError] = useState('')
	const [deleteUser, setDeleteUser] = useState(false)
	const [password, setPassword] = useState()
	const [confirmPassword, setConfirmPassword] = useState()
	const [dob, setDob] = useState('')
	const [gender, setGender] = useState('')
	const [city, setcity] = useState('')
	const [about, setAbout] = useState()
	const [image, setImage] = useState()
	const [showImageError, setShowImageError] = useState('')

	const [genderOption, setGenderOption] = useState([
		{ value: 'Male', label: 'Male' },
		{ value: 'Female', label: 'Female' },
		{ value: 'Transgender', label: 'Transgender' },
		{ value: 'Other', label: 'Other' }
	])


	const handleChange = (event) => {
		setGender(event.target.value);
	};


	const doSaveUser = () => {

		if (checkValidation()) {
			setIsLoading(true)
			api.post(`/admin/update_user`, {
				id: id,
				first_name: name,
				last_name: lastname,
				email: email,
				phone: phone,
				password: password ? password : user?.password,
				gender: gender,
				dob: moment(dob).format('MM/DD/YYYY'),
				address: city,
				about: about,
				image: image?.length ? image[0] : null
			})
				.then((response) => {
					if (response.data.success) {
						setIsLoading(false)
						goBackAllUser()
						toast.success('User updated successfully.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					} else {
						setIsLoading(false)
						toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					}
				})
				.catch(function (error) {
					setIsLoading(false)
					toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
				})
		}
	}
	const doDeleteUser = async () => {
		setIsLoading(true)
		api.delete(`/admin/delete_user/${user.id}`)
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message, {
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

		const errorEmail = ValidateInput('email', email)
		if (errorEmail) {
			setErrorEmail(errorEmail)
			_isValid = false
		} else {
			setErrorEmail(null)
		}

		if (password) {
			const _confirm = ValidateInput('confirmPassword', confirmPassword)
			if (_confirm) {
				setConfrimPasswordError(_confirm)
				_isValid = false
			} else if (password?.trim()?.length < 8) {
				setConfrimPasswordError('Password must be greater then 8 letters')
				_isValid = false
			} else if (password != confirmPassword) {
				setConfrimPasswordError('Password and confirm password not matched')
				_isValid = false
			}
			else {
				setConfrimPasswordError(null)
			}
		}

		const _image = ValidateInput('image', image?.length > 0 ? image : '')
		if (_image) {
			setShowImageError(_image)
			_isValid = false
		} else {
			setShowImageError(null)
		}

		return _isValid
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
			<Grid container style={{ marginTop: '1rem' }}>
				<UploadUserImage event={true} onSelect={setImage} tabActive={false} user={user} post={false} imageError={showImageError} isUser={true} />
			</Grid>
			{/* <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${image}`} alt="" /> */}
			<Grid container>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							First Name <span className={classes.danger}>*</span>{' '}
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
							Last Name <span className={classes.danger}>*</span>{' '}
						</Typography>
						<TextField
							type="text"
							size="small"
							className={classes.textField}
							fullWidth
							variant="outlined"
							value={lastname}
							onChange={(e) => {
								setlastname(e.target.value.replace(/[^\w\s]/gi, ''))
							}}
						/>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorFullName}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							About <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={about} onChange={(e) => setAbout(e.target.value)} />
					</Grid>
				</Grid>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Email <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} onKeyUp={onBlurEmail} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorEmail}
						</Box>
					</Grid>

					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Phone <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={phone} onChange={(e) => setphone(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}></Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Update Password <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" onChange={(e) => setPassword(e.target.value)} />
					</Grid>
				</Grid>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Date Of Birth <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="date" size="small" className={classes.textField} onKeyDown={(e) => e.preventDefault()} fullWidth variant="outlined" value={moment(dob).format('MM-DD-YYYY')} onChange={(e) => setDob(e.target.value)} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}></Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Gender <span className={classes.danger}>*</span>
						</Typography>
						<FormControl className={classes.formControl}>

							<Select
								labelId="dropdown-label"
								id="dropdown"
								value={gender}
								onChange={handleChange}

							>
								{genderOption?.map(res => (
									<MenuItem style={{ display: 'flex', justifyContent: 'left' }} value={res.value}>{res.label}</MenuItem>))}
							</Select>
						</FormControl>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}></Box>
					</Grid>

					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Confirm Password <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setConfrimPasswordError('') }} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorConfirmPassword}
						</Box>
					</Grid>
				</Grid>
				<Grid item xs={12} md={12} className={classes.control}>
					<Typography variant="subtitle2" className={classes.label}>
						{' '}
						Address <span className={classes.danger}>*</span>
					</Typography>
					<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={city} onChange={(e) => setcity(e.target.value)} />
					<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}></Box>
				</Grid>
				<Grid item xs={12} md={12} className={classes.control} style={{ textAlign: 'center', justifyContent: 'space-between', display: 'flex' }}>
					<Button variant="contained" color="primary" className={classes.deleteButton} onClick={() => setDeleteUser(true)}>
						Delete User
					</Button>
					<Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => doSaveUser()}>
						Save Changes
					</Button>

				</Grid>

			</Grid>
			<DeleteModal open={deleteUser} close={() => setDeleteUser(false)} title="Delete User" message="Do you really want to delete user? You cannot undo this action." deleteButtonText="Delete User" deleteAction={doDeleteUser} />
		</>
	)
}

export default UserDetailForm

const useStyles = makeStyles((theme) => ({
	danger: {
		color: color.red
	},
	label: {
		color: color.darkBlue
	},
	// saveButton: {
	// 	marginTop: '10px',
	// 	backgroundColor: color.darkBlue,
	// 	color: color.white,
	// 	fontWeight: '400',
	// 	fontSize: '13px',
	// 	textTransform: 'capitalize',
	// 	'&:hover': {
	// 		backgroundColor: color.darkBlue
	// 	}
	// },
	deleteButton: {
		backgroundColor: 'transparent',
		marginTop: '10px',
		color: color.darkRed,
		border: `1px solid ${color.darkRed}`,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		cursor: 'pointer',

		'&:hover': {
			backgroundColor: '#c22b2b',
			color: color.white,
		}
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
	},
	formControl: {
		width: ' 100%',
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		padding: '0.456rem 0.4rem'
	},
	select: {
		padding: '8px',
		backgroundColor: '#fff',
		// border: '1px solid #ccc',
		// borderRadius: '4px',
		display: 'flex',
		justifyContent: 'start'
	},
	menuItem: {
		'&:hover': {
			backgroundColor: '#f0f0f0',
		},
	},
}))
