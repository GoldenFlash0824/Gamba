import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme } from '@material-ui/core'
import { MDBDataTableV5 } from 'mdbreact'
import { color, toastStyle } from '../assets/css/commonStyle'
import { toast } from 'react-toastify'
import DeleteModal from '../components/common/DeleteModal'
import ViewUserDetails from '../components/user/ViewUserDetails'
import { api } from '../api/callAxios'
import SwipeableViews from 'react-swipeable-views'
import { HowToReg } from '@material-ui/icons'
import moment from 'moment'
import ImageViewer from 'react-simple-image-viewer'
import ViewInvoiceDetails from '../components/paidOrder/ViewInvoiceDetails'
import { Visibility } from '@material-ui/icons'

const GambaPaymentHistory = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		openViewAllUserPage() {
			setEditUser(null)
			setViewInvoice(null)
		}
	}))

	const classes = useStyles()
	const theme = useTheme()
	const [openRemoveModal, setOpenRemoveModal] = useState(false)
	const [deleteId, setDeleteId] = useState('')
	const [editUser, setEditUser] = useState(null)
	const [viewInvoice, setViewInvoice] = useState(null)
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [value, setValue] = useState(0)
	const [deleteModel, setDeleteModel] = useState(false)
	const [previewImageModel, setPreviewImageModel] = useState(false)
	const [previewImage, setPreviewImage] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	const [deletedReport, setDeletedReport] = useState({})
	const [users, setUsers] = useState({
		columns: [
			{
				label: 'Date Paid ',
				field: 'date_paid',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Orders No', field: 'number_of_order', width: 150 },
			{ label: 'Paid By', field: 'buyer', width: 270 },
			{ label: 'Paid To', field: 'seller', width: 270 },
			{ label: 'Payment Method', field: 'payment_method', width: 270 },
			{ label: 'Total Paid', field: 'total_sale', width: 200, sort: String('disabled') },
			{ label: 'Conf. No', field: 'confirmation_no', width: 200, sort: String('disabled') },
			{ label: 'Paid To Gamba', field: 'amount_paid_to_gamba', width: 200, sort: String('disabled') },
			{ label: 'Action', field: 'action', width: 270 },
		],
		rows: [
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

	useEffect(() => {
		if (value == 0) {
			viewGambaPaymentHistory()
		}

		if (value == 2) {
			AllReportedUser()
		}
	}, [value, page])

	const viewGambaPaymentHistory = () => {
		setLoading(true)
		api.get(`/admin/gamba_payment_history/${page}`)
			.then((response) => {
				if (response.data.success == true) {
					setUsers((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					if (response.data.data?.response.length > 0) {
						setTotalPage(parseInt(((response.data.data?.remaining) / 20) + 1))
						response.data.data.response.map((data, index) => {
							createGambaPaymentHistoryTable(data)
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

	const AllReportedUser = () => {
		setLoading(true)
		api.get(`/admin/all_reported_users`)
			.then((response) => {
				if (response.data.success == true) {
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
					// viewGambaPaymentHistory();
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
		setViewInvoice(null)
	}

	const handleRemoveModalClose = () => {
		setOpenRemoveModal(false)
	}


	const createGambaPaymentHistoryTable = (row) => {

		const uniqueSellers = [...new Set(
			row.payment_order?.order_products.map((product) => `${product.seller_detail.first_name} ${product.seller_detail.last_name}`)
		)];
		let _obj = {
			date_paid: moment(row?.date_paid).format('MM/DD/YY'),
			number_of_order: <div style={{ display: 'flex', marginLeft: '1rem' }}>{row?.payment_order?.ref_id}</div>,
			buyer: (
				<div className={classes.flexed} style={{ justifyContent: 'space-between' }}>
					<div>
						<div className={classes.flexed}>
							<div >
								<img className={classes.user_image} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.payment_order?.user_orders?.image ? row?.payment_order?.user_orders?.image : row?.payment_order?.user_orders?.first_name[0].toLowerCase() + '.png'}`} alt="" />
							</div>
							{row.payment_order?.user_orders.first_name + ' ' + row.payment_order?.user_orders.last_name}
						</div>
					</div>
				</div>
			),
			seller: (
				<div className={classes.flexed} style={{ justifyContent: 'space-between' }}>
					<div>
					
						{uniqueSellers.map((sellerName, index) => (
							<div className={classes.flexed}>
								<div >
								<img
									className={classes.user_image}
									src={`${process.env.REACT_APP_IMAGE_URL}/${row.payment_order?.order_products.find((product) => `${product.seller_detail.first_name} ${product.seller_detail.last_name}` === sellerName)?.seller_detail.image ||
									sellerName[0].toLowerCase() + ".png"}`} 
									alt=""/>
								</div>
								{sellerName}
							</div>
						))}
					</div>
				</div>
			),
			payment_method: row.payment_order?.payment_method == 'debitOrCreditCard' ? 'Credit Card' : 'Cash',
			total_sale: <div style={{ textAlign: 'right' }}>{row?.total.toFixed(2)}</div>,
			confirmation_no: row.confirmation_no,
			amount_paid_to_gamba: <div style={{ textAlign: 'right' }}>{row?.amount_paid_to_gamba.toFixed(2)}</div>,
			action: (
				<div className={classes.flexed}>
					<Avatar variant="square" onClick={() => viewInvoiceDetails(row.payment_order)} className={classes.viewButton}>
						<Visibility className={classes.icon} />
					</Avatar>
				</div>
			)
		}
		setUsers((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const viewInvoiceDetails = (row) => {
		setEditUser(null)
		setViewInvoice(row)
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
				<Button  color="secondary" className={classes.saveButton} onClick={() => deleteReportModel(row.id, row.blocked ? 'unblock' : 'block')}>
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

	const goBackAllUser = () => {
		setEditUser(null)
		setViewInvoice(null)
		viewGambaPaymentHistory()
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
			{editUser == null && viewInvoice == null ? (
				<>
					<div className={classes.root}>
						<div className={classes.header}>
							<Typography variant="h4" className={classes.heading}>
								Gamba Payment History
							</Typography>
						</div>
						<div className={classes.root1}>
							<AppBar position="static" color="default">
								<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
									{/* <Tab className={classes.tabHeading} label="Pending to approve Users" icon={<HowToReg className={classes.tabIcon} />} /> */}
									<Tab className={classes.tabHeading} label="Gamba Payment History " icon={<HowToReg className={classes.tabIcon} />} />
									{/* <Tab className={classes.tabHeading} label="Reported Users" icon={<HowToReg className={classes.tabIcon} />} /> */}
								</Tabs>
							</AppBar>
							<SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
								<TabPanel value={value} index={0} id="resturantTable" dir={theme.direction}>
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
										<>
										<MDBDataTableV5
											className="customTableResponsive"
											responsive={true}
											hover
											entriesOptions={[15, 30, 50]}
											entries={15}
											pagesAmount={4}
											data={users}
											fullPagination
											searchTop={false}
											searchBottom={false}
											paging={false}
											btn={false}
										/>

											<nav aria-label="Page navigation" style={{ display: 'flex', justifyContent: 'flex-end' }}>
												<ul className="pagination">
													<li className="page-item" onClick={() => page > 1 && setPage(page - 1)}>
														<div className="page-link" style={{ cursor: page > 1 && 'pointer', opacity: page == 1 && 0.4 }}>
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
													<li className="page-item" onClick={() => page < totalPage && setPage(page + 1)}>
														<div className="page-link" style={{ cursor: page < totalPage && 'pointer', opacity: page == totalPage && 0.4 }}>
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
			) : viewInvoice ? (
				<ViewInvoiceDetails order={viewInvoice} goBackAllUser={goBackAllUser} />
			) : (
				<ViewUserDetails user={editUser} goBackAllUser={goBackAllUser} />
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
		</>
	)
})

export default GambaPaymentHistory

const useStyles = makeStyles((theme) => ({



	img: {
		width: '2rem',
		height: '2rem'
	},

	flexed: {
		display: 'flex',
		gap: '0.5rem',
		alignItems: 'center'
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
	user_image: {
		width: '2.0rem',
		height: '2.0rem',
		borderRadius: '50%'
	},


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
		margin: '16px 0px',
		fontSize: '28px',
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
