import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box, TextField, Button, Grid } from '@material-ui/core'
import { toast } from 'react-toastify'
import { color, toastStyle } from '../../assets/css/commonStyle'
import ValidateInput from '../common/ValidateInput'
import { api } from '../../api/callAxios'
import DeleteModal from '../common/DeleteModal'
import moment from 'moment'
const ViewUserDetails = ({ user, goBackAllUser }) => {

	useEffect(() => {
		if (user !== null) {
			setId(user?.user?.seller_detail?.id)
			setName(user?.user?.seller_detail?.first_name && user?.user?.seller_detail?.last_name ? user?.user?.seller_detail?.first_name + " " + user?.user?.seller_detail?.last_name : user?.user?.seller_detail?.first_name ? user?.user?.seller_detail?.first_name : '')
			setimage(user?.user?.seller_detail?.image)
			setEmail(user?.user?.seller_detail?.email)
			setphone(user?.user?.seller_detail?.phone)
			fetchData(user?.user?.seller_detail?.id)
		} else {
			_history.push('/viewAllUsers')
		}
	}, [])
	let _history = useHistory()
	const classes = useStyles()
	const [id, setId] = useState('')
	const [image, setimage] = useState('')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setphone] = useState('')
	const [longitude, setLongitude] = useState('')
	const [errorFullName, setErrorFullName] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorEmail, setErrorEmail] = useState('')
	const [deleteUser, setDeleteUser] = useState(false)
	const [total, settotal] = useState(0)

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

	const fetchData = (sellerId) => {
		setIsLoading(true)

		api.post(`/admin/seller_total`, {
			seller_id: sellerId
		})
			.then((response) => {
				settotal(response.data.data[0].totalSum)
				setIsLoading(false)
			})
			.catch((error) => {
				toast.error('Something went wrong. Please try again later.', {
					position: 'top-right',
					autoClose: 3000
				})
				setIsLoading(false)
			})
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
			<img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${image ? image : user?.user?.seller_detail?.first_name[0].toLowerCase() + '.png'}`} alt="" />
			<Grid container>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							{user?.user?.bokingOrder ? 'Seller Name' : 'Name'} <span className={classes.danger}>*</span>{' '}
						</Typography>
						<TextField
							type="text"
							size="small"
							className={classes.textField}
							fullWidth
							variant="outlined"
							disabled
							value={name}
							onChange={(e) => {
								e.preventDefault()
							}}
						/>
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorFullName}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Phone <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} disabled fullWidth variant="outlined" value={phone} onChange={(e) => setphone(e.target.value)} />

					</Grid>
				</Grid>
				<Grid item xs={12} md={4} className={classes.control}>



					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Email <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" disabled className={classes.textField} fullWidth variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} onKeyUp={onBlurEmail} />
						<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
							{errorEmail}
						</Box>
					</Grid>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Purchased Date <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} disabled fullWidth variant="outlined" value={moment(user?.user?.createdAt).format('MM/DD/YY')} />
					</Grid>


				</Grid>
				<Grid item xs={12} md={4} className={classes.control}>
					<Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Amount <span className={classes.danger}>*</span>
						</Typography>
						<TextField type="text" size="small" className={classes.textField} disabled fullWidth variant="outlined" value={total} onChange={(e) => setLongitude(e.target.value)} />
					</Grid>
					{user?.user?.bokingOrder && <Grid item xs={12} md={12} className={classes.control}>
						<Typography variant="subtitle2" className={classes.label}>
							{' '}
							Reported User Name <span className={classes.danger}>*</span>{' '}
						</Typography>
						<TextField
							type="text"
							size="small"
							className={classes.textField}
							fullWidth
							variant="outlined"
							disabled
							value={user?.user?.bokingOrder?.reportedUser?.first_name ? user?.user?.bokingOrder?.reportedUser?.first_name + user?.user?.bokingOrder?.reportedUser?.last_name : ''}
						/>
					</Grid>}
				</Grid>
				{user?.user?.bokingOrder && <Grid item xs={12} md={12} className={classes.control}>
					<Typography variant="subtitle2" className={classes.label}>
						{' '}
						Reason <span className={classes.danger}>*</span>{' '}
					</Typography>
					<textarea
						rows={2}
						type="text"
						size="small"
						className={classes.textField}
						fullWidth
						style={{ width: '100%' }}
						variant="outlined"
						disabled
						value={user?.user?.bokingOrder?.reason}
					/>
				</Grid>}
			</Grid>
			<DeleteModal open={deleteUser} close={() => setDeleteUser(false)} title="Delete User" message="Do you really want to delete user? You cannot undo this action." deleteButtonText="Delete User" deleteAction={doDeleteUser} />
		</>
	)
}

export default ViewUserDetails

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
	posesImages: {
		width: '6rem',
		height: '6rem',
		objectFit: 'cover',
		borderRadius: '4px'
	},
}))
