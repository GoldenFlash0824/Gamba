import { BrowserRouter as Router, Route, NavLink, useHistory } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { LoginController } from '../../Redux/Actions/actions'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { Drawer, Box, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, IconButton, Menu, MenuItem, Typography } from '@material-ui/core'
import { BarChart, RecentActors, Settings, Menu as MenuIcon, Close, Block, AccountCircle, ExitToApp } from '@material-ui/icons'
import Home from '../../pages/DashBoard'
import ViewAllUsers from '../../pages/ViewAllUsers'
import ViewAllProduct from '../../pages/ViewAllProduct'
import ViewAllEvents from '../../pages/ViewAllEvents'
import ViewAllPost from '../../pages/viewAllPost'
import ViewAllProductSold from '../../pages/ViewAllProductSold'
import ViewAllManageOrder from '../../pages/ViewAllManageOrder'
import ViewAllPaidOrder from '../../pages/ViewAllPaidOrder'
import ViewUnPaidOrder from '../../pages/ViewUnPaidOrder'
import GambaPaymentHistory from '../../pages/GambaPaymentHistory'
import PayGamba from '../../pages/PayGamba'
import Login from '../../pages/Login'
import Contect from '../../pages/ContectUs'
import ViewAllCategories from '../../pages/ViewCategories'
import ViewAllChemical from '../../pages/ViewChemicals'
import { color } from '../../assets/css/commonStyle'
import UserProfileMenu from './UserProfile'
import ForgotPassword from '../../pages/ForgotPassword'
import UpdatePassword from '../../pages/UpdatePassword'
const drawerWidth = 240

