import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Button, makeStyles, Typography, Modal, Card, CardHeader, CardContent, CardActions, IconButton } from '@material-ui/core'
import { Cancel } from '@material-ui/icons'
import { color } from '../../assets/css/commonStyle'
import { api } from '../../api/callAxios'


const NoteModal = (props) => {
	
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const mainRef = useRef(null);
	
	useEffect(() => {
		if (mainRef.current)
		{
			mainRef.current.scrollTop = mainRef.current.scrollHeight
		}
	}, [messages]);
	
	useEffect(() => {
		if (props.open)
		{
			const fetchData = async () => {
			  try {
				api.get(`/admin/get_order_notes/${props.orderId}`)
				.then((response) => {
					if (response.data.success == true) {
						const constructedData = response.data.data.orderNotes.map(item => ({
							id: item.id,
							name: item.orderNotes.email || 'Admin User',
							date: item.noteDate,
							text: item.remarks,
						}));
						setMessages(constructedData);
					}
				})
			  } catch (error) {
			  }
			};
		
			fetchData();
		}
	}, [props.open]);

	const handleSubmit = (event) => {
		event.preventDefault();
	
		if (!message) return;

		api.post(`/admin/add_notes`, {
			note_type: props.noteType,
			id: props.orderId,
			remarks: message
		})
		.then((response) => {
			if (response.data.success) {
				const newMessage = {
					id: response.data.data.id,
					name: response.data.data.name || 'Admin User',
					date: response.data.data.noteDate,
					text: response.data.data.remarks,
				  };
				setMessages([...messages, newMessage]);
				setMessage('')
			}
		})		
	};
	
	const handleChange = (event) => {
	  setMessage(event.target.value);
	};	
	  
	const classes = useStyles()
	return (
		<div className={classes.modal}>
			<Modal open={props.open} onClose={props.close} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
				<div className='row d-flex justify-content-center'>
					<div className='col-12 col-md-6 d-flex justify-content-center'>
						<section class="msger">
							<header class="msger-header">
								<span className='text-center d-block w-100 '>Enter Your Note</span>
								<Button variant="outlined" className={classes.cancelButton} size="small" onClick={props.close}>Close</Button>
							</header>
							<main class="msger-chat" ref={mainRef}>
							{messages.map((msg) => (
								<div key={msg.id} class="msg right-msg">
									<div class="msg-img" style={{backgroundImage: `url('https://imagescontent.s3.us-east-1.amazonaws.com/1704270853859.png')`}}></div>
									<div class="msg-bubble">
										<div class="msg-info">
											<div class="msg-info-name">{msg.name}</div>
											<div class="msg-info-time">{new Date(msg.date).toLocaleDateString()}</div>
										</div>
										<div class="msg-text">{msg.text}</div>
									</div>
								</div>
							))}
							</main>
							<form class="msger-inputarea" onSubmit={handleSubmit}>
								<input type="text" class="msger-input" id='messengerInput' placeholder="Enter your message..." value={message} onChange={handleChange}/>
								<button type="submit" class="msger-send-btn">Send</button>
							</form>
						</section>
					</div>	
				</div>
			</Modal>
		</div>
	)
}

export default NoteModal

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
