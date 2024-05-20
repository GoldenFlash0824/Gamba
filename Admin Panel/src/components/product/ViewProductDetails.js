import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Typography, Box, Divider } from '@material-ui/core'
import { ArrowBack } from '@material-ui/icons'
import { color } from '../../assets/css/commonStyle'
import ProductDetailForm from './ProductDetailForm'

const TabPanel = (props) => {
	const { children, value, index, ...other } = props
	return (
		<div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	)
}

const ViewUserDetails = ({ user, goBackAllProduct, tabActive }) => {
	useEffect(() => {
		if (user !== null) {
			if (tabActive) {
				setUserId(user.id)
				setuserLable(user.name)
			} else {
				setUserId(user.id)
				setuserLable(user.reported_product.name)
			}

		} else {
			_history.push('/viewAllUsers')
		}
	}, [])


	let _history = useHistory()
	const [userLabel, setuserLable] = useState('')
	const classes = useStyles()
	const theme = useTheme()
	const [userId, setUserId] = useState(null)

	return (
		<div className={classes.root}>


			<Typography variant="div" className={classes.backButton} onClick={goBackAllProduct}>
				<ArrowBack /> Back
			</Typography>
			<Typography variant="body1" style={{marginTop: '12px'}}  className={classes.para}>
				Manage {userLabel} {tabActive ? 'Product' : 'Reported Product'}
			</Typography>
			<Typography variant="h4" className={classes.heading}>
				{userLabel}
			</Typography>
			{/* <img className={classes.image} src={`${process.env.REACT_APP_IMAGE_URL}/${tabActive ? user?.images?.length && user?.images[0] : user?.reported_product?.images[0]}`} alt="" /> */}
			<Divider variant="fullWidth" className={classes.divider} />
			<div className={classes.root1}>
				<ProductDetailForm user={user} goBackAllProduct={goBackAllProduct} tabActive={tabActive} />
			</div>
		</div>
	)
}

export default ViewUserDetails

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	heading: {
		fontWeight: '600',
		fontSize: '36px',
		color: color.black
	},
	para: {
		fontSize: '13px',
		color: color.black
	},
	root1: {
		backgroundColor: theme.palette.background.paper,
		marginTop: '30px',
		padding: '1rem'
	},
	divider: {
		margin: '10px 0px 20px 0px'
	},
	tabHeading: {
		display: 'inline-block',
		color: color.seaGreen
	},
	tabIcon: {
		fontSize: '18px'
	},
	backButton: {
		cursor: 'pointer',
		display: 'block',
		marginTop: '10px',
		fontSize: '15px',
		color: color.darkBlue,
		fontWeight: 'bold'
	},
	image: {
		width: '6rem',
		height: '6rem',
		objectFit: 'cover',
		borderRadius: '4px'
	},
}))
