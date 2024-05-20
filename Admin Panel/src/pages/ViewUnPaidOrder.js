import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme } from '@material-ui/core'
import { MDBDataTableV5 } from 'mdbreact'
import { Visibility } from '@material-ui/icons'
import { color, toastStyle } from '../assets/css/commonStyle'
import { toast } from 'react-toastify'
import DeleteModal from '../components/common/DeleteModal'
import ViewUserDetails from '../components/user/ViewUserDetails'
import { api } from '../api/callAxios'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import SwipeableViews from 'react-swipeable-views'
import { HowToReg } from '@material-ui/icons'
import ImageViewer from 'react-simple-image-viewer'

const ViewUnPaidOrder = forwardRef((props, ref) => {
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
	const [deleteModel, setDeleteModel] = useState(false)
	const [previewImageModel, setPreviewImageModel] = useState(false)
	const [previewImage, setPreviewImage] = useState(false)
	const [page, setPage] = useState(1)
	const [deletedReport, setDeletedReport] = useState({})
	const [users, setUsers] = useState({
		columns: [
			{
				label: 'Order Date ',
				field: 'order_date',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Date of Delivery', field: 'delivery_info', width: 270 },
			{ label: 'Seller', field: 'seller', width: 270 },
			{ label: 'Sold to', field: 'sold_to', width: 200, sort: String('disabled') },
			{ label: 'Order No', field: 'Order_no', width: 200, sort: String('disabled') },
			{ label: 'Total Order', field: 'total_order', width: 200, sort: String('disabled') },
			{ label: 'Gamba share', field: 'gamba_share', width: 200, sort: String('disabled') },
			{ label: 'Fees Dues', field: 'fees_dues', width: 200, sort: String('disabled') },
			{ label: 'View', field: 'View', width: 200, sort: String('disabled') }
		],
		rows: [
			{
				order_date: '25/4/2023',
				delivery_info: '26/4/2023',
				seller: 'baqar',
				sold_to: 'ahad',
				Order_no: 88877,
				total_order: '23.8',
				gamba_share: '15%',
				fees_dues: 5.34,
				paid: 'ggggg',
				View: (
					<Avatar variant="square" className={classes.viewButton}>
						<Visibility className={classes.icon} />
					</Avatar>
				)
			}
		]
	})

	const [reportedUsers, setReportedUsers] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'userId',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Full Name', field: 'full_name', width: 270 },
			{ label: 'Email', field: 'email', width: 270 },
			{ label: 'Total Reports', field: 'totalreason', width: 270 },
			{ label: 'Users', field: 'user', width: 270 },
			{ label: 'Block User', field: 'status', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	const [pendingUsers, setPendingUsers] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'userId',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Poses Photos', field: 'poses_photos', width: 270 },
			{ label: 'Email', field: 'email', width: 270 },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	useEffect(() => {
		if (value === 0) {
			viewAllPaidOrder()
		}

		if (value === 2) {
			AllReportedUser()
		}
	}, [value])

	const viewAllPendingToApprovelUsers = () => {
		setLoading(true)
		api.get(`/admin/view_all_pending_users`)
			.then((response) => {
				if (response.data.success === true) {
					if (response.data.data.all_users.length > 0) {
						setPendingUsers((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})

						response.data.data.all_users.map((data, index) => {
							createPendingUserTable(data)
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

	const viewAllPaidOrder = () => {
		setLoading(true)
		api.get(`/admin/`)
			.then((response) => {
				if (response.data.success === true) {
					if (response.data.data.all_users.length > 0) {
						setUsers((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						response.data.data.all_users.map((data, index) => {
							createPaidOrderTable(data)
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

	const doVerifyUser = (id) => {
		setLoading(true)
		api.post(`/admin/approve_user/${id}`)
			.then((response) => {
				setLoading(false)
				viewAllPendingToApprovelUsers()
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const AllReportedUser = () => {
		setLoading(true)
		api.get(`/admin/all_reported_users`)
			.then((response) => {
				if (response.data.success === true) {
					if (response.data.data.length > 0) {
						setReportedUsers((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						response.data.data.map((data, index) => {
							createReportedUserTable(data)
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

	const deleteUser = () => {
		api.post(`/admin/delete_user`, {
			u_id: deleteId
		})
			.then((response) => {
				if (response.data.success) {
					toast.success('User deleted successfully', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					setOpenRemoveModal(false)
					// viewAllPaidOrder();
				} else {
					toast.error('Something went wrong. Please try again later.', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
				}
			})
			.catch(function (error) {
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const viewUser = (row) => {
		setEditUser(row)
	}

	const handleRemoveModalClose = () => {
		setOpenRemoveModal(false)
	}

	const doSearch = (e) => {
		setSearch(e.target.value)
		console.log('search', e.target.value)
		if (e.target.value.length > 1) {
			api.post(`/user/search_by_name`, {
				u_id: 1,
				name: e.target.value
			})
				.then((response) => {
					if (response.data.success === true) {
						if (value === 1) {
							setUsers((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
						}
						if (value === 0) {
							setPendingUsers((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
						}
						if (response.data.data.search_by_name.length > 0 && value === 1) {
							response.data.data.search_by_name.map((data, index) => {
								createPaidOrderTable(data)
							})
						} else if (response.data.data.search_by_name.length > 0 && value === 0) {
							response.data.data.search_by_name.map((data, index) => {
								createPendingUserTable(data)
							})
						}
					}
				})
				.catch(function (error) {
					toast.error('Something went wrong. Please try again later.', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
				})
		}
		if (e.target.value.length === 0) {
			console.log('enter 2')
			if (value === 0) {
				viewAllPendingToApprovelUsers()
			} else {
				viewAllPaidOrder()
			}
		}
	}

	const createPaidOrderTable = (row) => {
		// let _obj = {
		// 	userId: row.id,
		// 	phone: row.phone,
		// 	full_name: (
		// 		<div>
		// 			<img className={classes.image} src={row.image?.length ? `${process.env.REACT_APP_IMAGE_URL}/${row.image}` : `${process.env.REACT_APP_IMAGE_URL}/palz.png`} alt="" /> &nbsp;
		// 			{row.first_name}
		// 		</div>
		// 	),
		// 	email: row.email,
		// 	action: (
		// 		<Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => deleteReportModel(row.id, row.blocked ? 'unblock' : 'block')}>
		// 			{row.blocked ? 'unBlock' : 'delete'}
		// 		</Button>
		// 	),
		// 	view: (
		// 		<Avatar variant="square" onClick={() => viewUser(row)} className={classes.viewButton}>
		// 			<Visibility className={classes.icon} />
		// 		</Avatar>
		// 	)
		// }
		// setUsers((preValue) => {
		// 	return {
		// 		columns: [...preValue.columns],
		// 		rows: [...preValue.rows, _obj]
		// 	}
		// })
	}

	const deleteReportModel = (id, title) => {
		setDeletedReport({ id: id, title: title })
		setDeleteModel(true)
	}

	const createReportedUserTable = (row) => {
		let _obj = {
			userId: row.id,
			full_name: row.full_name,
			email: row.email,
			totalreason: row.count,
			user: row.users.map((e) => {
				return (
					<>
						<div className={classes.flexWrapper}>
							<div className={classes.flex}>
								<img className={classes.image} src={e.profile_image ? `${process.env.REACT_APP_IMAGE_URL}/${e.profile_image}` : `${process.env.REACT_APP_IMAGE_URL}/palz.png`} alt="" />
								<div className={classes.userName}>{e.user.user_name ? e.user.user_name : '-'}</div>
								<br />
							</div>
							{e.reason && <div className={classes.reasonContent}>{e.reason}</div>}
						</div>
					</>
				)
			}),

			status: (
				<Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => deleteReportModel(row.id, row.blocked ? 'unblock' : 'block')}>
					{row.blocked ? 'unBlock' : 'Block'}
				</Button>
			)
		}
		setReportedUsers((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createPendingUserTable = (row) => {
		let _obj = {
			userId: row.id,
			poses_photos: (
				<div className={classes.flexPosesWrapper}>
					{' '}
					{row.poses_photos?.length
						? row.poses_photos?.map((e) => {
							return (
								<>
									<div
										className={classes.flex}
										onClick={() => {
											setPreviewImage(`${process.env.REACT_APP_IMAGE_URL}/${e}`)
											setPreviewImageModel(true)
										}}>
										<img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${e}`} alt="" />
									</div>
								</>
							)
						})
						: '-'}
				</div>
			),
			email: row.email,
			action: (
				<Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => doVerifyUser(row.id)}>
					Verify User
				</Button>
			)
		}
		setPendingUsers((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const goBackAllUser = () => {
		setEditUser(null)
		viewAllPaidOrder()
	}

	const exportToCSV = async () => {
		return api
			.get(`/admin/export_all_users`)
			.then(async (response) => {
				let excelData = []
				if (response.data.success === true) {
					if (response.data.data.all_users.length > 0) {
						response.data.data.all_users.map((data, index) => {
							excelData.push({ Serial_Number: index + 1, FirstName: data.first_name, LastName: data.last_name, Phone: data.phone })
						})
					}
					await prepareExcel(excelData)
				}
				return true
			})
			.catch(function (error) {
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
				return false
			})
	}

	const prepareExcel = async (excelData) => {
		const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
		const fileExtension = '.xlsx'

		const ws = XLSX.utils.json_to_sheet(excelData)
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
		const data = new Blob([excelBuffer], { type: fileType })
		FileSaver.saveAs(data, 'palz_users' + fileExtension)
		return true
	}

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const handleChangeIndex = (index) => {
		setValue(index)
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

	const blockUser = (id, title) => {
		api.post(`/admin/${title === 'unblock' ? 'unblock_user' : 'block_user'}`, { f_id: id })
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message, {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					// setOpenAddNewModal(false);
					if (value === 1) {
						viewAllPaidOrder()
					} else {
						AllReportedUser()
					}

					setDeleteModel(false)
				} else {
					setDeleteModel(false)
					toast.error(response.data.message, {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
				}
			})
			.catch(function (error) {
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	return (
		<>
			{editUser === null ? (
				<>
					<div className={classes.root}>
						<div className={classes.header}>
							<Typography variant="h4" className={classes.heading}>
								Unpaid Orders
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
									<Tab className={classes.tabHeading} label="Unpaid Order" icon={<HowToReg className={classes.tabIcon} />} />
									{/* <Tab className={classes.tabHeading} label="Reported Users" icon={<HowToReg className={classes.tabIcon} />} /> */}
								</Tabs>
							</AppBar>
							<SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
								<TabPanel value={value} index={0} dir={theme.direction}>
									<div className={classes.root}>
										<Grid item xs={12} md={3}>
											{/* <TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={(e) => doSearch(e)} /> */}
										</Grid>
									</div>
									<DeleteModal
										open={openRemoveModal}
										close={handleRemoveModalClose}
										title="Remove User"
										message="Do you really want to remove user? You cannot undo this action."
										deleteButtonText="Remove User"
										deleteAction={deleteUser}
									/>
									{loading ? (
										<>
											<div id="loader-div">
												<div id="loadings"></div>
											</div>
											<div style={{ height: '30rem' }}></div>
										</>
									) : (
										<MDBDataTableV5
											className="customTableResponsive"
											responsive={true}
											hover
											entriesOptions={[15, 30, 50]}
											entries={15}
											pagesAmount={4}
											data={users}
											searchTop={false}
											searchBottom={false}
											onPageChange={(e) => console.log('previewImage====', e)}
										/>
									)}
								</TabPanel>

								<TabPanel value={value} index={1} dir={theme.direction}>
									<div className={classes.root}>
										<Grid container>
											<Grid item xs={12} md={3}>
												<TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={doSearch} />
											</Grid>
										</Grid>
									</div>
									<DeleteModal
										open={openRemoveModal}
										close={handleRemoveModalClose}
										title="Remove User"
										message="Do you really want to remove user? You cannot undo this action."
										deleteButtonText="Remove User"
										deleteAction={deleteUser}
									/>
									{loading ? (
										<>
											<div id="loader-div">
												<div id="loadings"></div>
											</div>
											<div style={{ height: '30rem' }}></div>
										</>
									) : (
										<MDBDataTableV5 className="customTableResponsive" responsive={true} hover entriesOptions={[15, 30, 50]} entries={15} pagesAmount={4} data={users} fullPagination searchTop={false} searchBottom={false} />
									)}
								</TabPanel>
							</SwipeableViews>
						</div>
					</div>
				</>
			) : (
				<ViewUserDetails user={editUser} goBackAllUser={goBackAllUser} />
			)}
			<DeleteModal
				open={deleteModel}
				close={() => setDeleteModel(false)}
				title={deletedReport.title === 'unblock' ? 'UnBlock User' : 'Block User'}
				message={`Do you really want to ${deletedReport.title === 'unblock' ? 'UnBlock User' : 'Block User'}? You cannot undo this action.`}
				deleteButtonText={deletedReport.title === 'unblock' ? 'UnBlock User' : 'Block User'}
				deleteAction={() => {
					blockUser(deletedReport?.id, deletedReport.title)
				}}
			/>

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
		</>
	)
})

export default ViewUnPaidOrder

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
		borderRadius: "4px",
		boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
	},
	removeButton: {
		backgroundColor: color.red,
		width: '35px',
		height: '32px',
		cursor: 'pointer',
		borderRadius: "4px",
		boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
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
