import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react'
import {Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme} from '@material-ui/core'
import {MDBDataTableV5} from 'mdbreact'
import {Visibility} from '@material-ui/icons'
import {color, toastStyle} from '../assets/css/commonStyle'
import {toast} from 'react-toastify'
import DeleteModal from '../components/common/DeleteModal'
import ViewUserDetails from '../components/user/ViewUserDetails'
import {api} from '../api/callAxios'

import SwipeableViews from 'react-swipeable-views'
import {HowToReg} from '@material-ui/icons'
import ImageViewer from 'react-simple-image-viewer'

const ContectUs = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		openViewAllUserPage() {
			setEditUser(null)
		}
	}))

	const classes = useStyles()
	const theme = useTheme()
	const [openRemoveModal, setOpenRemoveModal] = useState(false)
	const [deleteId, setDeleteId] = useState('')
	const [editUser, setEditUser] = useState(null)
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [value, setValue] = useState(0)
	const [previewImageModel, setPreviewImageModel] = useState(false)
	const [previewImage, setPreviewImage] = useState(false)
	const [page, setPage] = useState(1)
	const [deletedReport, setDeletedReport] = useState({})
	const [deleteUserModel, setDeleteModel] = useState(false)
	const [deletedGroup, setDeletedGroup] = useState({})
	const [deleteGroupData, setDeleteGroupData] = useState(false)
	const [users, setUsers] = useState({
		columns: [
			{
				label: 'Event Id',
				field: 'eventId',
				width: 150,
				attributes: {'aria-controls': 'DataTable', 'aria-label': 'Name'}
			},
			{label: 'event Name', field: 'full_name', width: 270},
			{label: 'event description', field: 'email', width: 270},
			{label: 'Action', field: 'action', width: 200, sort: String('disabled')},
			{label: 'View', field: 'view', width: 200, sort: String('disabled')}
		],
		rows: []
	})

	const [reportedUsers, setReportedUsers] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'userId',
				width: 150,
				attributes: {'aria-controls': 'DataTable', 'aria-label': 'Name'}
			},
			{label: 'Full Name', field: 'full_name', width: 270},
			{label: 'Email', field: 'email', width: 270},
			{label: 'Total Reports', field: 'totalreason', width: 270},
			{label: 'Users', field: 'user', width: 270},
			{label: 'Block User', field: 'status', width: 200, sort: String('disabled')}
		],
		rows: []
	})

	const [contect, setcontect] = useState({
		columns: [
			{
				label: 'id',
				field: 'id',
				width: 150,
				attributes: {'aria-controls': 'DataTable', 'aria-label': 'Name'}
			},

			{label: ' First Name', field: 'first_name', width: 270},
			{label: 'Last_name', field: 'last_name', width: 270},
			{label: 'email', field: 'email', width: 200, sort: String('disabled')},
			{label: 'phone', field: 'phone', width: 200, sort: String('disabled')},
			{label: 'subject', field: 'subject', width: 200, sort: String('disabled')},
			{label: 'message', field: 'msg', width: 200, sort: String('disabled')}
		],
		rows: []
	})

	useEffect(() => {
		viewAllcontect()
	}, [value])

	const viewAllcontect = () => {
		setLoading(true)
		api.get(`/user/get_contect_us`)
			.then((response) => {
				if (response.data.success == true) {
					if (response.data.data.data.length > 0) {
						console.log('ressss>>>>>>>>>>', response.data.data)
						setcontect((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})

						response.data.data.data.map((data, index) => {
							createContectUsTable(data)
						})
					}
				}
				setLoading(false)
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const deleteGroup = (id) => {
		setLoading(true)
		api.delete(`/user/group/delete/${id}`)
			.then((response) => {
				setLoading(false)
				setDeleteGroupData(false)
				viewAllcontect()
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const deleteGroupReport = (id) => {
		setLoading(true)
		api.delete(`/admin/delete_group_report/${id}`)
			.then((response) => {
				setLoading(false)
				setDeleteModel(false)
				viewAllcontect()
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const deleteReportModel = (id) => {
		setDeletedReport({id: id})
		setDeleteModel(true)
	}

	const deleteGroupModel = (id) => {
		setDeletedGroup({id: id})
		setDeleteGroupData(true)
	}

	const createContectUsTable = (row) => {
		let _obj = {
			id: row.id,
			first_name: row.first_name,
			last_name: row.last_name,
			email: row.email,
			phone: row.phone,
			subject: row.subject,
			msg: row.message
		}
		setcontect((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const goBackAllUser = () => {
		setEditUser(null)
	}

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleChangeIndex = (index) => {
		setValue(index)
	}

	const TabPanel = (props) => {
		const {children, value, index, ...other} = props
		return (
			<div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
				{value === index && (
					<Box p={3}>
						<Typography style={{position: 'relative'}}>{children}</Typography>
					</Box>
				)}
			</div>
		)
	}

	return (
		<>
			{editUser == null ? (
				<>
					<div className={classes.root}>
						<div className={classes.header}>
							<Typography variant="h4" className={classes.heading}>
								Contact Us
							</Typography>
							<Typography variant="h6" className={classes.heading}>
								{/* <Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => exportToCSV()}>
                  Export
                </Button> */}
							</Typography>
						</div>
						<div className={classes.root1}>
							<AppBar position="static" color="default">
								<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
									{/* <Tab className={classes.tabHeading} label="Pending to approve Users" icon={<HowToReg className={classes.tabIcon} />} /> */}
									<Tab className={classes.tabHeading} label=" Contact Us" icon={<HowToReg className={classes.tabIcon} />} />
									{/* <Tab className={classes.tabHeading} label="event" icon={<HowToReg className={classes.tabIcon} />} /> */}
								</Tabs>
							</AppBar>
							<SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
								<TabPanel value={value} index={0} dir={theme.direction}>
									{/* <div className={classes.root}>
										<Grid item xs={12} md={3}>
											<TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={(e) => doSearch(e)} />
										</Grid>
									</div> */}
									{loading ? (
										<>
											<div id="loader-div">
												<div id="loadings"></div>
											</div>
											<div style={{height: '30rem'}}></div>
										</>
									) : (
										<MDBDataTableV5
											className="customTableResponsive"
											responsive={true}
											hover
											entriesOptions={[15, 30, 50]}
											entries={15}
											pagesAmount={4}
											data={contect}
											searchTop={false}
											searchBottom={false}
											onPageChange={(e) => console.log('previewImage====', e)}
										/>
									)}
								</TabPanel>

								<TabPanel value={value} index={1} dir={theme.direction}>
									{/* <div className={classes.root}>
										<Grid container>
											<Grid item xs={12} md={3}>
												<TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={doSearch} />
											</Grid>
										</Grid>
									</div> */}
									{loading ? (
										<>
											<div id="loader-div">
												<div id="loadings"></div>
											</div>
											<div style={{height: '30rem'}}></div>
										</>
									) : (
										<MDBDataTableV5 className="customTableResponsive" responsive={true} hover entriesOptions={[15, 30, 50]} entries={15} pagesAmount={4} data={users} fullPagination searchTop={false} searchBottom={false} />
									)}
								</TabPanel>
								<TabPanel value={value} index={2} dir={theme.direction}>
									{loading ? (
										<>
											<div id="loader-div" style={{width: '88%'}}>
												<div id="loadings"></div>
											</div>
											<div style={{height: '30rem'}}></div>
										</>
									) : (
										<MDBDataTableV5 className="customTableResponsive" responsive={true} hover entriesOptions={[15, 30, 50]} entries={15} pagesAmount={4} data={reportedUsers} fullPagination searchTop={false} searchBottom={false} />
									)}
								</TabPanel>
							</SwipeableViews>
						</div>
					</div>
				</>
			) : (
				<ViewUserDetails user={editUser} goBackAllUser={goBackAllUser} />
			)}
			{/* <DeleteModal
				open={deleteModel}
				close={() => setDeleteModel(false)}
				title={deletedReport.title === 'unblock' ? 'UnBlock User' : 'Block User'}
				message={`Do you really want to ${deletedReport.title === 'unblock' ? 'UnBlock User' : 'Block User'}? You cannot undo this action.`}
				deleteButtonText={deletedReport.title === 'unblock' ? 'UnBlock User' : 'Block User'}
				deleteAction={() => {
					blockUser(deletedReport?.id, deletedReport.title)
				}}
			/> */}

			{previewImageModel && (
				<ImageViewer
					src={[previewImage]}
					// currentIndex={ currentImage }
					disableScroll={false}
					closeOnClickOutside={true}
					onClose={() => {
						setPreviewImageModel(false)
						setPreviewImage('')
					}}
				/>
			)}
			<DeleteModal
				open={deleteGroupData}
				close={() => setDeleteGroupData(false)}
				title="Delete group"
				message="Do you really want to delete product? You cannot undo this action."
				deleteButtonText="Delete product"
				deleteAction={() => deleteGroup(deletedGroup.id)}
			/>
			<DeleteModal
				open={deleteUserModel}
				close={() => setDeleteModel(false)}
				title="Delete report"
				message="Do you really want to delete report? You cannot undo this action."
				deleteButtonText="Delete report"
				deleteAction={() => deleteGroupReport(deletedReport.id)}
			/>
		</>
	)
})

export default ContectUs

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	root1: {
		backgroundColor: theme.palette.background.paper
	},
	heading: {
		fontWeight: '600',
		marginBottom: '2%',
		fontSize: '36px',
		color: color.black
	},
	icon: {
		fontSize: '22px !important'
	},
	viewButton: {
		backgroundColor: color.black,
		width: '35px',
		height: '32px',
		cursor: 'pointer',
		borderRadius: '4px'
	},
	removeButton: {
		backgroundColor: color.red,
		width: '35px',
		height: '32px',
		cursor: 'pointer'
	},
	textField: {
		marginTop: '15px',
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		height: '45px',
		marginBottom: '0.3rem'
	},
	saveButton: {
		marginTop: '10px',
		backgroundColor: color.seaGreen,
		color: color.white,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: color.red
		}
	},
	image: {
		width: '2.0rem',
		height: '2.0rem',
		borderRadius: '50%',
		marginRight: '0.2rem'
	},
	flexWrapper: {
		'&:not(:last-child)': {
			marginBottom: '0.3rem'
		}
	},
	flexPosesWrapper: {
		display: 'flex',
		flexWrap: 'wrap',
		'&:not(:last-child)': {
			marginBottom: '0.3rem'
		}
	},
	flex: {
		display: 'flex',
		alignItems: 'center'
	},
	userName: {
		marginBottom: '0.3rem'
	},
	reasonContent: {
		marginLeft: '2.2rem',
		fontSize: '0.775rem'
	},
	posesImages: {
		width: '6rem',
		height: '6rem',
		objectFit: 'cover',
		borderRadius: '4px'
	}
}))
