import React, { useState, useEffect, forwardRef } from 'react'
import { Grid, makeStyles, Typography, Avatar, TextField, Button, AppBar, Tabs, Tab, Box, useTheme } from '@material-ui/core'
import { MDBDataTableV5 } from 'mdbreact'
import { SearchSharp, Visibility } from '@material-ui/icons'
import { color, toastStyle } from '../assets/css/commonStyle'
import { toast } from 'react-toastify'
import DeleteModal from '../components/common/DeleteModal'
import ViewEventDetails from '../components/event/ViewEventDetails'
import { api } from '../api/callAxios'
import SwipeableViews from 'react-swipeable-views'
import { HowToReg } from '@material-ui/icons'
import ImageViewer from 'react-simple-image-viewer'
import moment from 'moment-timezone'

const ViewAllEvents = () => {
	const classes = useStyles()
	const theme = useTheme()
	const [editUser, setEditUser] = useState(null)
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [value, setValue] = useState(0)
	const [deleteUserModel, setDeleteModel] = useState(false)
	const [deleteEventData, setDeleteEventData] = useState(false)
	const [previewImageModel, setPreviewImageModel] = useState(false)
	const [previewImage, setPreviewImage] = useState(false)

	const [deletedReport, setDeletedReport] = useState({})
	const [reportedEventCount, setreportedEventCount] = useState(0)
	const [eventsCount, setEventsCount] = useState(0)
	const [blockEventCount, setblockEventCount] = useState(0)
	const [deletedevent, setDeletedEvent] = useState({})
	const [unblockModel, setunblockModel] = useState(false)

	const [page, setPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	const [remaining, setRemaining] = useState(0)
	const [events, setEvents] = useState({
		columns: [
			{
				label: 'Event ID',
				field: 'event_id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'User ID', field: 'u_id', width: 200, sort: String('disabled') },
			{ label: 'Creater', field: 'user_name', width: 200, sort: String('disabled') },
			{ label: 'Image', field: 'photo', width: 270 },
			{ label: 'Event Title', field: 'title', width: 270 },
			{ label: 'Fee', field: 'price', width: 200, sort: String('disabled') },
			{ label: 'Start Date', field: 'start_date', width: 200, sort: String('disabled') },
			{ label: 'End Date', field: 'end_date', width: 200, sort: String('disabled') },
			{ label: 'Purchased', field: 'Purchased', width: 200, sort: String('disabled') },
			// { label: 'View', field: 'view', width: 200, sort: String('disabled') },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') },

		],
		rows: []
	})

	const [users, setUsers] = useState({
		columns: [
			{
				label: 'Event Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'User Id', field: 'u_id', width: 200, sort: String('disabled') },
			{ label: 'User Name', field: 'user_name', width: 200, sort: String('disabled') },
			{ label: ' Photo', field: 'photo', width: 270 },
			{ label: 'Event Title', field: 'title', width: 270 },
			{ label: 'Price', field: 'price', width: 200, sort: String('disabled') },
			{ label: 'Start Date', field: 'start_date', width: 200, sort: String('disabled') },
			{ label: 'End Date', field: 'end_date', width: 200, sort: String('disabled') },
			{ label: 'View', field: 'view', width: 200, sort: String('disabled') },
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
			{ label: 'Full Name', field: 'full_name', width: 270 },
			{ label: 'Email', field: 'email', width: 270 },
			{ label: 'Total Reports', field: 'totalreason', width: 270 },
			{ label: 'Users', field: 'user', width: 270 },
			{ label: 'Block User', field: 'status', width: 200, sort: String('disabled') }
		],
		rows: []
	})

	const [reportedEvent, setreportedEvent] = useState({
		columns: [
			{
				label: 'Event Id',
				field: 'id',
				width: 150,
				attributes: { 'aria-controls': 'DataTable', 'aria-label': 'Name' }
			},
			{ label: 'User Id', field: 'u_id', width: 200, sort: String('disabled') },
			{ label: 'Buyer', field: 'user_name', width: 200, sort: String('disabled') },
			{ label: 'No Tickets', field: 'TicketCount', width: 270 },
			{ label: 'Event Title', field: 'title', width: 270 },
			{ label: 'Total Paid', field: 'price', width: 200, sort: String('disabled') },
			{ label: 'Start Date', field: 'start_date', width: 200, sort: String('disabled') },
			{ label: 'End Date', field: 'end_date', width: 200, sort: String('disabled') },
			// { label: 'Report', field: 'report', width: 200, sort: String('disabled') },

			// { label: 'Block', field: 'block', width: 200, sort: String('disabled') },
			// { label: 'View', field: 'view', width: 200, sort: String('disabled') },
			{ label: 'Action', field: 'action', width: 200, sort: String('disabled') },

		],
		rows: [
			
		]
	})

	useEffect(() => {
		// moment.tz.setDefault('America/New_York');
		if (value == 0) {
			viewAllEvents()
		}
		if (value == 1) {
			viewAllReportedEvents()
		}
		if (value == 2) {
			viewBlockEvents()
		}
	}, [value, page])


	const viewAllEvents = () => {
		setLoading(true)
		api.get(`/admin/get_all_events?page=${page}`)
			.then((response) => {
				if (response.data.success == true) {
					setEvents((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})

					setreportedEventCount(response.data.data?.reported_event_count)
					setblockEventCount(response.data.data?.block_event_count)
					if (response.data.data.events.length >= 0) {
						setEventsCount(response.data.data.count)
						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)
						response.data.data.events.map((data, index) => {
							createEventTable(data)
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

	const viewAllReportedEvents = () => {
		setLoading(true)
		api.get(`/admin/get_all_reported_event?page=${page}`)
			.then((response) => {
				if (response.data.success == true) {
					setreportedEvent((preValue) => {
						return {
							columns: [...preValue.columns],
							rows: []
						}
					})
					if (response.data.data.reportedEvent.length >= 0) {

						setreportedEventCount(response.data.data.reported_event_count)
						setblockEventCount(response.data.data.block_event_count)
						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)
						response.data.data.reportedEvent.map((data, index) => {
							createReportedEventTable(data)
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

	const viewBlockEvents = () => {
		setLoading(true)
		api.get(`/admin/all_block_event?page=${page}`)
			.then((response) => {
				if (response.data.success == true) {
					if (response.data.data.reportedEvent.length >= 0) {
						setUsers((preValue) => {
							return {
								columns: [...preValue.columns],
								rows: []
							}
						})
						setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
						setRemaining(response.data.data?.remaining)
						response.data.data.reportedEvent.map((data, index) => {
							createBlockEventTable(data)
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
	const deleteEvent = (id, event_id) => {
		setLoading(true)
		api.delete(value == 0 ? `/admin/delete_event/${event_id}` : `/admin/delete_reported_event/${id}/${event_id}`)
			.then((response) => {
				setLoading(false)
				setDeleteEventData(false)
				if (value == 0) {
					viewAllEvents()
				}
				if (value == 1) {
					viewAllReportedEvents()
				}
				if (value == 2) {
					viewBlockEvents()
				}
				toast.success('Event deleted successfull')
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
	const blockEvent = (event_id) => {
		setLoading(true)
		api.post(`/admin/block_event`, {
			event_id: event_id
		})
			.then((response) => {
				setLoading(false)
				setDeleteModel(false)
				if (value == 0) {
					viewAllEvents()
				}
				if (value == 1) {
					viewAllReportedEvents()
				}
				if (value == 2) {
					viewBlockEvents()
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

	const unblockEvent = (event_id) => {
		setLoading(true)
		api.post(`/admin/unblock_event`, {
			event_id: event_id
		})
			.then((response) => {
				setLoading(false)
				setunblockModel(false)
				viewBlockEvents()
				if (value == 0) {
					viewAllEvents()
				}
				if (value == 1) {
					viewAllReportedEvents()
				}
				if (value == 2) {
					viewBlockEvents()
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

	const blockEventModel = (event_id) => {
		setDeletedReport({ event_id: event_id })
		setDeleteModel(true)
	}

	const unblockEventModel = (event_id) => {
		setDeletedReport({ event_id: event_id })
		setunblockModel(true)
	}
	const deleteEventModel = (id, event_id) => {
		setDeletedEvent({ id: id, event_id: event_id })
		setDeleteEventData(true)
	}

	const doSearch = async (e) => {
		setSearch(e.target.value)
		console.log('search', e.target.value)

		if (value == 0) {
			if (e.target.value.length > 1) {
				await api
					.get(`/admin/search_event?page=${page}&filter=${e.target.value}`)
					.then((response) => {
						if (response.data.success == true) {
							setEvents((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							if (response.data.data.events.length >= 0) {
								setEventsCount(response.data.data.count)
								setTotalPage(parseInt(parseInt(response.data.data?.count) / 15) + 1)
								setRemaining(response.data.data?.remaining)
								response.data.data.events.map((data, index) => {
									createEventTable(data)
								})
							}
							// response?.data?.data?.events?.map((data, index) => {
							// 	createEventTable(data)
							// })
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
					viewAllEvents()
				}
			}
		}
		if (value == 1) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/get_all_reported_event_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success == true) {
							setreportedEvent((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							response?.data?.data?.map((data, index) => {
								createReportedEventTable(data)
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
				if (value == 1) {
					viewAllReportedEvents()
				}
			}
		}

		if (value == 2) {
			if (e.target.value.length > 1) {
				await api
					.post(`/admin/get_all_reported_block_event_search`, {
						search: e.target.value
					})
					.then((response) => {
						if (response.data.success == true) {
							setUsers((preValue) => {
								return {
									columns: [...preValue.columns],
									rows: []
								}
							})
							response.data.data.map((data, index) => {
								createBlockEventTable(data)
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
				if (value == 2) {
					viewBlockEvents()
				}
			}
		}
	}
	const viewEvent = (row) => {
		setEditUser(row)
		setSearch('')
	}

	//in use
	const createEventTable = (row) => {
		let _obj = {
			event_id: row?.ref_id,
			u_id: row?.eventUser.ref_id,
			user_name: 
			<div className={classes.flexed}>
				<div >
					<img className={classes.image} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.eventUser?.image ? row?.eventUser?.image : row?.eventUser?.first_name.toLowerCase()[0] + '.png'}`} alt="" />
				</div>
				{row?.eventUser?.first_name + ' ' + row?.eventUser.last_name}
			</div>,
			photo: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.image}`} alt="" />,
			title: row?.title,
			price: (<div style={{ textAlign: 'right' }}>{row?.price.toFixed(2)}</div>),
			start_date: moment(row?.start_date).format('MM/DD/YY, hh:mm A'),
			end_date: moment(row?.end_date).format('MM/DD/YY, hh:mm A'),

			view: (
				<Avatar variant="square" onClick={() => { setSearch(''); viewEvent(row) }} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			block: (
				<Button  color="secondary" className={classes.saveButton} onClick={() => blockEventModel(row.id)}>
					block
				</Button>
			),
			action: [
				<div className='d-flex'>
					<Avatar variant="square" onClick={() => { setSearch(''); viewEvent(row) }} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>,
				<Button  color="secondary" className={classes.saveButton} onClick={() => deleteEventModel(row?.eventUser.id, row.id)}>
					delete
				</Button>,
				<Button  color="secondary" className={classes.saveButton} onClick={() => blockEventModel(row.id)}>
				block
			</Button>,
				</div>
			]
		}
		setEvents((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	//in use
	const createReportedEventTable = (row) => {
		let _obj = {
			id: row?.reported_event?.id,
			u_id: row?.u_id,
			user_name: row?.reported_event?.userEvents?.first_name,
			photo: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row?.reported_event?.image}`} alt="" />,
			title: row?.reported_event?.title,
			price: row?.reported_event?.price,
			start_date: moment(row?.reported_event?.start_date).format('MM/DD/YY, hh:mm A'),
			end_date: moment(row?.reported_event?.end_date).format('MM/DD/YY, hh:mm A'),
			report: <div className={classes.flexWrapper}>
				<div className={classes.flex}>
					<img className={classes.image} src={row?.user_that_report_event
						?.first_name ? `${process.env.REACT_APP_IMAGE_URL}/${row?.user_that_report_event
							?.first_name?.toLowerCase()[0] + '.png'}` : `${process.env.REACT_APP_IMAGE_URL}/palz.png`} alt="" />
					<div className={classes.userName}>{row?.user_that_report_event
						.first_name ? row?.user_that_report_event
							.first_name + ' ' + row?.user_that_report_event
						.last_name : '-'}</div>
					<br />
				</div>
				{row?.reason && <div className={classes.reasonContent}>{row?.reason}</div>}
			</div>,

			view: (
				<Avatar variant="square" onClick={() => { setSearch(''); viewEvent(row) }} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			block: (
				<Button  color="secondary" className={classes.saveButton} onClick={() => blockEventModel(row.reported_event.id)}>
					block
				</Button>
			),
			action: [
				<Button  color="secondary" className={classes.saveButton} onClick={() => deleteEventModel(row.id, row.reported_event.id)}>
					delete
				</Button>,
			]
		}
		setreportedEvent((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}

	const createBlockEventTable = (row) => {
		let _obj = {
			id: row.ref_id,
			u_id: row.eventUser.ref_id,
			user_name: row.eventUser.first_name + ' ' + row.eventUser.last_name,
			photo: <img className={classes.posesImages} src={`${process.env.REACT_APP_IMAGE_URL}/${row.image}`} alt="" />,
			title: row.title,
			price: (<div style={{ textAlign: 'right' }}>{row.price.toFixed(2)}</div>),
			start_date: moment(row?.start_date).format('MM/DD/YY, hh:mm A'),
			end_date: moment(row?.end_date).format('MM/DD/YY, hh:mm A'),
			view: (
				<Avatar variant="square" onClick={() => { setSearch(''); viewEvent(row) }} className={classes.viewButton}>
					<Visibility className={classes.icon} />
				</Avatar>
			),
			action: [
				<Button  color="secondary" className={classes.saveButton} onClick={() => unblockEventModel(row.id)}>
					unblock
				</Button>,
			]
		}
		setUsers((preValue) => {
			return {
				columns: [...preValue.columns],
				rows: [...preValue.rows, _obj]
			}
		})
	}
	const goBackAllEvent = () => {
		setEditUser(null)
		if (value == 0) {
			viewAllEvents()
		}
		if (value == 1) {
			viewAllReportedEvents()
		}
		if (value == 2) {
			viewBlockEvents()
		}
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
			{editUser == null ? (
				<>
					<div className={classes.root}>
						<div className='user-search'>
						<div className={classes.header}>
							<Typography variant="h4" className={classes.heading}>
								Events
							</Typography>
						</div>
						<div className={classes.root}>
							<Grid item style={{width: '350px'}}>
								<TextField className={classes.textField} placeholder="Search" fullWidth value={search} onChange={(e) => doSearch(e)} />
								<SearchSharp className={classes.inputSearch} />
							</Grid>
						</div>
						</div>
						<br></br>
						<div className={classes.root1}>
							<AppBar position="static" color="default">
								<Tabs value={value} onChange={handleChange} indicatorColor="primary" textColor="primary" variant="fullWidth">
									<Tab className={classes.tabHeading} label={` Events(${eventsCount})`} icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label={`Attendees(${reportedEventCount})`} icon={<HowToReg className={classes.tabIcon} />} />
									<Tab className={classes.tabHeading} label={`Block Events (${blockEventCount})`} icon={<HowToReg className={classes.tabIcon} />} />
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
												data={events}
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
												data={reportedEvent}
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

								<TabPanel id="resturantTable" value={value} index={2} dir={theme.direction}>
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
									<div className={classes.root}>
										<Grid container>
											{/* <Grid item xs={12} md={3}>
                  <TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="Search" fullWidth value={search} onChange={doSearch} />
                </Grid> */}
										</Grid>
									</div>

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
				<ViewEventDetails user={editUser} goBackAllProduct={goBackAllEvent} tabActive={value == 0} />
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
				open={deleteEventData}
				close={() => setDeleteEventData(false)}
				title="Delete event"
				message="Are you sure you want to delete Event? You cannot undo this action"
				deleteButtonText="Delete event"
				deleteAction={() => deleteEvent(deletedevent.id, deletedevent.event_id)}
			/>

			<DeleteModal open={deleteUserModel} close={() => setDeleteModel(false)} title="block event" message="Are you sure you want to Block Event ." deleteButtonText="block" deleteAction={() => blockEvent(deletedReport.event_id)} />

			<DeleteModal open={unblockModel} close={() => setunblockModel(false)} title="unblock event" message="Are you sure you want to unblock ." deleteButtonText="unblock" deleteAction={() => unblockEvent(deletedReport.event_id)} />
		</>
	)
}

export default ViewAllEvents

const useStyles = makeStyles((theme) => ({
	root: {
		padding: '8px 0px 0px 0px' ,
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
		height: '32px',
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
		padding: '0.4rem !important',
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
	flexed: {
		display: 'flex',
		gap: '0.5rem',
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
