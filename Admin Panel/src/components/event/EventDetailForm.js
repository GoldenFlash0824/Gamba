import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme, InputAdornment, FormControl, Select, MenuItem, FormControlLabel, Checkbox } from '@material-ui/core'
import SwipeableViews from 'react-swipeable-views'
import { toast } from 'react-toastify'
import { MDBDataTableV5 } from 'mdbreact'
import { HowToReg } from '@material-ui/icons'

import { color, toastStyle } from '../../assets/css/commonStyle'
import ValidateInput from '../common/ValidateInput'
import { api } from '../../api/callAxios'
import DeleteModal from '../common/DeleteModal'
import moment from 'moment-timezone'
import StyledImageUpload from '../common/UploadImage'
import LocationSearch from '../common/LocationPicker'
import ImageCropModal from '../common/ImageCropModal'

const EventDetailForm = ({ user, goBackAllProduct, tabActive }) => {

	const classes = useStyles()
	const theme = useTheme()
	const [value, setValue] = useState(0)
	const [event_id, seteventid] = useState('')
	const [user_name, setuser_name] = useState('')
	const [eventTitle, seteventTitle] = useState('')
	const [price, setprice] = useState('')
	const [startdate, setstartdate] = useState('')
	const [soldQuantity, setsoldQuantity] = useState('')
	const [enddate, setenddate] = useState('')
	const [reason, setreason] = useState('')
	const [description, setDescription] = useState('')
	//const [price, setprice] = useState('')
	const [errorFullName, setErrorFullName] = useState('')
	const [loading, setLoading] = useState(false)
	const [endDateError, setErrorEndDtae] = useState('')
	const [errorsoldQuantity, setErrorsoldQuantity] = useState('')
	const [text, setText] = useState(tabActive ? user?.location : user?.location)
	const [isPrivate, setIsPrivate] = useState(tabActive ? user?.is_private : user?.is_private)

	const [summaryError, setSummaryError] = useState('')
	const [latitude, setLatitude] = useState(tabActive ? user?.latitude : user?.latitude)
	const [longitude, setLongitude] = useState(tabActive ? user?.longitude : user?.longitude)
	const [limitToNumber, setLimitToNumber] = useState(tabActive ? user?.limit_to_number : user?.limit_to_number)
	const [showImageError, setShowImageError] = useState('')

	const [limitToNumberError, setLimitToNumberError] = useState('')
	const [titleError, setTitleError] = useState('')
	const [priceError, setPriceError] = useState('')
	const [locationError, setLocationError] = useState('')
	const [privacy, setPrivacy] = useState(tabActive ? user?.privacy : user?.privacy)

	const [showImage, setShowImage] = useState(null)
	const [result, setResult] = useState(null)

	const [privacyOption, setPrivacyOption] = useState([
		{ value: 'Public', label: 'Public' },
		{ value: 'My Network', label: 'My Network' },
		{ value: 'Only Me', label: 'Only Me' }
	])
	const [limitToOption, setLimitToOption] = useState([
		{ value: 'Up to 5 Guests', label: 'Up to 5 Guests' },
		{ value: 'Up to 10 Guests', label: 'Up to 10 Guests' },
		{ value: 'Up to 15 Guests', label: 'Up to 15 Guests' },
		{ value: 'Up to 20 Guests', label: 'Up to 20 Guests' },
		{ value: 'Enter Number', label: 'Enter Number' }
	])

	const [limitTo, setLimitTo] = useState(tabActive ? user?.limit_to : user?.limit_to)
	const [openCropModel, setOpenCropModel] = useState(false)

	let _history = useHistory()
	const [joinEventUser, setjoinEventUser] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Image', field: 'image', width: 200, sort: String('disabled') },
			{ label: 'First Name', field: 'first_name', width: 200, sort: String('disabled') },
			{ label: 'Last Name', field: 'last_name', width: 200, sort: String('disabled') },
			{ label: 'Email', field: 'email', width: 200, sort: String('disabled') }
		],
		rows: []
	})
	
	useEffect(() => {
		if (user !== null) {
			seteventid(user?.id)
			setuser_name(user?.eventUser?.first_name ? user?.eventUser?.first_name + ' ' + user?.eventUser?.last_name : '')
			seteventTitle(user?.title)
			setprice(user?.price)
			setstartdate(user?.start_date)
			setenddate(user?.end_date)
			setDescription(user?.summary)
			user?.joinEvent?.map((data, index) => {
				createJoinEventUserTable(data)
			})
			setIsPrivate(user?.is_private)
			setShowImage(user?.image)
		} else {
			_history.push('/viewAllProduct')
		}
	}, [])

	const checkValidation = () => {
		var _isValid = true

		if (moment.tz(startdate, 'America/New_York').isBefore(enddate)) {
			_isValid = true
		} else {
			setErrorEndDtae('End Date should be greater fromt start')
			_isValid = false
		}

		const _title = ValidateInput('title', eventTitle)
		if (_title) {
			setTitleError(_title)
			_isValid = false
		} else {
			setTitleError(null)
		}

		const _image = ValidateInput('image', result ? result : '')
		if (_image) {
			setShowImageError(_image)
			_isValid = false
		} else {
			setShowImageError(null)
		}

		const _description = ValidateInput('Caption', description)
		if (_description) {
			setSummaryError(_description)
			_isValid = false
		} else {
			setSummaryError(null)
		}

		const _price = ValidateInput('Price', price)
		if (_price) {
			setPriceError(_price)
			_isValid = false
		} else {
			setPriceError(null)
		}

		const _text = ValidateInput('Location', text)
		if (_text) {
			setLocationError(_text)
			_isValid = false
		} else {
			setLocationError(null)
		}

		if (description === '') {
			setSummaryError('Caption is required')
			_isValid = false
		}

		if (price == '') {
			setPriceError('Price is required')
			_isValid = false
		}

		if (text == '') {
			setLocationError('Location is required')
			_isValid = false
		}

		if (result == null && !showImage) {
			setShowImageError('Images is required')
			_isValid = false
		}
		if (limitTo === 'Enter Number' && limitToNumber == '') {
			setLimitToNumberError('Limit Number is Required')
			_isValid = false
		}


		if (limitTo === 'Enter Number' && !limitToNumber) {
			setLimitToNumberError('Limit Number is Required')
			_isValid = false
		}
		return _isValid
	}

	const doSaveUser = () => {
		if (checkValidation()) {
			setLoading(true)
			api.post(`/admin/update_reported_event_data`, {
				event_id: event_id,
				event_title: eventTitle,
				price: price,
				start_date: moment(startdate).format(),
				end_date: moment(enddate).format(),
				summary: description,
				location: text,
				latitude,
				longitude,
				image: result ? result : null,
				isPrivate,
				privacy,
				limitTo,
				limitToNumber: limitTo === 'Enter Number' ? limitToNumber : null
			})
				.then((response) => {
					setLoading(false)
					if (response.data.success) {
						goBackAllProduct()
						toast.success(`${tabActive ? 'Event' : 'Reported Event'} updated successfully.`, { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					} else {
						toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					}
				})
				.catch(function (error) {
					setLoading(false)
					toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
				})
		}
	}

	const onBlursoldQuantity = () => {
		const errorsoldQuantity = ValidateInput('soldQuantity', soldQuantity)
		if (errorsoldQuantity) {
			setErrorsoldQuantity(errorsoldQuantity)
		} else {
			setErrorsoldQuantity(null)
		}
	}

	const TabPanel = (props) => {
		const { children, value, index, ...other } = props
		return (
			<div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
				{value === index && (
					<Box p={3}>
						<Typography style={{ position: 'relative' }}>{children}</Typography>
					</Box>
				)}
			</div>
		)
	}
	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleChangeIndex = (index) => {
		setValue(index)
	}

	const createJoinEventUserTable = (row) => {
		let _obj = {
			id: row.joinEventUser.id,
			image: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row.joinEventUser?.image ? row.joinEventUser?.image : row.joinEventUser?.first_name ? row.joinEventUser?.first_name.toLowerCase()[0] + '.png' : ''}`} alt="" />,
			first_name: row.joinEventUser.first_name,
			last_name: row.joinEventUser.last_name,
			email: row.joinEventUser.email
		}
		setjoinEventUser((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const minDate = moment.tz('America/New_York').format('YYYY-MM-DDTHH:mm');

	const handleDateTimeChange = (event) => {
		// setstartdate(event.target.value);
		if (moment.tz(event.target.value, 'America/New_York').isAfter(minDate)) {
			setstartdate(event.target.value);
		} else {
			setstartdate(startdate);
		}
	};

	const handleEndDateTimeChange = (event) => {
		// setenddate(event.target.value);
		if (moment.tz(event.target.value, 'America/New_York').isAfter(minDate)) {
			setenddate(event.target.value);
		} else {
			setenddate(startdate);
		}
	};

	const handleCapture = ({ target }) => {
		const reader = new FileReader()
		reader.readAsDataURL(target.files[0])
		reader.onload = () => {
			if (reader.readyState === 2) {
				setShowImage(reader.result)
				setOpenCropModel(true)
			}
		}
	}
	return (
		<>
			{loading && (
				<div id="loader-div" className={classes.loadingwrapper}>
					<div id="loadings"></div>
				</div>
			)}
			<div className={classes.root}>
				<div className={classes.header}>
					<Typography variant="h4" className={classes.heading}>
						Detail
					</Typography>
				</div>
				<div className={classes.root1}>
					<AppBar position="static" color="default">
						<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
							<Tab className={classes.tabHeading} label="Event " icon={<HowToReg className={classes.tabIcon} />} />
							<Tab className={classes.tabHeading} label="Joind Users " icon={<HowToReg className={classes.tabIcon} />} />
						</Tabs>
					</AppBar>
					<SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
						{value == 0 &&
							<>
								<div className={classes.spacerHeight1}></div>
								<Grid container style={{ marginTop: '1rem', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
									{!showImage && !result ? (
										<>
											<div className={classes.uploadWrapper}>
												<label className={classes.upload}>
													<img className={classes.uploadIcon} src="/icons/upload_img.svg" alt='upload_img' />
													<input
														className={classes.fileInput}
														id="faceImage"
														accept="image/jpeg/png"
														type="file"
														onChange={(e) => {
															handleCapture(e)
															setShowImage('')
															setResult(null)
														}}
													/>
												</label>
											</div>
										</>
									) : (
										!result &&
										!openCropModel && (
											<div className={classes.imgWrapper}>
												<img className={classes.showImage} src={showImage?.startsWith('data:') ? showImage : `${process.env.REACT_APP_IMAGE_URL}/${showImage}`} alt='' />
												<div
													onClick={() => {
														setShowImage(null)
														setResult(null)
													}}>
													<img className={classes.close} src="/icons/delete_post.svg" alt="delete_post" />
												</div>
											</div>
										)
									)}
									{result && (
										<div className={classes.imgWrapper}>
											<img className={classes.showImage} src={result} alt='' />
											<div
												onClick={() => {
													setShowImage(null)
													setResult(null)
												}}>
												<img className={classes.close} src="/icons/delete_post.svg" alt="delete_post" />
											</div>
										</div>
									)}

									{result ? (
										''
									) : (
										<Typography variant="small" className={classes.danger}>
											{showImageError}
										</Typography>
									)}
								</Grid>
								<Grid container>
									<Grid item xs={12} md={4} className={classes.control} style={{ marginBottom: '1rem' }}>
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
												aria-readonly
												disabled
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
												Event Title <span className={classes.danger}>*</span>
											</Typography>
											<TextField type="text" size="small" className={classes.textField} fullWidth variant="outlined" value={eventTitle} onChange={(e) => seteventTitle(e.target.value)} />
											<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
												{titleError}
											</Box>
										</Grid>
										<Grid item xs={12} md={12} className={classes.control}>
											<Typography variant="subtitle2" className={classes.label}>
												{' '}
												Price <span className={classes.danger}>*</span>
											</Typography>
											<TextField type="number" size="small" className={classes.textField} fullWidth variant="outlined" value={price} onChange={(e) => {
												const numericValue = e.target.value.replace(/[^0-9.]/g, '');
												setprice(numericValue);
											}} />
											<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
												{priceError}
											</Box>
										</Grid>
									</Grid>
									<Grid item xs={12} md={4} className={classes.control}>
										<Grid item xs={12} md={12} className={classes.control}>
											<Typography variant="subtitle2" className={classes.label}>
												{' '}
												Start Date <span className={classes.danger}>*</span>
											</Typography>
											<div className={classes.dateTimePicker}>
												<TextField
													className={classes.textField}
													fullWidth
													label=""
													aria-readonly={true}
													variant="outlined"
													// onKeyDown={(e) => e.preventDefault()}
													type="datetime-local"
													value={moment(startdate).format('YYYY-MM-DDTHH:mm')}
													onChange={handleDateTimeChange}
													inputProps={{ min: moment().format() }}
													InputLabelProps={{
														shrink: true,
													}}
												/>
											</div>
										</Grid>
										<Grid item xs={12} md={12} className={classes.control}>
											<Typography variant="subtitle2" className={classes.label}>
												{' '}
												End date <span className={classes.danger}>*</span>
											</Typography>
											<TextField
												className={classes.textField}
												fullWidth
												label=""
												variant="outlined"
												type="datetime-local"
												onKeyDown={(e) => e.preventDefault()}
												value={moment(enddate).format('YYYY-MM-DDTHH:mm')}
												onChange={(e) => handleEndDateTimeChange(e)}
												inputProps={{ min: moment().format() }}
												InputLabelProps={{
													shrink: true,
												}}
											/>
											<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
												{endDateError}
											</Box>
										</Grid>
										<Grid item xs={12} md={12} className={classes.control}>
											<Typography variant="subtitle2" className={classes.label}>
												{' '}
												Location <span className={classes.danger}>*</span>
											</Typography>
											<LocationSearch 
												isPrivate={isPrivate} 
												location={text} 
												setLongitude={setLongitude} 
												setLatitude={setLatitude} 
												setLocationError={setLocationError} 
												setLocation={setText} 
											/>
											<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
												{locationError}
											</Box>
										</Grid>
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

										<Grid item xs={12} md={12} className={classes.control}>
											<Typography variant="subtitle2" className={classes.label}>
												{' '}
												Limit To <span className={classes.danger}>*</span>
											</Typography>
											<FormControl className={classes.formControl}>

												<Select
													labelId="dropdown-label"
													id="dropdown"
													value={limitTo}
													onChange={(e) => setLimitTo(e.target.value)}

												>
													{limitToOption?.map(res => (
														<MenuItem style={{ display: 'flex', justifyContent: 'left' }} value={res.value}>{res.label}</MenuItem>))}
												</Select>
											</FormControl>
											<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}></Box>
										</Grid>
										{limitTo === 'Enter Number' && <Grid item xs={12} md={12} className={classes.control}>
											<Typography variant="subtitle2" className={classes.label}>
												{' '}
												Limit To Numer <span className={classes.danger}>*</span>
											</Typography>
											<TextField type="number" size="small" className={classes.textField} fullWidth variant="outlined" value={limitToNumber} onChange={(e) => {
												const numericValue = e.target.value.replace(/[^0-9.]/g, '');
												setLimitToNumber(numericValue);
											}} />
											<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
												{limitToNumberError}
											</Box>
										</Grid>}
										<Grid item xs={12} md={12} className={classes.control} style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', marginTop: '2rem', gap: '0rem' }}>
											<FormControlLabel
												control={
													<Checkbox
														style={{ marginTop: '0.5rem' }}
														checked={!isPrivate == true ? true : false}
														defaultChecked={!isPrivate == true ? true : false}
														onChange={(e) => { setIsPrivate(!isPrivate) }}
														name="isPrivate"
													/>
												}
											/>
											<Typography variant="subtitle2" className={classes.label}>
												{' '}
												Display my location publicly <span className={classes.danger}>*</span>
											</Typography>
										</Grid>
									</Grid>
									<Grid item xs={12} md={12} className={classes.control}>
										<Typography variant="subtitle2" className={classes.label}>
											{' '}
											Description <span className={classes.danger}>*</span>
										</Typography>
										<textarea type="text" size="small" rows={6} style={{ width: '100%' }} className={classes.textField} fullWidth variant="outlined" value={description} onChange={(e) => setDescription(e.target.value)} onKeyUp={onBlursoldQuantity} />
										<Box id="" component="div" fontSize={12} fontWeight={'bold'} className={classes.errorMessage}>
											{summaryError}
										</Box>
									</Grid>

									<Grid item xs={12} md={12} className={classes.control} style={{ textAlign: 'center', justifyContent: 'flex-end', display: 'flex' }}>
										<div style={{ padding: '0 10px' }} />
										<Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => doSaveUser()}>
											Save Changes
										</Button>
									</Grid>
								</Grid>
							</>
						}
						{value == 1 && <Grid  >
							<Grid item xs={24} md={24} className={classes.control}>
								{loading ? (
									<>
										<div id="loader-div">
											<div id="loadings"></div>
										</div>
										<div style={{ height: '30rem' }}></div>
									</>
								) : (
									<MDBDataTableV5 className="customTableResponsive" responsive={true} hover entriesOptions={[15, 30, 50]} entries={15} pagesAmount={4} data={joinEventUser} fullPagination searchTop={false} searchBottom={false} />
								)}
							</Grid>
						</Grid>}
					</SwipeableViews>
				</div>
			</div>
			{openCropModel && (
				<ImageCropModal
					showImage={showImage}
					result={result}
					setResult={setResult}
					onClose={() => {
						setShowImage('')
						setOpenCropModel(false)
					}}
				/>
			)}
		</>
	)
}

export default EventDetailForm

const useStyles = makeStyles((theme) => ({
	danger: {
		color: color.red
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	heading: {
		fontWeight: '600',
		marginBottom: '2%',
		fontSize: '36px',
		color: color.black
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
	loadingwrapper: {
		position: 'fixed',
		height: '100%',
		width: '100%',
		left: '0',
		zIndex: ' 99',
		top: '0'
	},
	dateTimePicker: {
		display: 'flex',
		alignItems: 'center',
	},
	posesImages: {
		width: '6rem',
		height: '6rem',
		objectFit: 'cover',
		borderRadius: '4px'
	},
	image: {
		width: '6rem',
		height: '6rem',
		objectFit: 'cover',
		borderRadius: '4px'
	},
	formControl: {
		width: ' 100%',
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		padding: '0.456rem 0.4rem'
	},
	danger: {
		color: '#f46a6a',
	},
	uploadWrapper: {
		position: 'relative',
		width: '420px',
		height: '200px',
		marginBottom: '0.5rem',
	},
	imgWrapper: {
		position: 'relative',
		marginBottom: '0.5rem',
	},
	showImage: {
		width: '420px',
		height: '200',
		objectFit: 'cover',
		borderRadius: '1rem',
	},
	close: {
		position: 'absolute',
		top: '0.5rem',
		right: '0.5rem',
		cursor: 'pointer',
	},
	upload: {
		padding: '1rem',
		height: '200px',
		border: '0.063rem solid lightGray',
		borderRadius: '1rem',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '0.7rem',
		flexDirection: 'column',
		cursor: 'pointer',
		marginBottom: '0',
	},
	uploadIcon: {
		width: '3rem',
	},
	fileInput: {
		display: ' none !important',
	},
	spacerHeight1: {
		height: '1rem',
	},
}))