const LeftNavBar = (props) => {
	const _history = useHistory()
	useEffect(() => {
		setIsLogin(props.store.isLogin)

		//setIsLogin(true)
	})
	let token = localStorage.getItem('auth_token')
	useEffect(() => {
		if (token == null && !window.location.pathname?.includes('reset-password')) {
			// window.location.href = '/login'
			_history?.push('/login')
		}
	}, [])
	console.log('===props.store.isLogin', token)

	const _useRef = useRef()
	const classes = useStyles()
	const [open] = useState(false)
	const [openSideBar, setOpenSideBar] = useState(false)
	const [isLogin, setIsLogin] = useState(true)

	const doLogout = () => {
		props.loginHandler(false)
		window.location.href = '/login'
		localStorage.clear()
	}

	const doLogin = () => {
		props.loginHandler(true)
	}

	const goBackViewAllUser = () => {
		if (_useRef.current) {
			_useRef.current.openViewAllUserPage()
		}
	}

	console.log('======_history', _history.pathname, window.location.pathname)
	return (
		// <Router>

		<div className={classes.root}>
			{isLogin && (
				<Toolbar className={`${classes.appBar} topNavBar`} style={{ position: 'fixed', background: color.white, zIndex: 1, width: '100%', color: '#252f4a' }}>
					<Typography variant="h6" noWrap className={classes.title}>
						{/* Gamba admin panel */}
					</Typography>
					<UserProfileMenu
						doLogout={() => {
							doLogout()
							setOpenSideBar(false)
						}}
					/>
				</Toolbar>
			)}
			{isLogin && (
				<Drawer
					variant="permanent"
					className={clsx(openSideBar ? classes.drawerMobile : classes.drawer, { [classes.drawerClose]: !open })}
					classes={{
						paper: clsx({
							[classes.drawerClose]: !open
						})
					}}>
					<div className='sidebar-logo'>
						<img src='/gambaLogo.png'></img>
					</div>
					<List className={`${classes.list} list`}>
						<div className={classes.closeAlign}>
							<div className={classes.navBarClose}>
								<Close
									className={classes.menu}
									onClick={() => {
										setOpenSideBar(false)
									}}
								/>
							</div>
						</div>
						<NavLink
							exact
							activeClassName="active_class"
							className={`${classes.link} navlink`}
							to="/"
							onClick={() => {
								setOpenSideBar(false)
							}}>
							<div className={`${classes.listItem} list-item`}>
								<ListItem className={classes.inner_list}>
									<ListItemIcon className={classes.flexed}>
										{/* <img
											src="/icons/home.png"
											alt="calender"
											style={{
												width: '30px',
												height: '30px',
												objectFit: 'contain',
												filter: 'invert(100%) sepia(0%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
											}}
										className='img_test'
										/> */}
										<svg width="24" height="24" viewBox="0 0 576 512"><path d="M272.5 5.7c9-7.6 22.1-7.6 31.1 0l264 224c10.1 8.6 11.4 23.7 2.8 33.8s-23.7 11.3-33.8 2.8L512 245.5V432c0 44.2-35.8 80-80 80H144c-44.2 0-80-35.8-80-80V245.5L39.5 266.3c-10.1 8.6-25.3 7.3-33.8-2.8s-7.3-25.3 2.8-33.8l264-224zM288 55.5L112 204.8V432c0 17.7 14.3 32 32 32h48V312c0-22.1 17.9-40 40-40H344c22.1 0 40 17.9 40 40V464h48c17.7 0 32-14.3 32-32V204.8L288 55.5zM240 464h96V320H240V464z" fill='#4B5675' /></svg>
										<ListItemText>
											<Box className={classes.navItem}>Dashboard</Box>
										</ListItemText>
									</ListItemIcon>
								</ListItem>
							</div>
						</NavLink>
						<NavLink
							exact
							to="/viewAllUsers"
							activeClassName="active_class"
							className={`${classes.link} navlink`}
							onClick={() => {
								goBackViewAllUser()
								setOpenSideBar(false)
							}}>
							<div className={`${classes.listItem} list-item`}>
								<ListItem className={classes.inner_list}>
									<ListItemIcon className={classes.flexed}>
										{/* <img
											src="/images/group_user.png"
											alt="calender"
											style={{
												width: '30px',
												height: '30px',
												objectFit: 'contain',
												filter: 'invert(0) sepia(0%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
											}}
										/> */}
										<svg width="28" height="24" viewBox="0 0 640 512"><path d="M144 160A80 80 0 1 0 144 0a80 80 0 1 0 0 160zm368 0A80 80 0 1 0 512 0a80 80 0 1 0 0 160zM0 298.7C0 310.4 9.6 320 21.3 320H234.7c.2 0 .4 0 .7 0c-26.6-23.5-43.3-57.8-43.3-96c0-7.6 .7-15 1.9-22.3c-13.6-6.3-28.7-9.7-44.6-9.7H106.7C47.8 192 0 239.8 0 298.7zM405.3 320H618.7c11.8 0 21.3-9.6 21.3-21.3C640 239.8 592.2 192 533.3 192H490.7c-15.9 0-31 3.5-44.6 9.7c1.3 7.2 1.9 14.7 1.9 22.3c0 38.2-16.8 72.5-43.3 96c.2 0 .4 0 .7 0zM320 176a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm0 144a96 96 0 1 0 0-192 96 96 0 1 0 0 192zm-58.7 80H378.7c39.8 0 73.2 27.2 82.6 64H178.7c9.5-36.8 42.9-64 82.6-64zm0-48C187.7 352 128 411.7 128 485.3c0 14.7 11.9 26.7 26.7 26.7H485.3c14.7 0 26.7-11.9 26.7-26.7C512 411.7 452.3 352 378.7 352H261.3z" fill='#4B5675' /></svg>
										<ListItemText>
											<Box className={classes.navItem}>Users</Box>
										</ListItemText>
									</ListItemIcon>
								</ListItem>
							</div>
						</NavLink>
						<NavLink
							exact
							to="/viewAllEvents"
							activeClassName="active_class"
							className={`${classes.link} navlink`}
							onClick={() => {
								goBackViewAllUser()
								setOpenSideBar(false)
							}}>
							<div className={`${classes.listItem} list-item`}>
								<ListItem className={classes.inner_list}>
									<ListItemIcon className={classes.flexed}>
										{/* <img
											src="/images/calender.png"
											alt="calender"
											style={{
												width: '30px',
												height: '30px',
												objectFit: 'contain',
												filter: 'invert(0) sepia(0%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
											}}
										/> */}
										<svg width="24" height="24" viewBox="0 0 448 512"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" fill='#4B5675' /></svg>
										<ListItemText>
											<Box className={classes.navItem}>Events</Box>
										</ListItemText>
									</ListItemIcon>
								</ListItem>
							</div>
						</NavLink>

						<NavLink
							exact
							to="/viewAllProduct"
							activeClassName="active_class"
							className={`${classes.link} navlink`}
							onClick={() => {
								goBackViewAllUser()
								setOpenSideBar(false)
							}}>
							<div className={`${classes.listItem} list-item`}>
								<ListItem className={classes.inner_list}>
									<ListItemIcon className={classes.flexed}>
										{/* <img
											src="/images/veg.png"
											alt="calender"
											style={{
												width: '30px',
												height: '30px',
												objectFit: 'contain',
												filter: 'invert(0) sepia(0%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
											}}
										/> */}
										<svg width="24" height="24" viewBox="0 0 512 512"><path d="M252.6 11.7C245.8 .3 231-3.4 219.7 3.4s-15.1 21.6-8.2 32.9l10.3 17.2c6.7 11.2 10.3 24 10.3 37v10.9c-17.1-6.1-36.2-7.4-55.1-2.7l-.2 0c-10.5 2.6-20.1 6.9-28.7 12.4C126.5 97.5 99.5 92.2 72.7 98.9C21.3 111.7-10 163.8 2.9 215.3l56 224c12.9 51.4 65 82.7 116.4 69.8c10.5-2.6 20.1-6.9 28.7-12.4c5.7 3.6 11.8 6.7 18.3 9.2c10.6 4 22 6.1 33.7 6.1h0l0-24 0 24h0c11.7 0 23.1-2.1 33.7-6.1c6.5-2.4 12.6-5.5 18.3-9.2c8.6 5.5 18.3 9.8 28.7 12.4c51.4 12.9 103.6-18.4 116.4-69.8l56-224c12.9-51.4-18.4-103.6-69.9-116.4c-26.8-6.7-53.8-1.4-75.3 12.4c-8.6-5.6-18.3-9.8-28.7-12.4c-19-4.8-38.1-3.5-55.3 2.6V90.6c0-21.7-5.9-43.1-17.1-61.7L252.6 11.7zM84.4 145.4c10.5-2.6 21.1-1.6 30.4 2.4c-10.4 20-13.8 43.8-7.9 67.5l33.6 134.4c3.2 12.9 16.2 20.7 29.1 17.5s20.7-16.2 17.5-29.1L153.4 203.6c-6.2-25 8.3-50.3 32.7-57.6c.7-.2 1.5-.4 2.2-.6c18.7-4.7 37.6 2.3 49 16.4c4.6 5.6 11.4 8.9 18.7 8.9s14.1-3.3 18.7-8.9c11.4-14.1 30.3-21.1 49-16.4c9.2 2.3 17 7 23 13.3c4.5 4.7 10.8 7.4 17.3 7.4s12.8-2.7 17.3-7.4c11.6-12.1 29-17.7 46.3-13.4c25.7 6.4 41.4 32.5 34.9 58.2l-56 224c-6.4 25.7-32.5 41.4-58.2 34.9c-9.2-2.3-17-7-23-13.3c-4.5-4.7-10.8-7.4-17.3-7.4s-12.8 2.7-17.3 7.4c-.2 .2-.5 .5-.7 .7l0 0c-4.7 4.7-10.5 8.5-17.1 11l0 0c-5.3 2-11 3.1-16.8 3.1h0c-5.8 0-11.5-1.1-16.8-3.1l0 0c-6.6-2.5-12.3-6.2-17-10.9l0 0c-.2-.2-.5-.5-.7-.8c-4.5-4.7-10.8-7.4-17.3-7.4s-12.8 2.7-17.3 7.4c-6 6.3-13.9 11-23 13.3c-25.7 6.4-51.8-9.2-58.2-34.9l-56-224c-6.4-25.7 9.2-51.8 34.9-58.2z" fill='#4B5675' /></svg>
										<ListItemText>
											<Box className={classes.navItem}>Products</Box>
										</ListItemText>
									</ListItemIcon>
								</ListItem>
							</div>
						</NavLink>

						<NavLink
							exact
							to="/viewAllPost"
							activeClassName="active_class"
							className={`${classes.link} navlink`}
							onClick={() => {
								goBackViewAllUser()
								setOpenSideBar(false)
							}}>
							<div className={`${classes.listItem} list-item`}>
								<ListItem className={classes.inner_list}>
									<ListItemIcon className={classes.flexed}>
										{/* <img
											src="/images/record.png"
											alt="calender"
											style={{
												width: '30px',
												height: '30px',
												objectFit: 'contain',
												filter: 'invert(0) sepia(0%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
											}}
										/> */}
										<svg width="24" height="24" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" fill='#4B5675' /></svg>
										<ListItemText>
											<Box className={classes.navItem}>Posts</Box>
										</ListItemText>
									</ListItemIcon>
								</ListItem>
							</div>
						</NavLink>

						<NavLink
							exact
							to="/viewPaidOrder"
							activeClassName="active_class"
							className={`${classes.link} navlink`}
							onClick={() => {
								goBackViewAllUser()
								setOpenSideBar(false)
							}}>
							<div className={`${classes.listItem} list-item`}>
								<ListItem className={classes.inner_list}>
									<ListItemIcon className={classes.flexed}>
										<svg width="24" height="24" viewBox="0 0 576 512"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c26.9 0 50 19.1 55 45.5l37 194.5H459.2c10.9 0 20.4-7.3 23.2-17.8L528.8 49.8c3.4-12.8 16.6-20.4 29.4-16.9s20.4 16.6 16.9 29.4L528.7 234.7c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM344 48V88h40c13.3 0 24 10.7 24 24s-10.7 24-24 24H344v40c0 13.3-10.7 24-24 24s-24-10.7-24-24V136H256c-13.3 0-24-10.7-24-24s10.7-24 24-24h40V48c0-13.3 10.7-24 24-24s24 10.7 24 24z" fill='#4B5675' /></svg>
										<ListItemText>
											<Box className={classes.navItem}> Orders</Box>
										</ListItemText>
									</ListItemIcon>
								</ListItem>
							</div>
						</NavLink>

						<NavLink
							exact
							to="/gambaPamentHistory"
							activeClassName="active_class"
							className={`${classes.link} navlink`}
							onClick={() => {
								goBackViewAllUser()
								setOpenSideBar(false)
							}}>
							<div className={`${classes.listItem} list-item`}>
								<ListItem className={classes.inner_list}>
									<ListItemIcon className={classes.flexed}>
										{/* <img
											src="/images/cart.png"
											alt="calender"
											style={{
												width: '30px',
												height: '30px',
												objectFit: 'contain',
												filter: 'invert(0) sepia(0%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
											}}
										/> */}
										<svg width="24" height="24" viewBox="0 0 384 512"><path d="M336 448V160H256c-17.7 0-32-14.3-32-32V48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16zM0 64C0 28.7 28.7 0 64 0H229.5c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zM192 215.6c11 0 20 9 20 20v10.1c7.2 1.1 14.2 2.5 20.6 4.1c10.7 2.5 17.4 13.3 14.9 24.1s-13.3 17.4-24.1 14.9c-11-2.6-21.8-4.5-31.7-4.7c-8.2-.1-16.7 1.6-22.4 4.6c-5.2 2.8-5.3 4.7-5.3 5.9c0 .4 0 .4 0 .4c0 0 0 0 0 0c.3 .4 1.4 1.6 4.4 3.2c6.5 3.5 15.8 6 28.6 9.5l.7 .2c11.2 3 25.4 6.8 36.8 13.2c12.4 7 25.2 19.2 25.4 39.3c.3 20.7-11.7 34.8-25.7 42.5c-6.9 3.8-14.6 6.3-22.3 7.8v10.1c0 11-9 20-20 20s-20-9-20-20V409.7c-10-1.9-19.3-4.8-27.5-7.3l0 0c-2.1-.7-4.2-1.3-6.1-1.9c-10.6-3.1-16.6-14.3-13.5-24.9s14.3-16.6 24.9-13.5c2.5 .7 4.9 1.5 7.2 2.2l0 0 0 0c13.6 4.1 24.2 7.3 35.7 7.7c8.9 .3 17.2-1.5 22.4-4.4c4.4-2.5 5.1-4.5 5-6.9l0-.1c0-.5 .2-2-5-4.8c-6.4-3.6-15.7-6.3-28.3-9.7l-1.7-.5c-10.9-2.9-24.5-6.6-35.4-12.4c-12.2-6.5-25.4-18.4-25.6-38.6c-.1-21 13.2-34.4 26.7-41.5c6.7-3.5 14-5.9 21.3-7.3V235.6c0-11 9-20 20-20zM96 96h80c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h80c8.8 0 16 7.2 16 16s-7.2 16-16 16H96c-8.8 0-16-7.2-16-16s7.2-16 16-16z" fill='#4B5675' /></svg>
										<ListItemText>
											<Box className={classes.navItem}>Payment</Box>
										</ListItemText>
									</ListItemIcon>
								</ListItem>
							</div>
						</NavLink>
						<NavLink
							exact
							to="/viewCategories"
							activeClassName="active_class"
							className={`${classes.link} navlink`}
							onClick={() => {
								goBackViewAllUser()
								setOpenSideBar(false)
							}}>
							<div className={`${classes.listItem} list-item`}>
								<ListItem className={classes.inner_list}>
									<ListItemIcon className={classes.flexed}>
										{/* <img
											src="/images/checkout.png"
											alt="calender"
											style={{
												width: '30px',
												height: '30px',
												objectFit: 'contain',
												filter: 'invert(0) sepia(0%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
											}}
										/> */}
										<svg width="24" height="24" viewBox="0 0 512 512"><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM184 72c-13.3 0-24 10.7-24 24s10.7 24 24 24H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H184zm0 160c-13.3 0-24 10.7-24 24s10.7 24 24 24H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H184zm0 160c-13.3 0-24 10.7-24 24s10.7 24 24 24H488c13.3 0 24-10.7 24-24s-10.7-24-24-24H184zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" fill='#4B5675' /></svg>
										<ListItemText>
											<Box className={classes.navItem}>Categories</Box>
										</ListItemText>
									</ListItemIcon>
								</ListItem>
							</div>
						</NavLink>

						<NavLink
							exact
							to="/viewChemical"
							activeClassName="active_class"
							className={`${classes.link} navlink`}
							onClick={() => {
								goBackViewAllUser()
								setOpenSideBar(false)
							}}>
							<div className={`${classes.listItem} list-item`}>
								<ListItem className={classes.inner_list}>
									<ListItemIcon className={classes.flexed}>
										{/* <img
											src="/images/chemical.png"
											alt="calender"
											style={{
												width: '30px',
												height: '30px',
												objectFit: 'contain',
												filter: 'invert(0) sepia(0%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
											}}
										/> */}
										<svg width="24" height="24" viewBox="0 0 448 512"><path d="M176 196.8c0 20.7-5.8 41-16.6 58.7L119.7 320H328.3l-39.7-64.5c-10.9-17.7-16.6-38-16.6-58.7V48H176V196.8zM320 48V196.8c0 11.8 3.3 23.5 9.5 33.5L437.7 406.2c6.7 10.9 10.3 23.5 10.3 36.4c0 38.3-31.1 69.4-69.4 69.4H69.4C31.1 512 0 480.9 0 442.6c0-12.8 3.6-25.4 10.3-36.4L118.5 230.4c6.2-10.1 9.5-21.7 9.5-33.5V48h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h40H288h40c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8z" fill='#4B5675' /></svg>
										<ListItemText>
											<Box className={classes.navItem}>Chemicals</Box>
										</ListItemText>
									</ListItemIcon>
								</ListItem>
							</div>
						</NavLink>
						{/* <NavLink
								exact
								to="/contect_us"
								activeClassName="active_class"
								className={classes.link}
								onClick={() => {
									goBackViewAllUser()
									setOpenSideBar(false)
								}}>
								<div className={classes.listItem}>
									<ListItem className={classes.inner_list}>
										<ListItemIcon className={classes.flexed}>

											<img
												src="/images/chemical.png"
												alt="calender"
												style={{
													width: '30px',
													height: '30px',
													objectFit: 'contain',
													filter: 'invert(0) sepia(0%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
												}}
											/>
											<ListItemText>
												<Box className={classes.navItem}>Contact Us</Box>
											</ListItemText>
										</ListItemIcon>
									</ListItem>
								</div>
							</NavLink> */}
						{/* <NavLink
								exact
								activeClassName="active_class"
								className={classes.link}
								to="/login"
								onClick={() => {
									doLogout()
									setOpenSideBar(false)
								}}>
								<div className={classes.listItem}>
									<ListItem className={classes.inner_list}>
										<ListItemIcon className={classes.flexed}>
											<div style={{width: '30px', height: '30px'}}>
												<img
													src="/images/logout.png"
													alt="calender"
													style={{
														width: '25px',
														height: '30px',
														objectFit: 'contain',
														filter: 'invert(0) sepia(100%) saturate(2%) hue-rotate(191deg) brightness(103%) contrast(101%)'
													}}
												/>
											</div>
											<ListItemText>
												<Box className={classes.navItem}>Logout</Box>
											</ListItemText>
										</ListItemIcon>
									</ListItem>
								</div>
							</NavLink> */}
					</List>
				</Drawer>
			)}

			<main className={classes.content}>

				<div className={classes.mainContent}>
					{isLogin == true ? (
						<>
							<div className={classes.navBar}>
								<Menu
									className={classes.menu}
									onClick={() => {
										setOpenSideBar(true)
									}}
								/>
							</div>
							<Route exact path="/" component={Home}></Route>
							<Route exact path="/viewAllUsers" component={() => <ViewAllUsers ref={_useRef} />}></Route>
							<Route exact path="/viewAllProduct" component={() => <ViewAllProduct ref={_useRef} />}></Route>
							<Route exact path="/viewAllProductSold" component={() => <ViewAllProductSold ref={_useRef} />}></Route>
							<Route exact path="/viewManageOrders" component={() => <ViewAllManageOrder ref={_useRef} />}></Route>
							<Route exact path="/viewPaidOrder" component={() => <ViewAllPaidOrder ref={_useRef} />}></Route>
							<Route exact path="/viewUnpiadOrder" component={() => <ViewUnPaidOrder ref={_useRef} />}></Route>
							<Route exact path="/paygamba" component={() => <PayGamba ref={_useRef} />}></Route>
							<Route exact path="/gambaPamentHistory" component={() => <GambaPaymentHistory ref={_useRef} />}></Route>
							<Route exact path="/viewAllEvents" component={() => <ViewAllEvents ref={_useRef} />}></Route>
							<Route exact path="/viewAllPost" component={() => <ViewAllPost ref={_useRef} />}></Route>
							<Route exact path="/contect_us" component={() => <Contect ref={_useRef} />}></Route>
							<Route exact path="/login" component={() => <Login loginFun={doLogin} />}></Route>
							<Route exact path="/viewCategories" component={() => <ViewAllCategories ref={_useRef} />}></Route>
							<Route exact path="/viewChemical" component={() => <ViewAllChemical ref={_useRef} />}></Route>
						</>
					) : (
						<>
							<Route exact path="/forgot-password" component={() => <ForgotPassword />}></Route>
							<Route exact path="/reset-password/*" component={() => <UpdatePassword />}></Route>

							<Route path="/login" component={() => <Login loginFun={doLogin} />}></Route>
						</>
					)}
				</div>
			</main>
		</div>
		// </Router>
	)
}

