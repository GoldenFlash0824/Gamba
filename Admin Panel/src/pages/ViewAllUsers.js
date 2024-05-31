import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme } from '@material-ui/core'
import { MDBDataTableV5 } from 'mdbreact'
import { Search, SearchOutlined, SearchRounded, SearchSharp, Visibility } from '@material-ui/icons'
import { color, letterColors, toastStyle } from '../assets/css/commonStyle'
import { toast } from 'react-toastify'
import DeleteModal from '../components/common/DeleteModal'
import ViewUserDetails from '../components/user/ViewUserDetails'
import { api } from '../api/callAxios'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import SwipeableViews from 'react-swipeable-views'
import { HowToReg } from '@material-ui/icons'
import ImageViewer from 'react-simple-image-viewer'
import moment from 'moment'
const ViewAllUser = forwardRef((props, ref) => {
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
	const [disableuserModel, setdisableuserModel] = useState(false)
	const [previewImageModel, setPreviewImageModel] = useState(false)
	const [previewImage, setPreviewImage] = useState(false)

	const [deletedReport, setDeletedReport] = useState({})
	const [enable, setenable] = useState({})

	const [disable, setdisable] = useState({})
	const [userCount, setuserCount] = useState(0)
	const [disablecount, setdisablecount] = useState(0)
	const [deletedCount, setDeletedecount] = useState(0)
	const [blockuserCount, setblockuserCount] = useState(0)
	const [unblockModel, setunblockModel] = useState(false)
	const [enableModel, setenableModel] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	const [remaining, setRemaining] = useState(0)
	const [users, setUsers] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'userId',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Register Date', field: 'sign_up_date', width: 270 },
			{ label: 'Full Name', field: 'full_name', width: 270 },
			{ label: 'Email', field: 'email', width: 270 },
			{ label: 'Phone', field: 'phone', width: 200, sort: String('disabled') },
			{ label: 'State', field: 'state', width: 200, sort: String('disabled') },
			{ label: 'City', field: 'city', width: 200, sort: String('disabled') },
			// { label: 'Zip', field: 'zip', width: 200, sort: String('disabled') },
			{ label: 'Edit', field: 'view', width: 200, sort: String('disabled') },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') },
		],
		rows: []
	})

	const [deletedUsers, setDeletedUsers] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'userId',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Delete Account Date', field: 'deleteDate', width: 270 },
			{ label: 'Full Name', field: 'full_name', width: 270 },
			{ label: 'Email', field: 'email', width: 270 },
			{ label: 'Phone', field: 'phone', width: 200, sort: String('disabled') },
			{ label: 'Delete Reason', field: 'reason', width: 200, sort: String('disabled') },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') },
		],
		rows: []
	})

	const [reportedUsers, setReportedUsers] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'userId',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Sign Up Date', field: 'sign_up_date', width: 270 },
			{ label: 'Full Name', field: 'full_name', width: 270 },
			{ label: 'Email', field: 'email', width: 270 },
			{ label: 'Phone', field: 'phone', width: 200, sort: String('disabled') },
			{ label: 'State', field: 'state', width: 200, sort: String('disabled') },
			{ label: 'City', field: 'city', width: 200, sort: String('disabled') },
			{ label: 'Zip', field: 'zip', width: 200, sort: String('disabled') },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	const [disableuser, setdisableuser] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'userId',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Register Date', field: 'sign_up_date', width: 270 },
			{ label: 'Full Name', field: 'full_name', width: 270 },
			{ label: 'Email', field: 'email', width: 270 },
			{ label: 'Phone', field: 'phone', width: 200, sort: String('disabled') },
			{ label: 'State', field: 'state', width: 200, sort: String('disabled') },
			{ label: 'City', field: 'city', width: 200, sort: String('disabled') },
			{ label: 'Zip', field: 'zip', width: 200, sort: String('disabled') },
			{ label: 'Edit', field: 'view', width: 200, sort: String('disabled') },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	useEffect(() => {
		if (value === 0) {
			viewAllUser()
		}

		if (value === 1) {
			viewAllBlockUser()
		}
		if (value === 2) {
			viewAllDisableUser()
		}
		if (value === 3) {
			viewAllDeletedUser()
		}
	}, [value, page])

	//
	const viewAllDeletedUser = () => {
		setLoading(true)
		api.get(`/admin/view_all_deleted_user?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					if (response.data.data.deleted_user?.length >= 0) {
						setDeletedUsers((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						setTotalPage(parseInt(parseInt(response.data?.data?.count) / 20) + 1)
						setRemaining(response.data?.data?.remaining)
						response.data?.data?.deleted_user?.map((data, index) => {
							createDeleetdUserTable(data)
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

	const viewAllDisableUser = () => {
		setLoading(true)
		api.get(`/admin/get_all_disable_user?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					console.log('disable user', response.data.data.data.disable_user)
					if (response.data.data.data.disable_user.length >= 0) {
						console.log('disable user', response)
						setdisableuser((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						setTotalPage(parseInt(parseInt(response.data?.data?.data?.count) / 20) + 1)
						setRemaining(response.data?.data?.data?.remaining)
						response.data?.data?.data?.disable_user?.map((data, index) => {
							createDisableUserTable(data)
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

	const viewAllUser = () => {
		setLoading(true)
		api.get(`/admin/view_all_user?page=${page}`)
			.then((response) => {
				console.log('useruseruser', response.data.data.all_users.all_users)
				if (response.data.success === true) {
					setUsers((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					if (response.data.data.all_users.all_users.length >= 0) {
						setuserCount(response.data.data.all_users.all_user_count)
						console.log(response.data.data?.count)
						setblockuserCount(response.data.data.all_users.block_user_count)
						setdisablecount(response.data.data.all_users.disable_user_count)
						setDeletedecount(response.data.data.all_users.deleted_user_count)
						setTotalPage(parseInt(parseInt(response.data.data?.all_users?.count) / 15) + 1)
						setRemaining(response.data.data?.all_users?.remaining)
						console.log('alluserdatatatata', response.data.data.all_users.all_users)
						response.data.data.all_users.all_users.map((data, index) => {
							createUserTable(data)
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
	const viewAllBlockUser = () => {
		console.log('call')
		setLoading(true)
		api.get(`/admin/all_block_user?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					console.log('response.dataresponse.data', response.data.data)
					if (response.data.data.block_user.length >= 0) {
						setReportedUsers((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})

						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)

						response.data.data.block_user.map((data, index) => {
							createBlockUserTable(data)
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
		api.delete(`/admin/delete_user/${deleteId}`)
			.then((response) => {
				if (response.data.success) {
					toast.success('User deleted successfully', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					setOpenRemoveModal(false)
					if (value === 3) {
						viewAllDeletedUser()
					} else {
						viewAllUser();

					}
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

	const doSearch = async (e) => {
		setSearch(e.target.value)
		if (value === 0) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/get_search_user`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success === true) {
							if (e.target.value === response.data.data?.query) {
								setUsers((preValue) => {
									return {
										columns: [...preValue.columns],
										rows: []
									}
								})
								response.data.data?.users.map((data, index) => {
									createUserTable(data)
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
					viewAllUser()
				}
			}
		}

		if (value === 1) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/block_user_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success === true) {
							if (e.target.value === response.data.data?.query) {
								setReportedUsers((preValue) => {
									return {
										columns: [...preValue.columns],
										rows: []
									}
								})
								response.data.data.user.map((data, index) => {
									createBlockUserTable(data)
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
				if (value === 1) {
					viewAllBlockUser()
				}
			}
		}
		if (value === 2) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/disable_user_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success === true) {
							if (e.target.value === response.data.data?.query) {
								setdisableuser((preValue) => {
									return {
										columns: [...preValue.columns],
										rows: []
									}
								})
								response.data.data.user.map((data, index) => {
									createDisableUserTable(data)
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
				if (value === 2) {
					viewAllDisableUser()
				}
			}
		}
	}

	const createUserTable = async (row) => {
		let city = ''
		let state = ''
		const id = row.ref_id || row.stripe_customer_id || row.id
		if (row?.address !== null) {
			let new_address = row?.address.split(',')
			city = new_address[0]
			state = new_address[1]
			console.log('city', city)
		}
		let _obj = {
			userId: id,
			phone: row.phone,
			sign_up_date: new Date(row.createdAt).toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
				year: '2-digit'
			}),
			// work
			full_name: (
				<div className={classes.flexed}>
					<div ><img className={classes.image} src={`${process.env.REACT_APP_IMAGE_URL}/${row.image ? row?.image : row?.first_name.toLowerCase()[0] + '.png'}`} alt="" /></div>
					{`${row.first_name}${' '}${row.last_name}`}
				</div>
			),
			email: row.email,
			action: (
				<div className={classes.flex} style={{ gap: '0.5rem' }}>
					<Button color="secondary" className={classes.blockButton} onClick={() => row?.is_block ? unBlockUser(row.id) : deleteReportModel(row.id)}>
						{row.is_block ? 'unBlock' : 'Block'}
					</Button>
					<Button color="secondary" className={classes.blockButton} onClick={() => row.disable ? enableUser(row.id) : disableModel(row.id)}>
						{row.disable ? 'Enable' : 'Disable'}
					</Button>
					<Button color="secondary" className={classes.saveButton} onClick={() => { setOpenRemoveModal(true); setDeleteId(row.id) }}>
						{'Delete'}
					</Button>
				</div>
			),
			view: (
				<div className={classes.flex}>
					<Avatar variant="square" onClick={() => { setSearch(''); viewUser(row) }} color="secondary" className={classes.viewButton}>
						<Visibility className={classes.view} />
					</Avatar>
				</div>
			),

			city: city,
			state: state

			//WORK
		}
		setUsers((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createBlockUserTable = (row) => {
		let city
		let state
		const id = row.ref_id || row.stripe_customer_id || row.id
		if (row?.address !== null) {
			let new_address = row?.address.split(',')
			city = new_address[0]
			state = new_address[1]
		}

		let _obj = {
			userId: id,
			phone: row.phone,
			sign_up_date: new Date(row.createdAt).toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
				year: 'numeric'
			}),

			full_name: (
				<div className={classes.flexed}>
					<div className={classes.profile}>{row.image?.length ? <img className={classes.image} src={`${process.env.REACT_APP_IMAGE_URL}/${row.image}`} alt="" /> : <h6 className={classes.text}>{row.first_name[0]}</h6>}</div>
					{`${row.first_name}${' '}${row.last_name}`}
				</div>
			),
			email: row.email,
			action: (
				<Button color="secondary" className={classes.saveButton} onClick={() => unBlockUser(row.id)}>
					{row.blocked ? 'unBlock' : 'unblock'}
				</Button>
			),
			view: (
				<Avatar variant="square" onClick={() => viewUser(row)} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			city: city,
			state: state
		}
		setReportedUsers((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const deleteReportModel = (id) => {
		setDeletedReport({ id: id })
		setDeleteModel(true)
	}

	const disableModel = (id) => {
		setdisable({ id: id }) //aaa
		setdisableuserModel(true)
	}
	const unBlockUser = (id) => {
		setDeletedReport({ id: id })
		setunblockModel(true)
	}

	const enableUser = (id) => {
		setenable({ id: id })
		setenableModel(true)
	}

	const createDeleetdUserTable = (row) => {

		const id = row.ref_id || row.stripe_customer_id || row.id
		let _obj = {
			userId: id,
			full_name: row?.first_name ? row.first_name + row.last_name : '-',
			email: row.email,
			phone: row.phone,
			reason: row?.delete_reason,
			deleteDate: moment(row?.updatedAt).format('MM/DD/YY'),

			action: (
				<Button color="secondary" className={classes.saveButton} onClick={() => { setOpenRemoveModal(true); setDeleteId(row.id) }}>
					{'Delete'}
				</Button>
			),
		}
		setDeletedUsers((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createDisableUserTable = (row) => {
		let city = ''
		let state = ''
		const id = row.ref_id || row.stripe_customer_id || row.id
		if (row?.address !== null) {
			let new_address = row?.address.split(',')
			city = new_address[0]
			state = new_address[1]
		}

		let _obj = {
			userId: id,
			phone: row.phone,
			sign_up_date: new Date(row.createdAt).toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
				year: 'numeric'
			}),

			full_name: (
				<div className={classes.flexed}>
					<div ><img className={classes.image} src={`${process.env.REACT_APP_IMAGE_URL}/${row.image ? row?.image : row?.first_name.toLowerCase()[0] + '.png'}`} alt="" /></div>
					{`${row.first_name}${' '}${row.last_name}`}
				</div>
			),
			email: row.email,
			action: (
				<Button color="secondary" className={classes.saveButton} onClick={() => enableUser(row.id)}>
					{row.blocked ? 'unBlock' : 'Enable'}
				</Button>
			),
			view: (
				<Avatar variant="square" onClick={() => viewUser(row)} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			city: city,
			state: state
		}
		setdisableuser((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const goBackAllUser = () => {
		setEditUser(null)
		viewAllUser()
	}

	const handleChange = (event, newValue) => {
		setPage(1)
		setValue(newValue)
		setSearch('')
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
		api.post(`/admin/block_user`, {
			u_id: id
		})
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message, {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					viewAllUser()
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
	const DisableUser = (id) => {
		api.post(`/admin/disable_user_account_admin`, {
			u_id: id
		})
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message, {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					viewAllUser()
					setdisableuserModel(false)
				} else {
					setdisableuserModel(false)
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

	const enableUserAccount = (id) => {
		api.post(`/admin/enable_user`, {
			u_id: id
		})
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message, {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					setenableModel(false)
					viewAllDisableUser()
					viewAllUser()
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

	const unblockUser = (id) => {
		api.post(`/admin/unblock_user`, {
			u_id: id
		})
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message, {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					setunblockModel(false)
					viewAllBlockUser()
					viewAllUser()
					// if (value == 1) {
					// 	viewAllUser()
					// } else {
					// 	AllReportedUser()
					// }

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
						<div className='user-search'>
							<div className={classes.header}>
								<Typography variant="h4" className={classes.heading}>
									Users
								</Typography>
								<Typography variant="h6" className={classes.heading}>
									{/* <Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => exportToCSV()}>
                  Export
                </Button> */}
								</Typography>
							</div>
							<div className={classes.root}>
								{value != 3 && <Grid style={{ width: '350px' }}>
									<TextField className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={(e) => doSearch(e)} />
									<SearchSharp className={classes.inputSearch} />
								</Grid>}
							</div>
						</div>
						<br></br>
						<div className={classes.root1}>
							<AppBar position="static" color="default">
								<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
									{/* <Tab className={classes.tabHeading} label="Pending to approve Users" icon={<HowToReg className={classes.tabIcon} />} /> */}
									<Tab className={classes.tabHeading} label={`Users (${userCount})`} icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label={`Block Users (${blockuserCount})`} icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label={`Disable Users (${disablecount}) `} icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label={`Deleted Users (${deletedCount}) `} icon={<HowToReg className={classes.tabIcon} />} />
								</Tabs>
							</AppBar>
							<SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
								<TabPanel id="resturantTable" value={value} index={0} dir={theme.direction}>
									<div className={classes.root}>
										<Grid item xs={12} md={3}>
											{/* <TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={(e) => doSearch(e)} /> */}
										</Grid>
									</div>
									<DeleteModal
										open={openRemoveModal}
										close={handleRemoveModalClose}
										title="Delete User"
										message="Do you really want to delete this user? You cannot undo this action."
										deleteButtonText="Delete"
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
										<>
											<MDBDataTableV5
												className="customTableResponsive"
												responsive={true}
												hover
												entriesOptions={[15, 30, 50, 100, 200]}
												entries={200}
												pagesAmount={4}
												data={users}
												searchTop={false}
												paging={false}
												searchBottom={false}
												btn={false}
											/>
											<nav aria-label="Page navigation" style={{ display: 'flex', justifyContent: 'flex-end' }}>
												<ul className="pagination">
													<li className="page-item" onClick={() => page > 1 && setPage(page - 1)}>
														<div className="page-link" style={{ cursor: page > 1 && 'pointer', opacity: page === 1 && 0.4 }}>
															<i className="fas fa-arrow-left"></i>
														</div>
													</li>
													<li className="page-item">
														<div className="page-link">{page}</div>
													</li>
													<li className="page-item">
														<div className="page-link">of</div>
													</li>

													<li className="page-item">
														<div className="page-link">{totalPage}</div>
													</li>
													<li className="page-item" onClick={() => remaining > 0 && setPage(page + 1)}>
														<div className="page-link" style={{ cursor: remaining > 0 && 'pointer', opacity: remaining === 0 && 0.4 }}>
															<i className="fas fa-arrow-right"></i>
														</div>
													</li>
												</ul>
											</nav>
										</>
									)}
								</TabPanel>

								<TabPanel id="resturantTable" value={value} index={1} dir={theme.direction}>
									{/* <div className={classes.root}>
										<Grid container>
											<Grid item xs={12} md={3}>
												<TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={doSearch} />
											</Grid>
										</Grid>
									</div> */}
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
										<>
											<MDBDataTableV5
												className="customTableResponsive"
												responsive={true}
												hover
												entriesOptions={[15, 30, 50, 100]}
												entries={100}
												pagesAmount={4}
												data={reportedUsers}
												fullPagination
												searchTop={false}
												paging={false}
												// onSearch={(e) => console.log('=========', doSearch(e))}
												searchBottom={false}
												// noBottomColumns={false}
												btn={false}
											/>
											<nav aria-label="Page navigation" style={{ display: 'flex', justifyContent: 'flex-end' }}>
												<ul className="pagination">
													<li className="page-item" onClick={() => page > 1 && setPage(page - 1)}>
														<div className="page-link" style={{ cursor: page > 1 && 'pointer', opacity: page === 1 && 0.4 }}>
															<i className="fas fa-arrow-left"></i>
														</div>
													</li>
													<li className="page-item">
														<div className="page-link">{page}</div>
													</li>
													<li className="page-item">
														<div className="page-link">of</div>
													</li>

													<li className="page-item">
														<div className="page-link">{totalPage}</div>
													</li>
													<li className="page-item" onClick={() => remaining > 0 && setPage(page + 1)}>
														<div className="page-link" style={{ cursor: remaining > 0 && 'pointer', opacity: remaining === 0 && 0.4 }}>
															<i className="fas fa-arrow-right"></i>
														</div>
													</li>
												</ul>
											</nav>
										</>
									)}
								</TabPanel>
								<TabPanel id="resturantTable" value={value} index={2} dir={theme.direction}>
									{/* <div className={classes.root}>
										<Grid container>
											<Grid item xs={12} md={3}>
												<TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={doSearch} />
											</Grid>
										</Grid>
									</div> */}
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
										<>
											<MDBDataTableV5
												className="customTableResponsive"
												responsive={true}
												hover
												entriesOptions={[15, 30, 50, 100]}
												entries={100}
												pagesAmount={4}
												data={disableuser}
												fullPagination
												searchTop={false}
												paging={false}
												// onSearch={(e) => console.log('=========', doSearch(e))}
												searchBottom={false}
												// noBottomColumns={false}
												btn={false}
											/>
											<nav aria-label="Page navigation" style={{ display: 'flex', justifyContent: 'flex-end' }}>
												<ul className="pagination">
													<li className="page-item" onClick={() => page > 1 && setPage(page - 1)}>
														<div className="page-link" style={{ cursor: page > 1 && 'pointer', opacity: page === 1 && 0.4 }}>
															<i className="fas fa-arrow-left"></i>
														</div>
													</li>
													<li className="page-item">
														<div className="page-link">{page}</div>
													</li>
													<li className="page-item">
														<div className="page-link">of</div>
													</li>

													<li className="page-item">
														<div className="page-link">{totalPage}</div>
													</li>
													<li className="page-item" onClick={() => remaining > 0 && setPage(page + 1)}>
														<div className="page-link" style={{ cursor: remaining > 0 && 'pointer', opacity: remaining === 0 && 0.4 }}>
															<i className="fas fa-arrow-right"></i>
														</div>
													</li>
												</ul>
											</nav>
										</>
									)}
								</TabPanel>
								<TabPanel id="resturantTable" value={value} index={3} dir={theme.direction}>
									<DeleteModal
										open={openRemoveModal}
										close={handleRemoveModalClose}
										title="Delete User"
										message="Do you really want to delete this user? You cannot undo this action."
										deleteButtonText="Delete"
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
										<>
											<MDBDataTableV5
												className="customTableResponsive"
												responsive={true}
												hover
												entriesOptions={[15, 30, 50, 100, 200]}
												entries={200}
												pagesAmount={4}
												data={deletedUsers}
												searchTop={false}
												paging={false}
												searchBottom={false}
												btn={false}
											/>
											<nav aria-label="Page navigation" style={{ display: 'flex', justifyContent: 'flex-end' }}>
												<ul className="pagination">
													<li className="page-item" onClick={() => page > 1 && setPage(page - 1)}>
														<div className="page-link" style={{ cursor: page > 1 && 'pointer', opacity: page === 1 && 0.4 }}>
															<i className="fas fa-arrow-left"></i>
														</div>
													</li>
													<li className="page-item">
														<div className="page-link">{page}</div>
													</li>
													<li className="page-item">
														<div className="page-link">of</div>
													</li>

													<li className="page-item">
														<div className="page-link">{totalPage}</div>
													</li>
													<li className="page-item" onClick={() => remaining > 0 && setPage(page + 1)}>
														<div className="page-link" style={{ cursor: remaining > 0 && 'pointer', opacity: remaining === 0 && 0.4 }}>
															<i className="fas fa-arrow-right"></i>
														</div>
													</li>
												</ul>
											</nav>
										</>
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
				title="Block User"
				message={`Are you sure you want to block user? `}
				deleteButtonText="block"
				deleteAction={() => {
					blockUser(deletedReport?.id)
				}}
			/>
			<DeleteModal
				open={disableuserModel}
				close={() => setdisableuserModel(false)}
				title="Disable User"
				message={`Are you sure you want to Disable user? `} //xx
				deleteButtonText="Disable"
				deleteAction={() => {
					DisableUser(disable?.id)
				}}
			/>
			<DeleteModal
				open={enableModel}
				close={() => setenableModel(false)}
				title="Enable User"
				message={`Are you sure you want to Enable user? `} //xx
				deleteButtonText="Enable"
				deleteAction={() => {
					enableUserAccount(enable?.id)
				}}
			/>

			<DeleteModal
				open={unblockModel}
				close={() => setunblockModel(false)}
				title="unblock user"
				message={`Are you sure you want to unblock user?.`}
				deleteButtonText="unblock"
				deleteAction={() => {
					unblockUser(deletedReport?.id)
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

export default ViewAllUser

const useStyles = makeStyles((theme) => ({
	root: {
		padding: '8px 0px 0px 0px',
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',

	},
	root1: {
		backgroundColor: theme.palette.background.paper,

	},
	profile: {
		width: '2rem',
		height: '2rem',
		display: 'flex',
		background: 'red',
		borderRadius: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: '0'
	},
	heading: {
		fontWeight: '600',
		// marginBottom: '2%',
		fontSize: '28px',
		color: color.black
	},
	icon: {
		fontSize: '22px !important'
	},
	text: {
		margin: '0',
		color: 'white'
	},
	flexed: {
		display: 'flex',
		gap: '0.5rem',
		alignItems: 'center'
	},
	view: {
		display: 'flex',
		alignItems: 'flex-end',
		justifyContent: 'flex-end'
	},
	flex: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	viewButton: {
		backgroundColor: color.black,
		width: '35px',
		height: '36px',
		cursor: 'pointer',
		borderRadius: '4px',
		// boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
	},
	removeButton: {
		backgroundColor: color.red,
		width: '35px',
		height: '32px',
		cursor: 'pointer',
		borderRadius: '4px',
		// boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
	},
	textField: {
		// marginTop: '15px',
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		height: '45px',
		marginBottom: '0.3rem',
	},
	saveButton: {
		backgroundColor: 'transparent',
		color: color.red,
		border: `1px solid ${color.red}`,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		cursor: 'pointer',

		'&:hover': {
			backgroundColor: color.darkRed,
			color: color.white,
		}
	},
	blockButton: {
		backgroundColor: 'transparent',
		color: color.black,
		border: `1px solid ${color.darkGray}`,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		cursor: 'pointer',
		borderRadius: '5px',
		// boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
		'&:hover': {
			backgroundColor: color.grayLight,
		}
	},

	image: {
		width: '2.0rem',
		height: '2.0rem',
		borderRadius: '50%',
		objectFit: 'cover'
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
	},
	inputSearch: {
		position: 'absolute',
		marginTop: '0.8rem',
		/* margin-right: -22rem; */
		marginLeft: '-2rem',
		color: 'gray',
	}
}))
