import React from 'react'
import {Button, makeStyles, Modal, Card, CardHeader, CardContent, CardActions, IconButton, TextField} from '@material-ui/core'
import {Cancel} from '@material-ui/icons'
import {color} from '../../assets/css/commonStyle'

const AddModal = ({open, close, title, setName, setIcon, addButtonText, addAction}) => {
	const classes = useStyles()
	return (
		<div className={classes.modal}>
			<Modal open={open} onClose={close} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
				<div className={classes.paper}>
					<Card>
						<CardHeader
							title={title}
							className={classes.cardHead}
							action={
								<IconButton aria-label="settings"  style={{color:'white'}}>
									<Cancel onClick={close} />
								</IconButton>
							}
						/>
						<CardContent>
							{setName !== undefined && <TextField type="text" size="small" className={classes.textField} variant="outlined" placeholder="Name" fullWidth onChange={(e) => setName(e.target.value)} />}
							{setIcon !== undefined && <TextField type="text" size="small" className={classes.textField} variant="outlined" placeholder="Icon" fullWidth onChange={(e) => setIcon(e.target.value)} />}
						</CardContent>
						<CardActions className={classes.cardActions}>
							<Button variant="outlined" className={classes.cancelButton} size="small" onClick={close}>
								Cancel
							</Button>
							<Button variant="contained" className={classes.addButton} size="small" onClick={addAction}>
								{addButtonText}
							</Button>
						</CardActions>
					</Card>
				</div>
			</Modal>
		</div>
	)
}

export default AddModal

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
	textField: {
		marginTop: '15px',
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray
	},
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
	addButton: {
		color: color.white,
		backgroundColor: color.darkBlue,
		fontWeight: '300',
		fontSize: '13px',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: color.darkBlue
		}
	}
}))
