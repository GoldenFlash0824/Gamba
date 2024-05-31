import React from 'react'
import { Button, makeStyles, Typography, Modal, Card, CardHeader, CardContent, CardActions, IconButton } from '@material-ui/core'
import { Cancel } from '@material-ui/icons'
import { color } from '../../assets/css/commonStyle'

const DeleteModal = (props) => {
	const classes = useStyles()
	return (
		<div className={classes.modal}>
			<Modal open={props.open} onClose={props.close} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
				<div className={classes.paper}>
					<Card>
						<CardHeader
							title={props.title}
							className={classes.cardHead}
							action={
								<IconButton aria-label="settings" style={{ color: 'white' }}>
									<Cancel onClick={props.close} />
								</IconButton>
							}
						/>
						<CardContent className={classes.cardContent}>
							<Typography variant="body1"> {props.message}</Typography>
						</CardContent>
						<CardActions className={classes.cardActions}>
							<Button variant="outlined" className={classes.cancelButton} size="small" onClick={props.close}>
								Cancel
							</Button>
							<Button variant="contained" className={classes.deleteButton} size="small" onClick={props.deleteAction}>
								{props.deleteButtonText}
							</Button>
						</CardActions>
					</Card>
				</div>
			</Modal>
		</div>
	)
}

export default DeleteModal

const useStyles = makeStyles((theme) => ({
	paper: {
		textAlign: 'center',
		color: color.black,
		width: '40%',
		position: 'absolute',
		left: '0',
		right: '0',
		margin: 'auto',
		borderRadius: '5px',
		marginTop: '10px',
		[theme.breakpoints.down('sm')]: {
			width: '95%'
		}
	},
	modal: {},
	cardHead: {
		backgroundColor: color.darkBlue,
		color: color.white
	},
	cardActions: {
		// borderTop: `1px solid ${color.lightGray}`,
		padding: '11px 10px 15px 10px',
		justifyContent: 'flex-end'
	},
	cancelButton: {
		color: color.darkBlue,
		outline: color.darkBlue,
		fontWeight: '300',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: color.darkBlue,
			color: color.white
		}
	},
	deleteButton: {
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
	cardContent: {
		padding: '40px 5px 40px 5px',
		fontSize: '14px'
	}
}))
