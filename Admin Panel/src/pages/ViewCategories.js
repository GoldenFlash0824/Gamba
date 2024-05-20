import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme } from '@material-ui/core'
import { MDBDataTableV5 } from 'mdbreact'
import { SearchSharp, Visibility } from '@material-ui/icons'
import { color, toastStyle } from '../assets/css/commonStyle'
import { toast } from 'react-toastify'
import DeleteModal from '../components/common/DeleteModal'
import ViewCategory from '../components/category/ViewCategoryDetails'
import { api } from '../api/callAxios'

import SwipeableViews from 'react-swipeable-views'
import { HowToReg } from '@material-ui/icons'
import ImageViewer from 'react-simple-image-viewer'
import AddModal from '../components/common/AddModal'

const ViewAllCategories = forwardRef((props, ref) => {
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
	const [name, setName] = useState('')
	const [categoryCount, setcategoryCount] = useState(0)

	const [previewImageModel, setPreviewImageModel] = useState(false)
	const [previewImage, setPreviewImage] = useState(false)
	const [deleteCategory, setdeleteCategory] = useState({})
	const [deleteUserModel, setDeleteModel] = useState(false)
	const [enableModel, setEnableModel] = useState(false)
	const [deletedGroup, setDeletedGroup] = useState({})
	const [deleteGroupData, setDeleteGroupData] = useState(false)
	const [openModel, setOpenModel] = useState(false)
	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	const [remaining, setRemaining] = useState(0)
	const [users, setUsers] = useState({
		columns: [
			{
				label: 'Event Id',
				field: 'eventId',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'event Name', field: 'full_name', width: 270 },
			{ label: 'event description', field: 'email', width: 270 },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') }
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
			{ label: 'Full Name', field: 'full_name', width: 270 },
			{ label: 'Email', field: 'email', width: 270 },
			{ label: 'Total Reports', field: 'totalreason', width: 270 },
			{ label: 'Users', field: 'user', width: 270 },
			{ label: 'Block User', field: 'status', width: 200, sort: String('disabled') }
		],
		rows: []
	})
	//in use
	const [categorydata, setcategorydata] = useState({
		columns: [
			{
				label: 'Categorie Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: ' Title', field: 'title', width: 270 },
			{ label: ' Status', field: 'status', width: 270 },


			{ label: 'Edit', field: 'view', width: 200, sort: String('disabled') },

			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') }
		],

		rows: []
	})

	//for demoo

	useEffect(() => {
		viewAllcategorydata()
	}, [value, page])

	const viewAllcategorydata = () => {
		setLoading(true)
		api.get(`/user/product/get_all_category?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					if (response.data.data.category.length > 0) {
						setcategoryCount(response.data.data.categoryCount)
						setcategorydata((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)
						response.data.data.category.map((data, index) => {
							createCategoryTable(data)
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
				viewAllcategorydata()
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const deletecategorydata = (id, isEnable = false) => {
		setLoading(true)
		api.delete(`/admin/delete_category/${id}/${isEnable}`)
			.then((response) => {
				setLoading(false)
				setDeleteModel(false)
				setEnableModel(false)
				viewAllcategorydata()
				if (response?.data?.message) {
					toast.success(response?.data?.message)
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

	const addcategorydata = () => {
		setLoading(true)
		api.post(`/admin/add_category`, {
			category_title: name
		})
			.then((response) => {
				setLoading(false)
				// setDeleteModel(false)
				setOpenModel(false)
				viewAllcategorydata()
			})
			.catch(function (error) {
				setLoading(false)
				toast.error('Something went wrong. Please try again later.', {
					position: toastStyle.position,
					autoClose: toastStyle.closeDuration
				})
			})
	}

	const deleteCategoryModel = (data) => {
		setdeleteCategory({ id: data?.id, data: data })
		data?.disabled ? setEnableModel(true) : setDeleteModel(true)
	}

	const doSearch = async (e) => {
		setSearch(e.target.value)
		console.log('search', e.target.value)
		if (e.target.value.length > 1) {
			await api
				.post(`/admin/category_search`, {
					search: e.target.value
				})
				.then((response) => {
					if (response.data.success === true) {
						setcategorydata((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						response.data.data.category.map((data, index) => {
							createCategoryTable(data)
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
				viewAllcategorydata()
			}
		}
	}

	const createCategoryTable = (row) => {
		let _obj = {
			id: row.id,
			title: row.title,

			view: (
				<Avatar variant="square" onClick={() => ViewProduct(row)} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			status: row?.disabled ? 'Disable' : 'Enable',
			action: (
				<Button color="secondary" className={classes.saveButton} onClick={() => deleteCategoryModel(row)}>
					{row.disabled ? 'enable' : 'delete'}
				</Button>
			)
		}

		// onClick={() => deleteCategoryModel(row.id, row.product_id)}
		setcategorydata((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const goBackAllCategory = () => {
		setEditUser(null)
		viewAllcategorydata()
	}
	const ViewProduct = (row) => {
		setEditUser(row)
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
			{editUser === null ? (
				<>
					<div className={classes.root}>
						<div className={classes.header}>
							<Typography variant="h4" className={classes.heading}>
								Categories
							</Typography>

						</div>

						{/* search baaar */}
						<div className={`${classes.root} user-search`}>
							<Grid item xs={12} md={3}>
								<TextField className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={(e) => doSearch(e)} />
								<SearchSharp className={classes.inputSearch} />
							</Grid>
							<Typography variant="h6" className={classes.heading}>
								<Button variant='contained' color="secondary" className={`${classes.addButton} add-category`} onClick={() => setOpenModel(true)}>
									Add category
								</Button>
							</Typography>
						</div>
						<br></br>
						<div className={classes.root1}>
							<AppBar position="static" color="default">
								<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
									<Tab className={classes.tabHeading} label={`Categories (${categoryCount})`} icon={<HowToReg className={classes.tabIcon} />} />
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
												entriesOptions={[15, 30, 50]}
												entries={15}
												pagesAmount={4}
												data={categorydata}
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
											<div style={{ height: '30rem' }}></div>
										</>
									) : (
										<MDBDataTableV5 className="customTableResponsive" responsive={true} hover entriesOptions={[15, 30, 50]} entries={15} pagesAmount={4} data={users} fullPagination searchTop={false} searchBottom={false} />
									)}
								</TabPanel>
								<TabPanel value={value} index={2} dir={theme.direction}>
									{loading ? (
										<>
											<div id="loader-div" style={{ width: '88%' }}>
												<div id="loadings"></div>
											</div>
											<div style={{ height: '30rem' }}></div>
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
				<ViewCategory user={editUser} goBackAllCategory={goBackAllCategory} />
			)}
			<AddModal
				open={openModel}
				close={() => setOpenModel(false)}
				title="Add Categories"
				message={`Do you really want to ${deleteCategory.title === 'unblock' ? 'UnBlock User' : 'Block User'}? You cannot undo this action.`}
				deleteButtonText={deleteCategory.title === 'unblock' ? 'UnBlock User' : 'Block User'}
				setName={setName}
				addAction={() => {
					addcategorydata()
				}}
				addButtonText="Save"
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
			<DeleteModal
				open={deleteGroupData}
				close={() => setDeleteGroupData(false)}
				title="Delete group"
				message="Do you really want to delete category? You cannot undo this action."
				deleteButtonText="Delete category"
				deleteAction={() => deleteGroup(deletedGroup.id)}
			/>
			<DeleteModal
				open={deleteUserModel}
				close={() => setDeleteModel(false)}
				title={deleteCategory?.data?.usedInProducts === 0 ? "Delete Category" : "Disable Category"}
				message={deleteCategory?.data?.usedInProducts === 0 ? "Are you sure you want to delete category ? You cannot undo this action" : "You cannot delete or change this category. There are transactions associated with it. You can disable it and create a new category"}
				deleteButtonText={deleteCategory?.data?.usedInProducts === 0 ? "Delete Category" : "Disable Category"}
				deleteAction={() => deletecategorydata(deleteCategory.id)}
			/>

			<DeleteModal
				open={enableModel}
				close={() => setEnableModel(false)}
				title={"Enable Category"}
				message={"Are you sure you want to enable category ?"}
				deleteButtonText={"Enable Category"}
				deleteAction={() => deletecategorydata(deleteCategory.id, true)}
			/>
		</>
	)
})

export default ViewAllCategories

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
		margin: '8px 0px 0px 0px',
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
	addButton: {
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
	inputSearch: {
		position: 'absolute',
		marginTop: '1.7rem',
		/* margin-right: -22rem; */
		marginLeft: '-2rem',
		color: 'gray',
	}
}))
