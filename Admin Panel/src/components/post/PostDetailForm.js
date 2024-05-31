import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, TextField, Button, Grid, FormControl, Select, MenuItem } from '@material-ui/core'
import { toast } from 'react-toastify'
import { color, toastStyle } from '../../assets/css/commonStyle'
import ValidateInput from '../common/ValidateInput'
import { api } from '../../api/callAxios'
import DeleteModal from '../common/DeleteModal'
import StyledImageUpload from '../common/UploadImage'

const UserDetailForm = ({ user, goBackAllProduct, allBlockPost, tabActive }) => {
	useEffect(() => {
		if (user !== null) {
			if (tabActive) {
				setId(user.id)
				setuser_name(user?.user?.first_name && user?.user?.last_name ? user?.user?.first_name + ' ' + user?.user?.last_name : user?.user?.first_name ? user?.user?.first_name : '')
				settitle(user?.title)
				setdescription(user?.description)
				setPrivacy(user?.privacy)
			} else {
				setId(user.post_id)
				setuser_name(user?.reported_post.user?.first_name && user?.reported_post?.user?.last_name ? user?.reported_post?.user?.first_name + ' ' + user?.reported_post?.user?.last_name : user?.reported_post?.user?.first_name ? user?.reported_post?.user?.first_name : '')
				settitle(user.reported_post.title)
				setdescription(user.reported_post.description)
				setPrivacy(user?.reported_post?.privacy)
			}
		} else {
			_history.push('/viewAllPost')
		}
	}, [])
	let _history = useHistory()
	const classes = useStyles()
	const [id, setId] = useState('')
	const [user_name, setuser_name] = useState('')
	const [title, settitle] = useState('')
	const [description, setdescription] = useState('')
	const [errorFullName, setErrorFullName] = useState('')
	const [errordescription, setErrordescription] = useState('')
	const [errorinstock, setErrorinstock] = useState('')
	const [errorTitle, setErrorTitle] = useState('')
	const [errorPrice, setErrorPrice] = useState('')
	const [imageError, setImageError] = useState('')

	const [isLoading, setIsLoading] = useState(false)
	const [deleteproduct, setdeleteproduct] = useState(false)
	const [privacy, setPrivacy] = useState(tabActive ? user?.privacy : user?.reported_post?.privacy)
	const [image, setImage] = useState()

	const [privacyOption, setPrivacyOption] = useState([
		{ value: 'Public', label: 'Public' },
		{ value: 'My Network', label: 'My Network' },
		{ value: 'Only Me', label: 'Only Me' }
	])

	const doSaveUser = () => {
		if (checkValidation()) {
			setIsLoading(true)
			api.post(`/admin/update_reported_post`, {
				post_id: id,
				title: title,
				description: description,
				images: image,
				privacy: privacy
			})
				.then((response) => {
					if (response.data.success) {
						goBackAllProduct()
						allBlockPost()
						setIsLoading(false)
						toast.success('Reported product updated successfully.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
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
					goBackAllProduct()
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
		let _isValid = true


		const _title = ValidateInput('title', title)
		if (_title) {
			setErrorTitle(_title)
			_isValid = false
		} else {
			setErrorTitle(null)
		}


		const _image = ValidateInput('image', image?.length > 0 ? image : '')
		if (_image) {
			setImageError(_image)
			_isValid = false
		} else {
			setImageError(null)
		}

		const _description = ValidateInput('description', description)
		if (_description) {
			setErrordescription(_description)
			_isValid = false
		} else {
			setErrordescription(null)
		}

		if (description === '') {
			setErrordescription('Description is required')
			_isValid = false
		}

		if (image?.length <= 0) {
			setImageError('Images is required')
			_isValid = false
		}

		return _isValid
	}

	return (
		<>
			{isLoading && (
				<div id="loader-div" className={classes.loading}>
					<div id="loadings"></div>
				</div>
			)}

			<Grid container style={{ marginTop: '1rem' }}>
				<StyledImageUpload event={false} onSelect={setImage} tabActive={tabActive} user={user} post={true} imageError={imageError} />

			</Grid>


			<Grid container>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							User Name <span className={classes.danger}>*</span>{' '}
						</Typography>
						<TextField
							type="text"
							size="small"
							className={classes.textField}
							fullWidth
							variant="outlined"
							value={user_name}
							disabled
							onChange={(e) => {
								e.preventDefault()
							}}
						/>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorFullName}
						</Box>
					</Grid>


				</Grid>

				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Post Title <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={title} onChange={(e) => settitle(e.target.value)} />
					</Grid>
					<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
						{errorTitle}
					</Box>
				</Grid>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Privacy <span className={classes.danger}>*</span>
						</Typography>
						<FormControl className={classes.formControl}>

							<Select
								labelId="dropdown-label"
								id="dropdown"
								value={privacy}
								onChange={(e) => setPrivacy(e.target.value)}

							>
								{privacyOption?.map(res => (
									<MenuItem style={{ display: 'flex', justifyContent: 'left' }} value={res.value}>{res.label}</MenuItem>))}
							</Select>
						</FormControl>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}></Box>
					</Grid>
				</Grid>

				<Grid item xs={12} md={12} className={classes.control}>
					<Typography variant="subtitle2" className={classes.label}>
						{' '}
						Post Description <span className={classes.danger}>*</span>
					</Typography>
					<textarea type="text" size="small" rows={6} style={{ width: '100%' }} className={classes.textArea} fullWidth variant="outlined" value={description} onChange={(e) => setdescription(e.target.value)} />
					<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
						{errordescription}
					</Box>
				</Grid>

				<Grid item xs={12} md={12} className={classes.control} style={{ textAlign: 'center', justifyContent: 'flex-end', display: 'flex' }}>
					{/* <Button variant="contained" color="primary" className={classes.deleteButton} onClick={() => setdeleteproduct(true)}>
						Delete User
					</Button> */}
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

export default UserDetailForm

const useStyles = makeStyles((theme) => ({
	danger: {
		color: color.red
	},
	label: {
		color: color.darkBlue
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
		backgroundColor: color.darkRed,
		color: color.white,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: '#c22b2b'
		}
	},
	textArea: {
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		marginTop: '3px',
		focus: 'none',

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
}))
