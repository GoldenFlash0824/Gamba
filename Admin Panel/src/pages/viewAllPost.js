import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme } from '@material-ui/core'
import { MDBDataTableV5 } from 'mdbreact'
import { SearchSharp, Visibility } from '@material-ui/icons'
import { color, toastStyle } from '../assets/css/commonStyle'
import { toast } from 'react-toastify'
import DeleteModal from '../components/common/DeleteModal'
import ViewUserDetails from '../components/post/ViewPostDetails'
import { api } from '../api/callAxios'
import SwipeableViews from 'react-swipeable-views'
import { HowToReg } from '@material-ui/icons'
import ImageViewer from 'react-simple-image-viewer'
import TextWithSeeMore from '../components/common/ReadMore'

const ViewAllPost = forwardRef((props, ref) => {
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

	const [deletedReport, setDeletedReport] = useState({})
	const [deletedPost, setdeletedPost] = useState({})
	const [reportedPostCount, setreportedPostCount] = useState(0)
	const [blockPostCount, setblockPostCount] = useState(0)
	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	const [remaining, setRemaining] = useState(0)
	const [totalPosts, setTotalPosts] = useState(0)
	const [users, setUsers] = useState({
		columns: [
			{
				label: 'Post Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'User id', field: 'u_id', width: 200, sort: String('disabled') },
			{ label: 'User Name', field: 'user_name', width: 200, sort: String('disabled') },
			{ label: 'Date Posted', field: 'posted', width: 200, sort: String('disabled') },
			{ label: ' Photo', field: 'photo', width: 270 },
			{ label: 'Title', field: 'title', width: 200, sort: String('disabled') },
			{ label: 'Description', field: 'description', width: 270 },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') },

		],
		rows: []
	})

	const [allPost, setAllPost] = useState({
		columns: [
			{
				label: 'Post Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'User id', field: 'u_id', width: 200, sort: String('disabled') },
			{ label: 'User Name', field: 'user_name', width: 200, sort: String('disabled') },
			{ label: 'Date Posted', field: 'posted', width: 200, sort: String('disabled') },
			{ label: ' Photo', field: 'photo', width: 270 },
			{ label: 'Title', field: 'title', width: 200, sort: String('disabled') },
			{ label: 'Description', field: 'description', width: 270 },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') },
			{ label: 'Delete', field: 'action', width: 200, sort: String('disabled') },
			// { label: 'Block', field: 'block', width: 200, sort: String('disabled') },

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

	const [post, setpost] = useState({
		columns: [
			{
				label: 'Post Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'User id', field: 'u_id', width: 200, sort: String('disabled') },
			{ label: 'User Name', field: 'user_name', width: 200, sort: String('disabled') },
			{ label: 'Date Posted', field: 'posted', width: 200, sort: String('disabled') },
			{ label: ' Photo', field: 'photo', width: 270 },
			{ label: 'Title', field: 'title', width: 200, sort: String('disabled') },
			{ label: 'Description', field: 'description', width: 270 },
			{ label: 'Report', field: 'report', width: 270 },

			{ label: 'Delete', field: 'action', width: 200, sort: String('disabled') },
			{ label: 'Block', field: 'block', width: 200, sort: String('disabled') },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	useEffect(() => {
		if (value === 0) {
			viewAllPostData()
		}
		if (value === 1) {
			viewAllPost()
		}
		if (value === 2) {
			viewAllBlockPost()
		}
	}, [value, page])


	// router.get('/get_all_posts', verifyAdminAuthToken(), adminController.getAllPosts)
	// router.get('/search_posts', veri

	const viewAllPostData = () => {
		setLoading(true)
		api.get(`/admin/get_all_posts?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					setAllPost((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					if (response.data.data.posts.length >= 0) {
						setblockPostCount(response?.data?.data?.block_Post_count)
						setreportedPostCount(response?.data?.data?.reported_Post_count)
						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)
						setTotalPosts(response.data.data.total)
						response.data.data.posts.map((data, index) => {
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

	const viewAllPost = () => {
		setLoading(true)
		api.get(`/admin/get_all_reported_Post?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					setpost((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})

					if (response.data.data.reportedEvent.length >= 0) {

						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)
						setreportedPostCount(response.data.data.reported_Post_count)
						setblockPostCount(response.data.data.block_Post_count)
						response.data.data.reportedEvent.map((data, index) => {
							createReportdedPostTable(data)
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

	const viewAllBlockPost = () => {
		setLoading(true)
		api.get(`/admin/all_block_post?page=${page}`)
			.then((response) => {
				if (response.data.success === true) {
					console.log('block post data ', response.data.data)

					if (response.data.data.blockPosts.length >= 0) {
						setUsers((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						setblockPostCount(response.data.data?.total)
						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)
						response.data.data.blockPosts.map((data, index) => {
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
		api.delete(value === 0 ? `/admin/delete_post/${id}` : `/admin/delete_reported_post/${id}/${post_id}`)
			.then((response) => {
				setLoading(false)
				setdeletePostData(false)

				if (value === 0) {
					viewAllPostData()
				}
				if (value === 1) {
					viewAllPost()
				}
				if (value === 2) {
					viewAllBlockPost()
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

	const unblockPost = (post_id) => {
		setLoading(true)
		api.post(`/admin/unblock_post`, {
			post_id: post_id
		})
			.then((response) => {
				setLoading(false)
				setunblockModel(false)
				if (value === 0) {
					viewAllPostData()
				}
				if (value === 1) {
					viewAllPost()
				}
				if (value === 2) {
					viewAllBlockPost()
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
				if (value === 0) {
					viewAllPostData()
				}
				if (value === 1) {
					viewAllPost()
				}
				if (value === 2) {
					viewAllBlockPost()
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
	const blockPostModel = (post_id) => {
		setDeletedReport({ post_id: post_id })
		setDeleteModel(true)
	}

	const doSearch = async (e) => {
		setSearch(e.target.value)
		console.log('search', e.target.value)
		if (value === 0) {
			if (e.target.value.length > 1) {
				await api
					.get(`/admin/search_posts?page=${page}&filter=${e.target.value}`)
					.then((response) => {
						if (response.data.success === true) {
							setAllPost((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
							setRemaining(response.data.data?.remaining)
							setTotalPosts(response.data.data.total)
							response.data.data.posts.map((data, index) => {
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
			if (e.target.value.length === 0) {
				console.log('enter 2')
				if (value === 0) {
					viewAllPostData()
				}
			}
		}

		if (value === 1) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/get_all_reported_post_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success === true) {
							setpost((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							response.data.data.map((data, index) => {
								createReportdedPostTable(data)
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
					viewAllPost()
				}
			}
		}

		if (value === 2) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/get_all_reported_block_post_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success === true) {
							setUsers((preValue) => {
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
			if (e.target.value.length === 0) {
				console.log('enter 2')
				if (value === 2) {
					viewAllBlockPost()
				}
			}
		}
	}
	const viewPost = (row) => {
		setEditUser(row)
		setSearch('')
	}
	const goBackAllPost = () => {
		setEditUser(null)
		if (value === 0) {
			viewAllPostData()
		}
		if (value === 1) {
			viewAllPost()
		}
		if (value === 2) {
			viewAllBlockPost()
		}
	}
	//in use

	const createPostTable = (row) => {
		let _obj = {
			id: row.id,
			photo: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row.images[0]}`} alt="" />,
			user_name: row?.user.first_name,
			description: <TextWithSeeMore text={row?.description} maxLength={200} />,
			u_id: row?.user.id,
			title: row?.title,
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
			// block: (
			// 	<Button
			// 		variant="contained"
			// 		color="secondary"
			// 		className={classes.saveButton}
			// 		style={{ marginLeft: '16px' }}
			// 		onClick={() => row?.status ? unblockPostModel(row.id) : blockPostModel(row.id)}
			// 	>
			// 		{row?.status ? 'unblock' : 'Block'}

			// 	</Button>
			// ),
			action: [
				<Button color="secondary" className={classes.saveButton} onClick={() => deletePostModel(row.id, row.id)}>
					delete
				</Button>
			]
		}
		setAllPost((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createReportdedPostTable = (row) => {
		let _obj = {
			id: row.post_id,
			photo: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row.reported_post.images[0]}`} alt="" />,
			user_name: row.reported_post.user.first_name,
			description: <TextWithSeeMore text={row.reported_post.description} maxLength={200} />,
			u_id: row.reported_post.user.id,
			title: row.reported_post.title,
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
			report: (
				<div className={classes.flexWrapper}>
					<div className={classes.flex}>
						<img
							className={classes.image}
							src={row.user_that_report?.first_name ? `${process.env.REACT_APP_IMAGE_URL}/${row.user_that_report?.first_name?.toLowerCase()[0] + '.png'}` : `${process.env.REACT_APP_IMAGE_URL}/palz.png`}
							alt=""
						/>
						<div className={classes.userName}>{row.user_that_report.first_name ? row.user_that_report.first_name + ' ' + row.user_that_report.last_name : '-'}</div>
						<br />
					</div>
					{row?.reason && <div className={classes.reasonContent}>{row?.reason}</div>}
				</div>
			),
			block: (
				<Button

					color="secondary"
					className={classes.saveButton}
					style={{ marginLeft: '16px' }}
					onClick={() => blockPostModel(row.post_id)}
				>
					Block
				</Button>
			),
			action: [
				<Button color="secondary" className={classes.saveButton} onClick={() => deletePostModel(row.id, row.post_id)}>
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
		let _obj = {
			id: row.id,
			photo: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row.images[0]}`} alt="" />,
			user_name: row?.user.first_name,
			description: <TextWithSeeMore text={row?.description} maxLength={200} />,
			u_id: row?.user.id,
			title: row?.title,

			action: [
				<Button color="secondary" className={classes.saveButton} onClick={() => unblockPostModel(row.id)}>
					unblock
				</Button>
			],
			view: (
				<Avatar variant="square" className={classes.viewButton} onClick={() => viewPost(row)}>
					<Visibility className={classes.icon} />
				</Avatar>
			)
		}
		setUsers((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
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
									Posts
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
									<Tab className={classes.tabHeading} label={`Posts (${totalPosts})`} icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label={`Reported Posts (${reportedPostCount})`} icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label={`Block Posts (${blockPostCount})`} icon={<HowToReg className={classes.tabIcon} />} />
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
												data={allPost}
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
												data={post}
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
												className="customTableResponsive"
												responsive={true}
												hover
												entriesOptions={[15, 30, 50]}
												entries={15}
												pagesAmount={4}
												data={users}
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
				<ViewUserDetails user={editUser} goBackAllProduct={goBackAllPost} allBlockPost={viewAllBlockPost} tabActive={value === 0 || value === 2} />
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
		color: 'gray'
	}
}))