const mapStateToProps = (state) => ({
	store: state.GameStore
})

const mapDispatchToProps = (dispatch) => ({
	loginHandler: (data) => dispatch(LoginController(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(LeftNavBar)

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		[theme.breakpoints.down('sm')]: {
			position: 'absolute',
			display: 'none'
		}
	},
	drawerMobile: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
		[theme.breakpoints.down('sm')]: {
			position: 'absolute'
		}
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: 'hidden',
		width: '250px',
		[theme.breakpoints.up('sm')]: {
			width: '250px'
		},
		// backgroundColor: '#003060'
	},
	navBar: {
		display: 'none',
		width: '2rem',
		height: '2rem',
		position: 'relative',
		marginBottom: '1rem',
		borderRadius: '0.3rem',
		justifyContent: 'center',
		alignItems: 'center',
		background: '#003060',
		cursor: 'pointer',
		[theme.breakpoints.down('sm')]: {
			display: 'flex'
		}
	},
	closeAlign: {
		display: 'flex',
		justifyContent: 'flex-end',
		position: 'relative',
		top: '-1rem',
		right: '1rem'
	},
	navBarClose: {
		display: 'none',
		width: '2rem',
		height: '2rem',
		position: 'relative',
		borderRadius: '0.3rem',
		justifyContent: 'center',
		alignItems: 'center',
		cursor: 'pointer',
		background: '#003060',
		[theme.breakpoints.down('sm')]: {
			display: 'flex'
		}
	},
	menu: {
		color: 'white',
		fontSize: '1.4rem !important'
	},
	content: {
		flexGrow: 1,
		width: '100% !important'
	},
	mainContent: {
		flexGrow: 1,
		width: '100% !important',
		padding: '4rem 2rem 5px 2rem',
		[theme.breakpoints.down('sm')]: {
			padding: theme.spacing(1.5)
		}
	},
	listItem: {
		padding: '8px 2rem 8px 1.25rem',
		'&:hover': {
			backgroundColor: '#f0f2f5',

		}
	},
	navItem: {
		fontSize: '16px',
		color: color.white,
		textAlign: 'center'
	},
	white: {
		color: color.white,
		fontSize: '30px'
	},
	inner_list: {
		paddingBottom: '0px',
		paddingTop: '0px',
		justifyContent: 'flex-start !important'
	},
	link: {
		textDecoration: 'none !important',
		marginBottom: '1rem',
		display: 'Block'
	},
	list: {
		paddingTop: '0px'
	},
	flexed: {
		display: 'flex',
		gap: '1rem'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,

		[theme.breakpoints.down('sm')]: {
			width: '100% !important'
		},

	},
	menuButton: {
		marginRight: theme.spacing(2)
	},
	hide: {
		display: 'none'
	},
	title: {
		flexGrow: 1
	},
	profile: {
		display: 'flex',
		alignItems: 'center'
	},
}))
