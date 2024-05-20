import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme } from '@material-ui/core'
import { MDBDataTableV5 } from 'mdbreact'
import { Visibility } from '@material-ui/icons'
import { color, toastStyle } from '../../assets/css/commonStyle'
import { toast } from 'react-toastify'
import DeleteModal from '../../components/common/DeleteModal'
import ViewPostDetails from '../../components/post/ViewPostDetails'
import ViewUserDetails from '../../components/paidOrder/ViewUserDetails'

import { api } from '../../api/callAxios'
import SwipeableViews from 'react-swipeable-views'
import { HowToReg } from '@material-ui/icons'
import ImageViewer from 'react-simple-image-viewer'

const ViewAllPost = forwardRef((user) => {
	const classes = useStyles()
	const theme = useTheme()
	const [editUser, setEditUser] = useState(null)
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [value, setValue] = useState(0)
	const [deleteUserModel, setDeleteModel] = useState(false)
	const [deletePostData, setdeletePostData] = useState(false)
	const [unblockModel, setunblockModel] = useState(false)
	const [previewImageModel, setPreviewImageModel] = useState(false)
	const [previewImage, setPreviewImage] = useState(false)
	const [page, setPage] = useState(1)
	const [deletedReport, setDeletedReport] = useState({})
	const [deletedPost, setdeletedPost] = useState({})
	const [reportedPostCount, setreportedPostCount] = useState(0)
	const [blockPostCount, setblockPostCount] = useState(0)
	const [sellerid, setsellerid] = useState(user?.user?.seller_detail?.id)

	const [history, sethistory] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'User Name', field: 'name', width: 200, sort: String('disabled') },
			{ label: ' Image', field: 'image', width: 270 },
			{ label: 'product Name', field: 'product', width: 200, sort: String('disabled') },
			{ label: 'Quantity', field: 'quantity', width: 200, sort: String('disabled') },
			{ label: 'Delivery Charges', field: 'delivery_charges', width: 270 },

			{ label: 'Service Charges', field: 'service_charges', width: 200, sort: String('disabled') },
			{ label: 'Total', field: 'total', width: 200, sort: String('disabled') }

			// {label: 'View', field: 'view', width: 200, sort: String('disabled')}
		],
		rows: []
	})

	const [reportedhistory, setReportedhistory] = useState({
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
			{ label: 'history', field: 'user', width: 270 },
			{ label: 'Block User', field: 'status', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	const [post, setpost] = useState({
		columns: [
			{
				label: 'User Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Name', field: 'name', width: 200, sort: String('disabled') },
			{ label: 'Email', field: 'email', width: 200, sort: String('disabled') },
			{ label: 'Phone', field: 'phone', width: 200, sort: String('disabled') }
		],
		rows: [{ id: user?.user?.seller_detail?.id, name: user?.user?.seller_detail?.first_name, email: user?.user?.seller_detail?.email, phone: user?.user?.seller_detail?.phone }]
	})

	useEffect(() => {
		if (value == 1) {
			ViewSellerHistory()
		}
	}, [value])

	const viewAllPost = () => {
		setLoading(true)
		api.get(`/`)
			.then((response) => {
				if (response.data.success == true) {
					console.log('post data is ', response)
					if (response?.data.data?.reportedEvent?.length >= 0) {
						setpost((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						setreportedPostCount(user)
						setblockPostCount(response?.data.data.block_Post_count)
						response?.data?.data?.reportedEvent?.map((data, index) => {
							createPostTable(data)
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
	const ViewSellerHistory = () => {
		setLoading(true)
		api.post(`/admin/seller_history`, {
			seller_id: sellerid,
			from: user.from,
			to: user.to,
			unpaid: user?.user.charge_gamba
		})
			.then((response) => {
				if (response.data.success == true) {
					console.log('block post data ', response.data.data)

					if (response.data.data.length >= 0) {
						sethistory((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})

						response.data.data.map((data, index) => {
							createBlockPostTable(data)
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

	//in use
	const deletePost = (id, post_id) => {
		setLoading(true)
		api.delete(`/admin/delete_reported_post/${id}/${post_id}`)
			.then((response) => {
				setLoading(false)
				setdeletePostData(false)
				viewAllPost()
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const unblockPost = (post_id) => {
		setLoading(true)
		api.post(`/admin/unblock_post`, {
			post_id: post_id
		})
			.then((response) => {
				setLoading(false)
				setunblockModel(false)
				ViewSellerHistory()
				viewAllPost()
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}
	//in use
	const deletePostReport = (id) => {
		setLoading(true)
		api.delete(`/admin/delete_event_report/${id}`)
			.then((response) => {
				setLoading(false)
				setDeleteModel(false)
				viewAllPost()
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
		setDeletedReport({ id: id })
		setDeleteModel(true)
	}
	const deletePostModel = (id, post_id) => {
		setdeletedPost({ id: id, post_id: post_id })
		setdeletePostData(true)
	}
	const unblockPostModel = (post_id) => {
		setdeletedPost({ post_id: post_id })
		setunblockModel(true)
	}

	const blockPost = (post_id) => {
		setLoading(true)
		api.post(`/admin/block_post`, {
			post_id: post_id
		})
			.then((response) => {
				setLoading(false)
				setDeleteModel(false)
				viewAllPost()
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}
	const blockPostModel = (post_id) => {
		setDeletedReport({ post_id: post_id })
		setDeleteModel(true)
	}

	const doSearch = async (e) => {
		setSearch(e.target.value)
		console.log('search', e.target.value)
		if (value == 0) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/get_all_reported_post_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success == true) {
							setpost((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							response.data.data.map((data, index) => {
								createPostTable(data)
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
			if (e.target.value.length == 0) {
				console.log('enter 2')
				if (value == 0) {
					viewAllPost()
				}
			}
		}

		if (value == 1) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/get_all_reported_block_post_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success == true) {
							sethistory((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							response.data.data.map((data, index) => {
								createBlockPostTable(data)
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
			if (e.target.value.length == 0) {
				console.log('enter 2')
				if (value == 0) {
					viewAllPost()
				}
			}
		}
	}
	const viewPost = (row) => {
		setEditUser(row)
	}
	const goBackAllPost = () => {
		setEditUser(null)
		viewAllPost()
	}
	//in use
	const createPostTable = (row) => {
		let _obj = {
			id: row?.post_id,
			photo: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.reported_post?.images[0]}`} alt="" />,
			user_name: row?.reported_post?.user.first_name,
			description: row?.reported_post?.description,
			u_id: row?.reported_post?.user.id,
			title: row?.reported_post?.title,
			posted: new Date(row.createdAt).toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
				year: '2-digit'
			}),
			view: (
				<Avatar variant="square" className={classes.viewButton} onClick={() => viewPost(row)}>
					<Visibility className={classes.icon} />
				</Avatar>
			),

			block: (
				<Button
					variant="contained"
					color="secondary"
					className={classes.saveButton}
					style={{ marginLeft: '16px' }}
					onClick={() => blockPostModel(row?.post_id)}
				>
					Block
				</Button>
			),
			action: [
				<Button variant="contained" color="secondary" className={classes.saveButton} onClick={() => deletePostModel(row?.id, row?.post_id)}>
					delete
				</Button>
			]
		}
		setpost((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createBlockPostTable = (row) => {
		// total of product
		let total = []
		row.order_products.map((e) => {
			total.push(e.total)
		})
		let sum = total.reduce((acc, val) => acc + val, 0)
		let _obj = {
			id: row?.user_orders?.id,
			name: row?.user_orders?.first_name,
			delivery_charges: row?.delivery_charges,
			service_charges: row?.service_charges,
			product: row.order_products.map((e) => {
				return (
					<>
						<div className={classes.flexWrapper}>{e.product_orders.name && <div className={classes.reasonContent}>{e.product_orders.name}</div>}</div>
					</>
				)
			}),
			quantity: row.order_products.map((e) => {
				return (
					<>
						<div className={classes.flexWrapper}>{e.quantity && <div className={classes.reasonContent}>{e.quantity}</div>}</div>
					</>
				)
			}),
			total: sum,
			image: row.order_products.map((e) => {
				return (
					<>
						<img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${e.product_orders.images[0]}`} alt="" />
					</>
				)
			})
		}
		sethistory((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
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

	return (
		<>
			{editUser == null ? (
				<>
					<div className={classes.root}>
						<div className={classes.header}>
							<Typography variant="h4" className={classes.heading}>
								Detail
							</Typography>
							<Typography variant="h6" className={classes.heading}>
							</Typography>
						</div>
						<div className={classes.root1}>
							<AppBar position="static" color="default">
								<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
									{/* <Tab className={classes.tabHeading} label="Pending to approve history" icon={<HowToReg className={classes.tabIcon} />} /> */}
									<Tab className={classes.tabHeading} label="Seller " icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label="History " icon={<HowToReg className={classes.tabIcon} />} />
								</Tabs>
							</AppBar>
							<SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
								<TabPanel value={value} index={0} dir={theme.direction}>
									<ViewUserDetails user={user} />
								</TabPanel>

								<TabPanel value={value} index={1} dir={theme.direction}>
									<div className={classes.root}>
										<Grid container>
											<Grid item xs={12} md={3}>
												{/* <TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={doSearch} /> */}
											</Grid>
										</Grid>
									</div>

									{loading ? (
										<>
											<div id="loader-div">
												<div id="loadings"></div>
											</div>
											<div style={{ height: '30rem' }}></div>
										</>
									) : (
										<MDBDataTableV5 className="customTableResponsive" responsive={true} hover entriesOptions={[15, 30, 50]} entries={15} pagesAmount={4} data={history} fullPagination searchTop={false} searchBottom={false} />
									)}
								</TabPanel>
							</SwipeableViews>
						</div>
					</div>
				</>
			) : (
				<ViewPostDetails user={editUser} goBackAllProduct={goBackAllPost} allBlockPost={ViewSellerHistory} />
			)}

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
				open={deletePostData}
				close={() => setdeletePostData(false)}
				title="Delete Post"
				message="Are you sure you want to Delete Post? You cannot undo this action."
				deleteButtonText="Delete post"
				deleteAction={() => deletePost(deletedPost.id, deletedPost.post_id)}
			/>
			<DeleteModal open={unblockModel} close={() => setunblockModel(false)} title="unblock Post" message="Are you sure you want to  unblock Post " deleteButtonText="unblock" deleteAction={() => unblockPost(deletedPost.post_id)} />

			<DeleteModal open={deleteUserModel} close={() => setDeleteModel(false)} title="Block Post" message="Are you sure you want to Block Post." deleteButtonText="block" deleteAction={() => blockPost(deletedReport.post_id)} />
		</>
	)
})

export default ViewAllPost

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
		backgroundColor: color.darkRed,
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
