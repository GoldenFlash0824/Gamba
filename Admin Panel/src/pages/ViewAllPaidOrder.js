import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Grid, makeStyles, Typography, Avatar, Button, AppBar, Tabs, Tab, TextField, Box, useTheme } from '@material-ui/core'
import { MDBDataTableV5 } from 'mdbreact'
import { Visibility } from '@material-ui/icons'
import { color, toastStyle } from '../assets/css/commonStyle'
import { toast } from 'react-toastify'
import DeleteModal from '../components/common/DeleteModal'
import NoteModal from '../components/common/NoteModal'
import ViewOrderDetails from '../components/paidOrder/ViewOrderDetails'
import ViewInvoiceDetails from '../components/paidOrder/ViewInvoiceDetails'
import { api } from '../api/callAxios'
import SwipeableViews from 'react-swipeable-views'
import { HowToReg } from '@material-ui/icons'
import ImageViewer from 'react-simple-image-viewer'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'



const ViewAllPaidOrder = forwardRef((props, ref) => {
	const [startDate, setStartDate] = useState(new Date(moment().subtract(7, 'day').format()))
	const [endDate, setEndDate] = useState(new Date())
	var dateObj = new Date(startDate)

	// Convert the Date object to the desired format
	var convertedstart = dateObj.toLocaleDateString('en', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	})

	var end = new Date(endDate)

	// Convert the Date object to the desired format
	var convertedend = end.toLocaleDateString('en', {
		day: 'numeric',
		month: 'short',
		year: 'numeric'
	})
	useImperativeHandle(ref, () => ({
		openViewAllUserPage() {
			setEditUser(null)
			setViewInvoice(null)
		}
	}))

	const classes = useStyles()
	const theme = useTheme()
	const [editUser, setEditUser] = useState(null)
	const [viewInvoice, setViewInvoice] = useState(null)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState('')
	const [value, setValue] = useState(0)
	const [deleteModel, setDeleteModel] = useState(false)
	const [previewImageModel, setPreviewImageModel] = useState(false)
	const [previewImage, setPreviewImage] = useState(false)

	const [deletedReport, setDeletedReport] = useState({})
	const [unblockuser, setunblockuser] = useState({})
	const [chargeSeller_id, setchargesellerid] = useState({})
	const [unblock, setunblock] = useState(false)
	const [chargeSellerpop, setchargesellerpop] = useState(false)

	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	const [remaining, setRemaining] = useState(0)
	const [deleteOrderReport, setDeleteOrderReport] = useState(false)
	const [deleteOrderReportId, setDeleteOrderReportId] = useState('')

	const [noteModal, setNoteModal] = useState(false)
	const [noteData, setNoteData] = useState([])

	const [blockSellerModel, setBlockSellerModel] = useState(false)
	const [blockSellerId, setBlockSellerId] = useState('')
	const [paidOrders, setPaidOrders] = useState([])
	const [unPaidOrders, setUnPaidOrders] = useState([])
	const [disputedOrders, setDisputedOrders] = useState([])

	const [paidorder, setpaidorder] = useState({
		columns: [
			{
				label: 'Seller id ',
				field: 'order_date',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Name', field: 'name', width: 270 },
			{ label: 'Purchased Date', field: 'createdAt', width: 270 },


			{ label: 'Total Paid', field: 'total', width: 200, sort: String('disabled') },
			{ label: 'Paid to Gamba', field: 'pay_gamba', width: 200, sort: String('disabled') },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') },
			// {label: 'Action', field: 'action', width: 200, sort: String('disabled')},
			// {label: 'Block', field: 'block', width: 200, sort: String('disabled')}
		],
		rows: []
	})

	const [unpaidOrder, setunpaidOrder] = useState({
		columns: [
			{ label: 'Purchased Date', field: 'purchasedDate', width: 370 },
			{ label: 'Order No', field: 'orderId', width: 150, attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' } },
			{ label: 'Seller Id', field: 'userId', width: 150, attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' } },
			{ label: 'Seller Name', field: 'sellerName', width: 270 },
			{ label: 'Dispute Name', field: 'disputeName', width: 270 },
			{ label: 'Dispute Starting Date', field: 'disputeStartDate', width: 270 },
			{ label: 'Amount Disputed Cancelled', field: 'disputedAmount', width: 270 },
			{ label: 'Status', field: 'status', width: 200 },
			{ label: 'Dispute Date', field: 'disputeDate', width: 270 },
			{ label: 'Action', field: 'action', width: 270 }
		],
		rows: [

		]
	})

	const [Disputed, setDisputed] = useState({
		columns: [
			{ label: 'Purchased Date', field: 'PurchasedDate', width: 270 },
			{
				label: 'Seller Id',
				field: 'sellerid',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Seller Name', field: 'SellerName', width: 270 },
			{ label: 'Disputer Name', field: 'DisputerName', width: 270 },
			{ label: 'Dispute Date', field: 'DisputeStart', width: 270 },
			{ label: 'Amount', field: 'Amount', width: 270 },
			{ label: 'Status', field: 'Status', width: 270 },
			// { label: 'Dispute Date', field: 'createdAt', width: 270 },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') },
			{ label: 'Note', field: 'Note', width: 200, sort: String('disabled') }
		],
		rows: [

		]
	})

	const [orderReports, setOrderReports] = useState({
		columns: [
			{ label: 'Date', field: 'orderDate', width: 370 },
			{
				label: 'Order No',
				field: 'orderId',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'Seller', field: 'seller', width: 270 },
			{ label: 'Buyer', field: 'buyer', width: 270 },
			{ label: 'Type', field: 'orderType', width: 270 },
			{ label: 'Products', field: 'orderProducts', width: 270 },
			{ label: 'Total Paid', field: 'totalPaid', width: 270 },
			{ label: 'Status', field: 'status', width: 200 },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	const filterData = () => {
		viewAllPaidOrders()
		ViewAllUnpaid()
	}

	const viewAllPaidOrders = () => {
		setLoading(true)
		api.post(`/admin/manage_order`, {
			from: convertedstart,
			to: convertedend
		})
			.then((response) => {
				if (response.data.success == true) {
					setpaidorder((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					setPaidOrders(response.data.data.response)
					if (response.data.data.response.length > 0) {


						response.data.data.response.map((data, index) => {
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

	const ViewAllUnpaid = () => {
		setLoading(true)
		api.post(`/admin/manage_cancelled_order/${page}`, {
			from: convertedstart,
			to: convertedend
		})
			.then((response) => {
				if (response.data.success == true) {
					setunpaidOrder((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					setUnPaidOrders(response.data.data.response)
					if (response.data.data.response.length >= 0) {

						setTotalPage(parseInt(parseInt(response.data.data?.remaining) / 20) + 1)
						setRemaining(response.data.data?.remaining)

						response.data.data.response.map((data, index) => {
							createUnpaidUserTable(data)
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

	const ViewAllDisputed = () => {
		setLoading(true)
		api.get(`/admin/view_all_disputed_user`)
			.then((response) => {
				if (response.data.success == true) {
					setDisputed((preValue) => {
						return {
							columns: [...preValue?.columns],
							rows: []
						}
					})
					setDisputedOrders(response.data.data.response)
					if (response.data.data.response.length > 0) {
						console.log('data is ', response.data.data)

						response.data.data.response.map((data, index) => {
							createDisputedUserTable(data)
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

	const ViewAllReportedOrders = () => {
		setLoading(true)
		api.get(`/admin/manage_paid_order/${page}`)
			.then((response) => {
				if (response.data.success == true) {
					setOrderReports((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					if (response.data.data?.response.length > 0) {
						setTotalPage(parseInt(((response.data.data?.remaining) / 20) + 1))
						setRemaining(response.data.data?.remaining)
						response.data.data?.response.map((data, index) => {
							createOrderReportsTable(data)
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

	const viewUser = (row) => {
		setEditUser(row)
		setViewInvoice(null)
	}

	const viewInvoiceDetails = (row) => {
		setEditUser(null)
		setViewInvoice(row)
	}

	const createPaidOrderTable = (row) => {
		let _obj = {
			order_date: row.seller_detail?.id,
			name: row.seller_detail?.first_name,
			createdAt: moment(row?.createdAt).format('MM/DD/YY'),

			view: (
				<Avatar variant="square" onClick={() => viewUser(row)} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			action: (
				<Button color="secondary" className={classes.saveButton} onClick={() => deleteReportModel(row.id)}>
					Charge
				</Button>
			),
			block: (
				<Button color="secondary" className={classes.blockButton} onClick={() => deleteReportModel(row.seller_detail?.id)}>
					block
				</Button>
			),
			pay_gamba: <div style={{ marginLeft: '1.5rem' }}>10</div>,
			total: <div style={{ marginLeft: '1rem' }}>{row.seller_detail?.totalSum}</div>
		}
		setpaidorder((preValue) => {
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

	const unBlockModel = (id) => {
		setunblockuser({ id: id })
		setunblock(true)
	}

	const chargeSeller = (id, total, name, order_number) => {
		setchargesellerid({ id: id, total: total, name: name, order_number: order_number })
		setchargesellerpop(true)
		viewAllPaidOrders()
	}

	const cancelOrder = (id, refId) => {
		api.get(`/admin/cancel_order/${id}`)
			.then((response) => {
				if (response.data.success) {
					setOrderReports((prevState) => ({
						columns: [...prevState.columns],
						rows: prevState.rows.filter((row) => row.orderId != refId),
					}));
					toast.success('Order Cancelled', {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
				} else {
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

	const createUnpaidUserTable = (row) => {
		const uniqueSellers = [...new Set(
			row.order_products.map((product) => `${product.seller_detail.first_name} ${product.seller_detail.last_name}`)
		)];
		let _obj = {
			purchasedDate: moment(row?.createdAt).format('MM/DD/YY'),
			orderId: '#' + (row?.ref_id || row?.id),
			userId: (
				<div>
					{uniqueSellers.map((sellerName, index) => (
						row.order_products.find((product) => `${product.seller_detail.first_name} ${product.seller_detail.last_name}` === sellerName)?.seller_detail.ref_id
					))}
				</div>
			),
			sellerName: (
				<div className={classes.flexed} style={{ justifyContent: 'space-between' }}>
					<div>

						{uniqueSellers.map((sellerName, index) => (
							<div className={classes.flexed}>
								<div >
									<img
										className={classes.user_image}
										src={`${process.env.REACT_APP_IMAGE_URL}/${row.order_products.find((product) => `${product.seller_detail.first_name} ${product.seller_detail.last_name}` === sellerName)?.seller_detail.image ||
											sellerName[0].toLowerCase() + ".png"}`}
										alt="" />
								</div>
								{sellerName}
							</div>
						))}
					</div>
				</div>
			),
			disputeName: (
				<div className={classes.flexed} style={{ justifyContent: 'space-between' }}>
					<div>
						<div className={classes.flexed}>
							<div >
								<img
									className={classes.user_image}
									src={`${process.env.REACT_APP_IMAGE_URL}/${row.user_orders.image || row.user_orders.first_name[0].toLowerCase() + ".png"}`}
									alt="" />
							</div>
							{row.user_orders.first_name + ' ' + row.user_orders.last_name}
						</div>
					</div>
				</div>
			),
			disputeStartDate: '',
			disputedAmount: (<div style={{ textAlign: 'right' }}>{row.total.toFixed(2)}</div>),
			status: (<div>{row.status == 'CANCELLED' ? 'Cancelled' : 'Disputed'}</div>),
			disputeDate: row.status_date ? moment(row?.status_date).format('MM/DD/YY') : '',
			action: (
				<div className={classes.flexed}>
					<Avatar variant="square" onClick={() => viewInvoiceDetails(row)} className={classes.viewButton}>
						<Visibility className={classes.icon} />
					</Avatar>
					<Button
						data-bs-toggle="modal" data-bs-target="#staticBackdrop"
						color=""
						className="border "
						onClick={() => {
							setNoteData(row)
							setNoteModal(true)
						}}>
						Note
					</Button>

				</div>
			)
		}
		setunpaidOrder((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createDisputedUserTable = (row) => {
		let _obj = {
			sellerid: row.seller_detail?.id,
			name: row.seller_detail?.first_name,
			email: row.seller_detail?.email,
			view: (
				<Avatar variant="square" onClick={() => viewUser(row)} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
		}
		setDisputed((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createOrderReportsTable = (row) => {
		const uniqueSellers = [...new Set(
			row.order_products.map((product) => `${product.seller_detail.first_name} ${product.seller_detail.last_name}`)
		)];
		const uniqueClassifications = [...new Set(
			row.order_products.map(product =>
				product.product_orders?.unit ? 'Product' : 'Event'
			)
		)];
		const uniqueNames = [...new Set(
			row.order_products
				.map(product => product.product_orders?.name)
				.filter(name => name)
		)];
		const uniqueStatus = [...new Set(
			row.order_products.map(product =>
				product.charge_gamba ? 'Paid' :
					(product.product_orders.is_donation) ? 'Giveaway' : (product.product_orders.is_trade) ? 'Trade' : (product.product_orders.discount > 0) ? 'Discounted' : 'Unpaid'
			)
		)];

		let _obj = {
			orderDate: moment(row?.createdAt).format('MM/DD/YY'),
			orderId: '#' + (row?.ref_id || row?.id),
			seller: (
				<div className={classes.flexed} style={{ justifyContent: 'space-between' }}>
					<div>

						{uniqueSellers.map((sellerName, index) => (
							<div className={classes.flexed}>
								<div >
									<img
										className={classes.user_image}
										src={`${process.env.REACT_APP_IMAGE_URL}/${row.order_products.find((product) => `${product.seller_detail.first_name} ${product.seller_detail.last_name}` === sellerName)?.seller_detail.image ||
											sellerName[0].toLowerCase() + ".png"}`}
										alt="" />
								</div>
								{sellerName}
							</div>
						))}
					</div>
				</div>
			),
			buyer: (
				<div className={classes.flexed} style={{ justifyContent: 'space-between' }}>
					<div>
						<div className={classes.flexed}>
							<div >
								<img className={classes.user_image} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.user_orders?.image ? row?.user_orders?.image : row?.user_orders?.first_name[0].toLowerCase() + '.png'}`} alt="" />
							</div>
							{row.user_orders.first_name + ' ' + row.user_orders.last_name}
						</div>
					</div>
				</div>
			),
			orderType: (
				<div>
					{uniqueClassifications.map((classification, index) => (
						<div>{classification}</div>
					))}
				</div>
			),
			orderProducts: (
				<div>
					{uniqueNames.map((productNames, index) => (
						<div>{productNames}</div>
					))}
				</div>
			),
			totalPaid: (<div style={{ textAlign: 'right' }}>{row.total.toFixed(2)}</div>),
			status: (
				<div>
					{uniqueStatus.map((classification, index) => (
						<span class="badge shadow-none py-1 px-2 rounded-5 bg-success">{classification}</span>
					))}
				</div>
			),
			action: (
				<div className={classes.flexed}>
					<Avatar variant="square" onClick={() => viewInvoiceDetails(row)} className={classes.viewButton}>
						<Visibility className={classes.icon} />
					</Avatar>
					<Button
						color="secondary"
						className={classes.blockButton} onClick={() => cancelOrder(row.id, '#' + (row?.ref_id || row?.id),)}>
						Cancel
					</Button>
					<Button
						data-bs-toggle="modal" data-bs-target="#staticBackdrop"
						color=""
						className="border "
						onClick={() => {
							setNoteData(row)
							setNoteModal(true)
						}}>
						Note
					</Button>
				</div>
			)
		}
		setOrderReports((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const goBackAllUser = () => {
		setEditUser(null)
		setViewInvoice(null)
		viewAllPaidOrders()
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

	const blockUser = (id) => {
		api.post(`/admin/block_user_for_payment`, {
			u_id: id
		})
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message, {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					// setOpenAddNewModal(false);
					if (value == 2) {
						viewAllPaidOrders()
					} else {
						ViewAllUnpaid()
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

	const chargeSellerApi = (id, total, name, order_number) => {
		console.log('totaltotal', total, name, order_number)
		api.post(`/admin/charge_seller`, {
			seller_id: id,
			total: total,
			name: name,
			order_number: order_number
		})
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message, {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})
					// setOpenAddNewModal(false);

					ViewAllUnpaid()

					setchargesellerpop(false)
				} else {
					setchargesellerpop(false)
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

	const deleteReport = (id) => {
		api.post(`/admin/delete_order_report`, {
			id: id
		})
			.then((response) => {
				if (response.data.success) {
					toast.success(response.data.message, {
						position: toastStyle.position,
						autoClose: toastStyle.closeDuration
					})

					ViewAllReportedOrders()
					setDeleteOrderReport(false)
				} else {
					setDeleteOrderReport(false)
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

	const blockSellerAccount = (id, title) => {
		if (id) {
			api.post(`/admin/block_user`, {
				u_id: id
			})
				.then((response) => {
					if (response.data.success) {
						toast.success(response.data.message, {
							position: toastStyle.position,
							autoClose: toastStyle.closeDuration
						})
						ViewAllReportedOrders()
						setBlockSellerModel(false)
					} else {
						setBlockSellerModel(false)
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

					ViewAllReportedOrders()
					setBlockSellerModel(false)
				} else {
					setBlockSellerModel(false)
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

	const exportToCSV = async () => {
		if (value == 1 && unPaidOrders.length) {
			console.log('======unPaidOrders', unPaidOrders)
			let excelData = []
			unPaidOrders.map((data, index) => {
				excelData.push({ Serial_Number: data.id, Seller_Name: data.seller_detail.first_name + ' ' + data.seller_detail.last_name, Seller_Phone: data.seller_detail.phone, Product_Name: data.order.name, Product_Price: data.order.price, Quantity: data.quantity, Total: data?.total, Payment_method: 'Case On Devlivery' })
			})
			console.log('======excelData', excelData)
			await prepareExcel(excelData)

		}
		if (value == 2 && paidOrders.length) {

			let excelData = []
			paidOrders.map((data, index) => {
				excelData.push({ Serial_Number: data.id, Seller_Name: data.seller_detail.first_name + ' ' + data.seller_detail.last_name, Seller_Phone: data.seller_detail.phone, Product_Name: data.order.name, Product_Price: data.order.price, Quantity: data.quantity, Total: data?.total, Payment_method: 'Debit/Credit Card' })
			})
			await prepareExcel(excelData)
		}

		if (value == 3 && disputedOrders) {
			let excelData = []
			disputedOrders.map((data, index) => {
				excelData.push({ Serial_Number: data.id, Seller_Name: data.seller_detail.first_name + ' ' + data.seller_detail.last_name, Seller_Phone: data.seller_detail.phone, Product_Name: data.order.name, Product_Price: data.order.price, Quantity: data.quantity, Total: data?.total })
			})
			await prepareExcel(excelData)
		}

	}

	const prepareExcel = async (excelData) => {
		const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
		const fileExtension = '.xlsx'

		const ws = XLSX.utils.json_to_sheet(excelData)
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
		const data = new Blob([excelBuffer], { type: fileType })
		FileSaver.saveAs(data, 'Order_details' + fileExtension)
		return true
	}

	const doSearch = async (e) => {
		setSearch(e.target.value)
		if (value === 0) {
			if (e.target.value.length > 1) {
				await api.get(`admin/search_paid_order?page=${page}&filter=${e.target.value}`)
					.then((response) => {
						if (response.data.success == true) {
							setOrderReports((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							if (response.data.data?.response.length > 0) {
								setRemaining(response.data.data?.remaining)
								response.data.data?.response.map((data, index) => {
									createOrderReportsTable(data)
								})
							}
						}
						setLoading(false)
					}).catch((err) => {
						toast.error('Something went wrong. Please try again later.', {
							position: toastStyle.position,
							autoClose: toastStyle.closeDuration
						})
					})
			}
			if (e.target.value.length === 0) {
				if (value === 0) {
					ViewAllReportedOrders()
				}
			}
		}
	}

	useEffect(() => {
		if (value == 0) {
			ViewAllReportedOrders()
		}
		if (value == 1) {
			ViewAllUnpaid()
		}
		if (value == 2) {
			viewAllPaidOrders()
		}
		if (value == 3) {
			ViewAllDisputed()
		}
	}, [value, page])

	return (
		<>
			{editUser == null && viewInvoice == null ? (
				<>
					<div className={classes.root}>
						<div className={classes.header}>
							<Typography variant="h4" className={classes.heading}>
								Manage Orders
							</Typography>
							<Grid item xs={12} md={3}>
								<TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={(e) => doSearch(e)} />
							</Grid>
							<div className='d-flex justify-content-between align-items-center gap-5 '>
								<Typography variant="h6" className={classes.heading}>
									<div className="d-flex align-items-center" >
										<p style={{ fontSize: '1rem', margin: '0.5rem 0.5rem 0 0.5rem' }}> Start:</p>
										<DatePicker className={classes.datepicker} selected={startDate} onChange={(date) => setStartDate(date)} />
										<p style={{ fontSize: '1rem', margin: '0.5rem 0.5rem 0 0.5rem' }}> End:</p>
										<DatePicker className={classes.datepicker} selected={endDate} onChange={(date) => setEndDate(date)} />
										<Button
											style={{ fontSize: '1rem', margin: '0.5rem 0.5rem 0 0.5rem' }}
											color="secondary"
											className={classes.datePickerButton}
											onClick={() => {
												filterData()
											}}>
											Go
										</Button>
									</div>
								</Typography>
								<div style={{ display: 'flex', justifyContent: 'flex-end', margin: '0.5rem 0.5rem 0 0.5rem', fontSize: '1rem', }}>
									<Button color="secondary" style={{ fontSize: '1rem', backgroundColor: 'transparent', color: '#333', border: '1px solid #333' }} className={classes.saveButton} onClick={() => exportToCSV()}>
										<svg xmlns="http://www.w3.org/2000/svg" className='me-1' width="18px" height="18px" viewBox="0 0 576 512"><path d="M336 448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80v96h48V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V368H336v80zM489 215c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l39 39H216c-13.3 0-24 10.7-24 24s10.7 24 24 24H494.1l-39 39c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9l-80-80z" /></svg>	Export CSV
									</Button>
								</div>
							</div>
						</div>
						<div className={classes.root1}>
							<AppBar position="static" color="default">
								<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
									<Tab className={classes.tabHeading} label="Manage Orders" icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label="Dispute/Cancel Orders" icon={<HowToReg className={classes.tabIcon} />} />
								</Tabs>
							</AppBar>
							<SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
								<TabPanel value={value} id="resturantTable" index={0} dir={theme.direction}>
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
												data={orderReports}
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
								<TabPanel id="resturantTable" value={value} index={1} dir={theme.direction}>
									<div className={classes.root}>
										<Grid item xs={12} md={3}>
											{/* <TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={(e) => doSearch(e)} /> */}
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
										<>
											<MDBDataTableV5
												className="customTableResponsive"
												responsive={true}
												hover
												entriesOptions={[15, 30, 50]}
												entries={15}
												pagesAmount={4}
												data={unpaidOrder}
												searchTop={false}
												paging={false}
												noRecordsFoundLabel='Need this now also?'
												searchBottom={false}
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
													<li className="page-item" onClick={() => remaining > 0 && setPage(page + 1)}>
														<div className="page-link" style={{ cursor: remaining > 0 && 'pointer', opacity: remaining == 0 && 0.4 }}>
															<i className="fas fa-arrow-right"></i>
														</div>
													</li>
												</ul>
											</nav>
										</>
									)}
								</TabPanel>
								<TabPanel value={value} index={2} dir={theme.direction}>
									{loading ? (
										<>
											<div id="loader-div">
												<div id="loadings"></div>
											</div>
											<div style={{ height: '30rem' }}></div>
										</>
									) : (
										<MDBDataTableV5 className="customTableResponsive" responsive={true} hover entriesOptions={[15, 30, 50]} entries={15} pagesAmount={4} data={paidorder} fullPagination searchTop={false} searchBottom={false} />
									)}
								</TabPanel>
								<TabPanel value={value} index={3} dir={theme.direction}>
									{loading ? (
										<>
											<div id="loader-div">
												<div id="loadings"></div>
											</div>
											<div style={{ height: '30rem' }}></div>
										</>
									) : (
										<MDBDataTableV5 className="customTableResponsive" responsive={true} hover entriesOptions={[15, 30, 50]} entries={15} pagesAmount={4} data={Disputed} fullPagination searchTop={false} searchBottom={false} />
									)}
								</TabPanel>
							</SwipeableViews>
						</div>
					</div>
				</>
			) : viewInvoice ? (
				<ViewInvoiceDetails order={viewInvoice} goBackAllUser={goBackAllUser} />
			) : (
				<ViewOrderDetails user={editUser} from={convertedstart} to={convertedend} goBackAllUser={goBackAllUser} />
			)}
			<DeleteModal
				open={deleteModel}
				close={() => setDeleteModel(false)}
				title={deletedReport.title === 'unblock' ? 'UnBlock User' : 'Block User'}
				message="Are you sure To Block User"
				deleteButtonText={deletedReport.title === 'unblock' ? 'UnBlock User' : 'Block User'}
				deleteAction={() => {
					blockUser(deletedReport?.id)
				}}
			/>

			<DeleteModal
				open={deleteOrderReport}
				close={() => setDeleteOrderReport(false)}
				title={'Delete Report'}
				message="Are you sure to order report"
				deleteButtonText={'Delete Report'}
				deleteAction={() => {
					deleteReport(deleteOrderReportId)
				}}
			/>

			<NoteModal
				open={noteModal}
				close={() => setNoteModal(false)}
				title={'Order Note'}
				orderId={noteData.id}
				noteType={'Order'}
			/>

			<DeleteModal
				open={unblock}
				close={() => setunblock(false)}
				title="Charge User"
				message="Charge and unblock user"
				deleteButtonText="unblock"
				deleteAction={() => {
					blockUser(deletedReport?.id)
				}}
			/>

			<DeleteModal
				open={blockSellerModel}
				close={() => setBlockSellerModel(false)}
				title={blockSellerId?.is_block ? 'UnBlock Seller' : 'Block Seller'}
				message={`Are you sure you want to ${blockSellerId?.is_block ? 'unblock' : 'block'} seller`}
				deleteButtonText={blockSellerId?.is_block ? 'UnBlock' : 'Block'}
				deleteAction={() => {
					blockSellerId?.is_block ? unblockUser(blockSellerId?.id) : blockSellerAccount(blockSellerId?.id)
				}}
			/>

			<DeleteModal
				open={chargeSellerpop}
				close={() => setchargesellerpop(false)}
				title={'Charge seller'}
				message="Charge Seller for Payment"
				deleteButtonText={'charge'}
				deleteAction={() => {
					chargeSellerApi(chargeSeller_id?.id, chargeSeller_id.total, chargeSeller_id.name, chargeSeller_id.order_number)
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

export default ViewAllPaidOrder

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	img: {
		width: '2rem',
		height: '2rem'
	},
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	root1: {
		backgroundColor: theme.palette.background.paper
	},
	styledFlex: {
		display: 'flex',
		alignItems: 'baseline',
		justifyContent: 'center'
		// gap: '1rem'
	},
	datepicker: {
		width: '7rem',
		height: '2rem',
		fontSize: '1rem'
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
		borderRadius: '4px',
		boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
	},
	removeButton: {
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
	textField: {
		marginTop: '15px',
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray,
		height: '45px',
		marginBottom: '0.3rem'
	},
	saveButton: {
		backgroundColor: color.darkBlue,
		color: color.white,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: color.darkBlue
		}
	},
	blockButton: {
		backgroundColor: 'transparent',
		color: color.black,
		border: `1px solid #cdc7c7`,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		cursor: 'pointer',
		borderRadius: '5px',
		boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
		'&:hover': {
			backgroundColor: color.grayLight,
		}
	},
	datePickerButton: {
		height: '2rem',
		backgroundColor: color.darkBlue,
		color: color.white,
		fontWeight: '400',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: color.darkBlue
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
	}
}))
