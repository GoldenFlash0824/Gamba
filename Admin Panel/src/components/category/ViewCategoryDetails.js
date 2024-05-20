import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import PropTypes from 'prop-types'
import {makeStyles, useTheme} from '@material-ui/core/styles'
import {Typography, Box, Divider} from '@material-ui/core'
import {ArrowBack} from '@material-ui/icons'
import {color} from '../../assets/css/commonStyle'
import CategoryDetailForm from './categoryDetailForm'

const TabPanel = (props) => {
	const {children, value, index, ...other} = props
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

const ViewCategoryDetails = ({user, goBackAllCategory}) => {
	useEffect(() => {
		if (user !== null) {
			setUserId(user.id)
			setuserLable(user?.title)
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
			<Typography variant="h4" className={classes.heading}>
				{userLabel}
			</Typography>
			<Typography variant="body1" style={{marginTop: '16px'}} className={classes.para}>
				Manage Category
			</Typography>
			<Typography variant="div" className={classes.backButton} onClick={goBackAllCategory}>
				<ArrowBack /> Back
			</Typography>
			<Divider variant="fullWidth" className={classes.divider} />
			<div className={classes.root1}>
				<CategoryDetailForm user={user} goBackAllCategory={goBackAllCategory} />
			</div>
		</div>
	)
}

export default ViewCategoryDetails

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
	}
}))
