import React from 'react'
import { makeStyles, Typography, Paper } from '@material-ui/core'
import { color } from '../../assets/css/commonStyle'
import { NavLink } from 'react-router-dom'

//this will be used as universal card
const Card = ({ cardName, cardData, cardColor, reported, reported_name, styledCardData, icon, route }) => {
	const classes = useStyles()
	return (
		<NavLink to={route}>
			<Paper className={classes.card} style={{ backgroundColor: cardColor  }}>
				<div className={classes.flex}>
					
					<div className={classes.cardName}>
						<div className='db-icon'>
						{icon}
						</div>
						 {cardName}</div>
					{cardData}
					
				</div>
				{/* <div className={classes.cardName}>
					{cardName}
				</div> */}
			</Paper>
		</NavLink>
	)
}
export default Card

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	card: {
		backgroundColor: 'red',
		padding: theme.spacing(3),
		color: color.white,
		// minHeight: '178px'
	},
	flex: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: '1rem',
		fontSize: '2.5rem'
	},
	cardData: {
		marginTop: '10px'
	},
	cardName: {
		margin: '0px 0px 0px 0px',
		fontWeight: '600',
		fontSize: '16px',
		gap: '16px',
		display: 'flex',
		alignItems: 'center'
	},
	styledCardData: {
		marginTop: '10px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'end'
	}
}))
