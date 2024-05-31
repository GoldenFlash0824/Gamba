import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme } from '@material-ui/core'
import { MDBDataTableV5 } from 'mdbreact'
import { SearchSharp, Visibility } from '@material-ui/icons'
import { color, toastStyle } from '../assets/css/commonStyle'
import { toast } from 'react-toastify'
import DeleteModal from '../components/common/DeleteModal'
import ViewProductDetails from '../components/product/ViewProductDetails'
import { api } from '../api/callAxios'

import SwipeableViews from 'react-swipeable-views'
import { HowToReg } from '@material-ui/icons'
import ImageViewer from 'react-simple-image-viewer'

const ViewAllProduct = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		openViewAllUserPage() {
			setEditUser(null)
		}
	}))

	const classes = useStyles()
	const theme = useTheme()
	const [editUser, setEditUser] = useState(null)
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [value, setValue] = useState(0)

	const [previewImageModel, setPreviewImageModel] = useState(false)
	const [previewImage, setPreviewImage] = useState(false)

	const [deletedReport, setDeletedReport] = useState({})
	const [deleteUserModel, setDeleteModel] = useState(false)
	const [deletedGroup, setDeletedGroup] = useState({})
	const [blockpost, setblockpost] = useState(false)
	const [reportedProductCount, setreportedProductCount] = useState(0)
	const [blockProductCount, setblockProductCount] = useState(0)
	const [unblockModel, setunblockModel] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	const [remaining, setRemaining] = useState(0)
	const [totalProducts, setTotalProducts] = useState(0)

	const [products, setProducts] = useState({
		columns: [
			{
				label: 'Product Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: ' Image', field: 'image', width: 270 },
			{ label: ' Date Posted', field: 'date', width: 270 },
			{ label: 'Seller', field: 'seller', width: 200, sort: String('disabled') },
			{ label: 'Product Name', field: 'title', width: 270 },

			{ label: 'In Stock', field: 'in_stock', width: 200, sort: String('disabled') },
			{ label: 'Sold Quantity', field: 'sold', width: 200, sort: String('disabled') },
			{ label: 'Product Is For', field: 'idFor', width: 200, sort: String('disabled') },
			{ label: 'Price', field: 'price', width: 200, sort: String('disabled') },
			{ label: 'Sold $', field: 'total_sold', width: 200, sort: String('disabled') },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') },
			// { label: 'Block', field: 'block', width: 200, sort: String('disabled') }
		],

		rows: []
	})

	const [blockProduct, setblockProduct] = useState({
		columns: [
			{
				label: 'Product Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: ' Image', field: 'image', width: 270 },
			{ label: ' Date Posted', field: 'date', width: 270 },
			{ label: 'Seller', field: 'seller', width: 200, sort: String('disabled') },
			{ label: 'Product Name', field: 'title', width: 270 },

			{ label: 'In Stock', field: 'in_stock', width: 200, sort: String('disabled') },
			{ label: 'Sold Quantity', field: 'sold', width: 200, sort: String('disabled') },
			{ label: 'Product Is For', field: 'idFor', width: 200, sort: String('disabled') },
			// { label: 'Sold $', field: 'total_sold', width: 200, sort: String('disabled') },
			{ label: 'Report', field: 'report', width: 200, sort: String('disabled') },
			{ label: 'Location', field: 'location', width: 200, sort: String('disabled') },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') },

			{ label: 'unblock', field: 'block', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	//in use
	const [reportedProduct, setreportedProduct] = useState({
		columns: [
			{
				label: 'Product Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: ' Image', field: 'image', width: 270 },
			{ label: ' Date Posted', field: 'date', width: 270 },
			{ label: 'Seller', field: 'seller', width: 200, sort: String('disabled') },
			{ label: 'Product Name', field: 'title', width: 270 },

			{ label: 'In Stock', field: 'in_stock', width: 200, sort: String('disabled') },
			{ label: 'Sold Quantity', field: 'sold', width: 200, sort: String('disabled') },
			// {label: 'Remaining Quantity', field: 'remaining_quantity', width: 200, sort: String('disabled')},
			{ label: 'Product Is For', field: 'idFor', width: 200, sort: String('disabled') },
			{ label: 'Sold $', field: 'total_sold', width: 200, sort: String('disabled') },
			{ label: 'Report', field: 'report', width: 200, sort: String('disabled') },
			{ label: 'Location', field: 'location', width: 200, sort: String('disabled') },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') },

			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') },
			{ label: 'Block', field: 'block', width: 200, sort: String('disabled') }
		],

		rows: []
	})

	//for demoo

	useEffect(() => {

		if (value === 0) {
			viewAllProducts()
		}
		if (value === 1) {
			viewAllReportedProduct()
		}
		if (value === 2) {
			viewAllBlockProduct()
		}
	}, [value, page])


	const viewAllProducts = () => {
		setLoading(true)
		api.get(`/admin/get_all_products?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					setProducts((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					setreportedProductCount(response.data.data?.reported_product_count)
					setblockProductCount(response.data.data?.block_product_count)
					if (response.data.data.products.length >= 0) {

						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)

						setTotalProducts(response.data.data?.total)

						response.data.data.products.map((data, index) => {
							createProductTable(data)
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

	const viewAllReportedProduct = () => {
		setLoading(true)
		api.get(`/admin/get_all_reported_product?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					setreportedProduct((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					if (response.data.data.reportedProduct.length >= 0) {
						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)
						setreportedProductCount(response.data.data.reported_product_count)
						setblockProductCount(response.data.data.block_product_count)


						response.data.data.reportedProduct.map((data, index) => {
							createReportedProductTable(data)
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
	const viewAllBlockProduct = () => {
		setLoading(true)
		api.get(`/admin/all_block_Product?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					setblockProduct((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					if (response.data.data.reportedProduct.length >= 0) {
						setblockProductCount(response.data.data?.count)
						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)
						response.data.data.reportedProduct.map((data, index) => {
							createBlockProductTable(data)
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

	const blockPost = (product_id) => {
		setLoading(true)
		api.post(`/admin/block_product`, {
			product_id: product_id
		})
			.then((response) => {
				setLoading(false)
				setblockpost(false)
				if (value === 0) {
					viewAllProducts()
				}
				if (value === 1) {
					viewAllReportedProduct()
				}
				if (value === 2) {
					viewAllBlockProduct()
				}
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const deleteReportedProduct = (id, product_id) => {
		setLoading(true)
		api.delete(value === 0 ? `/admin/delete_product_good/${product_id}` : `/admin/delete_product/${id}/${product_id}`)
			.then((response) => {
				setLoading(false)
				setDeleteModel(false)
				if (value === 0) {
					viewAllProducts()
				}
				if (value === 1) {
					viewAllReportedProduct()
				}
				if (value === 2) {
					viewAllBlockProduct()
				}

				toast.success('Product deleted successful')
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const unblockProduct = (product_id) => {
		setLoading(true)
		api.post(`/admin/unblock_product`, {
			product_id: product_id
		})
			.then((response) => {
				setLoading(false)
				setunblockModel(false)
				if (value === 0) {
					viewAllProducts()
				}
				if (value === 1) {
					viewAllReportedProduct()
				}
				if (value === 2) {
					viewAllBlockProduct()
				}
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const deleteReportModel = (id, product_id) => {
		setDeletedReport({ id: id, product_id: product_id })
		setDeleteModel(true)
	}

	const blockProductModel = (product_id) => {
		setDeletedGroup({ product_id: product_id })
		setblockpost(true)
	}
	const unblockProductModel = (product_id) => {
		setDeletedGroup({ product_id: product_id })
		setunblockModel(true)
	}

	const doSearch = async (e) => {
		setSearch(e.target.value)
		console.log('search', e.target.value)

		if (value === 0) {
			if (e.target.value.length > 1) {
				await api
					.get(`/admin/search_products?page=${page}&query=${e.target.value}`)
					.then((response) => {
						setProducts((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						if (response.data.data.products.length >= 0) {
							setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
							setRemaining(response.data.data?.remaining)

							setTotalProducts(response.data.data?.total)

							response.data.data.products.map((data, index) => {
								createProductTable(data)
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
			if (e.target.value.length === 0) {
				console.log('enter 2')
				if (value === 0) {
					viewAllProducts()
				}
			}
		}
		if (value === 1) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/get_all_reported_product_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success === true) {
							setreportedProduct((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							response.data.data.map((data, index) => {
								createReportedProductTable(data)
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
			if (e.target.value.length === 0) {
				console.log('enter 2')
				if (value === 1) {
					viewAllReportedProduct()
				}
			}
		}

		if (value === 2) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/get_all_block_product_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success === true) {
							setblockProduct((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							response.data.data.map((data, index) => {
								createBlockProductTable(data)
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
			if (e.target.value.length === 0) {
				console.log('enter 2')
				if (value === 2) {
					viewAllBlockProduct()
				}
			}
		}
	}

	const createReportedProductTable = (row) => {
		console.log('trade', row)
		let _obj = {
			id: row.product_id,
			date: new Date(row.createdAt).toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
				year: '2-digit'
			}),
			sold: row.reported_product.total_sold,
			total_sold: row.reported_product.sold$,
			seller: row?.reported_product?.user?.first_name,
			title: row?.reported_product?.name,
			image: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.reported_product?.images[0]}`} alt="" />,
			in_stock: row?.reported_product?.quantity > 0 ? 'yes' : 'no',
			// remaining_quantity: row.reported_product.quantity,
			location: 'Los Angeles',
			report: <div className={classes.flexWrapper}>
				<div className={classes.flex}>
					<img className={classes.image} src={row.user_that_report_product?.first_name ? `${process.env.REACT_APP_IMAGE_URL}/${row.user_that_report_product?.first_name?.toLowerCase()[0] + '.png'}` : `${process.env.REACT_APP_IMAGE_URL}/palz.png`} alt="" />
					<div className={classes.userName}>{row.user_that_report_product.first_name ? row.user_that_report_product.first_name + row.user_that_report_product.last_name : '-'}</div>
					<br />
				</div>
				{row?.reason && <div className={classes.reasonContent}>{row?.reason}</div>}
			</div>,
			idFor: row?.reported_product?.is_donation ? 'Giveaway' : row?.reported_product?.is_trade ? 'Trade' : row?.reported_product?.discount > 0 ? 'Discounted' : 'Sell',
			view: (
				<Avatar variant="square" onClick={() => ViewProduct(row)} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			action: (
				<Button color="secondary" className={classes.saveButton} onClick={() => deleteReportModel(row.id, row.product_id)}>
					delete
				</Button>
			),
			block: (
				<Button color="secondary" className={classes.saveButton} onClick={() => row.is_block ? unblockProductModel(row.id) : blockProductModel(row.product_id)}>
					{row.is_block ? 'unBlock' : 'block'}
				</Button>
			)
		}

		// onClick={() => deleteReportModel(row.id, row.product_id)}
		setreportedProduct((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createProductTable = (row) => {
		console.log('product', row)
		let _obj = {
			id: row.id,
			date: new Date(row.createdAt).toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
				year: '2-digit'
			}),
			sold: row?.total_sold ? row?.total_sold : 0,
			total_sold: row?.sold$ ? row?.sold$ : 0,
			seller: <div className={classes.flexed}>
				<div ><img className={classes.image} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.user?.image ? row?.user?.image : row?.user?.first_name.toLowerCase()[0] + '.png'}`} alt="" /></div>
				{row?.user?.first_name}
			</div>,
			title: row?.name,
			price: row?.discount ? (row?.price - (row?.discount / 100) * row?.price)?.toFixed(2) + '$' : row?.price?.toFixed(2) + '$',
			image: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.images[0]}`} alt="" />,
			in_stock: 'Unlimited',
			idFor: row?.is_donation ? 'Giveaway' : row?.is_trade ? 'Trade' : row?.discount > 0 ? 'Discounted' : 'Sell',
			view: (
				<Avatar variant="square" onClick={() => ViewProduct(row)} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			action: (
				<Button color="secondary" className={classes.saveButton} onClick={() => deleteReportModel(row.id, row.id)}>
					delete
				</Button>
			),
			block: (
				<Button color="secondary" className={classes.saveButton} onClick={() => row.is_block ? unblockProductModel(row.id) : blockProductModel(row.id)}>
					{row.is_block ? 'unBlock' : 'block'}
				</Button>
			)
		}

		// onClick={() => deleteReportModel(row.id, row.product_id)}
		setProducts((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createBlockProductTable = (row) => {
		console.log('========row', row)
		let _obj = {
			id: value === 2 ? row?.id : row.product_id,
			date: new Date(row.createdAt).toLocaleDateString('en-US', {
				month: 'numeric',
				day: 'numeric',
				year: '2-digit'
			}),
			seller: row?.reported_product?.user?.first_name,
			title: row?.reported_product?.name,
			image: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.reported_product?.images[0]}`} alt="" />,
			in_stock: 'Unlimited',
			view: (
				<Avatar variant="square" onClick={() => ViewProduct(row)} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			report: <div className={classes.flexWrapper}>
				<div className={classes.flex}>
					<img className={classes.image} src={row.user_that_report_product?.first_name ? `${process.env.REACT_APP_IMAGE_URL}/${row.user_that_report_product?.first_name?.toLowerCase()[0] + '.png'}` : `${process.env.REACT_APP_IMAGE_URL}/palz.png`} alt="" />
					<div className={classes.userName}>{row.user_that_report_product.first_name ? row.user_that_report_product.first_name + row.user_that_report_product.last_name : '-'}</div>
					<br />
				</div>
				{row?.reason && <div className={classes.reasonContent}>{row?.reason}</div>}
			</div>,
			idFor: row?.reported_product?.is_donation ? 'Giveaway' : row?.reported_product?.is_trade ? 'Trade' : row?.reported_product?.discount > 0 ? 'Discounted' : 'Sell',
			block: (
				<Button color="secondary" className={classes.saveButton} onClick={() => row?.reported_product.is_block ? unblockProductModel(row?.reported_product.id) : blockProductModel(row.product_id)}>
					{row?.reported_product ? 'unBlock' : 'unblock'}
				</Button>
			)
		}

		// onClick={() => deleteReportModel(row.id, row.product_id)}
		setblockProduct((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const goBackAllProduct = () => {
		setEditUser(null)
		if (value === 0) {
			viewAllProducts()
		}
		if (value === 1) {
			viewAllReportedProduct()
		}
		if (value === 2) {
			viewAllBlockProduct()
		}
	}
	const ViewProduct = (row) => {
		console.log('product click11')
		setSearch('')
		setEditUser(row)
	}

	const handleChange = (event, newValue) => {
		setValue(newValue)
		setSearch('')
		setPage(1)
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
			{editUser === null ? (
				<>
					<div className={classes.root}>
						<div className='user-search'>
							<div className={classes.header}>
								<Typography variant="h4" className={classes.heading}>
									Products
								</Typography>
							</div>
							<div className={classes.root}>
								<Grid item style={{ width: '350px' }}>
									<TextField className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={(e) => doSearch(e)} />
									<SearchSharp className={classes.inputSearch} />
								</Grid>
							</div>
						</div>
						<br></br>
						<div className={classes.root1}>
							<AppBar position="static" color="default">
								<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">

									<Tab className={classes.tabHeading} label={` Products(${totalProducts})`} icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label={`Reported Products(${reportedProductCount})`} icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label={`Block Products (${blockProductCount})`} icon={<HowToReg className={classes.tabIcon} />} />
								</Tabs>
							</AppBar>
							<SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} onChangeIndex={handleChangeIndex}>
								<TabPanel id="resturantTable" value={value} index={0} dir={theme.direction}>
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
												entries={80}
												pagesAmount={4}
												data={products}
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
								<TabPanel id="resturantTable" value={value} index={1} dir={theme.direction}>
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
												entries={80}
												pagesAmount={4}
												data={reportedProduct}
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
												// className="customTableResponsive"
												responsive={true}
												hover
												entriesOptions={[15, 30, 50]}
												entries={15}
												pagesAmount={4}
												data={blockProduct}
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
							</SwipeableViews>
						</div>
					</div>
				</>
			) : (
				<ViewProductDetails user={editUser} goBackAllProduct={goBackAllProduct} tabActive={value === 0} />
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
			<DeleteModal open={blockpost} close={() => setblockpost(false)} title="block product" message="Are you sure you want to Block Product" deleteButtonText="block" deleteAction={() => blockPost(deletedGroup.product_id)} />
			<DeleteModal
				open={deleteUserModel}
				close={() => setDeleteModel(false)}
				title={value === 0 ? "Delete Product" : "Delete Reported Product"}
				message={"Are you sure you want to Delete Product You cannot undo this action."}
				deleteButtonText={value === 0 ? "Delete Product" : "Delete Reported Product"}
				deleteAction={() => deleteReportedProduct(deletedReport.id, deletedReport.product_id)}
			/>

			<DeleteModal
				open={unblockModel}
				close={() => setunblockModel(false)}
				title="unblock product"
				message="Are you sure you want to  unblock Product"
				deleteButtonText="unblock product"
				deleteAction={() => unblockProduct(deletedGroup.product_id)}
			/>
		</>
	)
})

export default ViewAllProduct

const useStyles = makeStyles((theme) => ({
	root: {

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

		fontSize: '28px',
		color: color.black
	},
	icon: {
		fontSize: '22px !important'
	},
	viewButton: {
		backgroundColor: color.black,
		width: '35px',
		height: '36px',
		cursor: 'pointer',
		borderRadius: '4px',
		boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)'
	},
	removeButton: {
		backgroundColor: color.red,
		width: '35px',
		height: '32px',
		cursor: 'pointer',
		borderRadius: '4px',
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
	image: {
		width: '2.0rem',
		height: '2.0rem',
		borderRadius: '50%',
		marginRight: '0.2rem',
		objectFit: 'cover',
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
		marginTop: '1.7rem',
		/* margin-right: -22rem; */
		marginLeft: '-2rem',
		color: 'gray',
	},
	flexed: {
		display: 'flex',
		gap: '0.5rem',
		alignItems: 'center'
	},
}))
