import React, { useState } from 'react'
import { Container, Button, makeStyles, TextField, Typography, InputAdornment, IconButton } from '@material-ui/core'
import Logo from '../assets/images/01. GAMBA Final logo.png'
import { color, toastStyle } from '../assets/css/commonStyle'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router'
import { api } from '../api/callAxios'
import { Visibility, VisibilityOff } from '@material-ui/icons'

const Login = ({ loginFun }) => {
	const classes = useStyles()
	let _history = useHistory()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false);

	const loginUser = () => {
		if (email === '' || password === '') {
			toast.error('Both email and password are required', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
		} else {
			doLogin()
		}
	}

	const doLogin = () => {
		api.post(`/admin/login`, {
			email: email,
			password: password
		})
			.then((response) => {
				if (response.data.success) {
					toast.success('Login successfully!', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
					localStorage.setItem('auth_token', response.data.data.admin_details.token)
					loginFun()
					_history.push('/')
				} else {
					toast.error(response.data.message, { position: toastStyle.position, autoClose: toastStyle.closeDuration })
				}
			})
			.catch(function (error) {
				toast.error('Something went wrong. Please try again later.', { position: toastStyle.position, autoClose: toastStyle.closeDuration })
			})
	}

	return (
		<Container maxWidth="xs" className={classes.container}>
			<div className={classes.center}>
				<img src={Logo} className={classes.logo} alt="" />
				<Typography variant="h4" className={classes.heading}>
					Admin Panel
				</Typography>
				<TextField type="email" size="small" className={classes.textField} variant="outlined" placeholder="User/ Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
				<TextField size="small" type={showPassword ? 'text' : 'password'} className={classes.textField} variant="outlined" placeholder="Password" fullWidth onChange={(e) => setPassword(e.target.value)} InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								edge="end"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					),
				}} />
				<Button fullWidth size="large" className={classes.loginButton} onClick={loginUser}>
					Login
				</Button>
				<div style={{ display: 'flex', justifyContent: 'start' }}>
					<Typography variant="div" className={classes.forgotPassword} onClick={() => _history.push('/forgot-password')}>
						Forgot password ?
					</Typography>
				</div>
			</div>
		</Container>
	)
}

export default Login

const useStyles = makeStyles((theme) => ({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh'
	},
	center: {
		textAlign: 'center',
		marginTop: '-20px'
	},
	logo: {
		width: '100%'
		// backgroundColor: 'white !important'
	},
	heading: {
		fontWeight: '600',
		fontSize: '36px',
		color: color.black,
		padding: '10px 0px 0px 0px',
		textAlign: 'center'
	},
	textField: {
		marginTop: '15px',
		border: `1px solid ${color.lightGray} !important`,
		borderRadius: '5px !important',
		backgroundColor: color.lightGray
	},
	forgotPassword: {
		fontWeight: '400',
		fontSize: '1rem',
		color: color.black,
		padding: '10px 0px 0px 0px',
		textAlign: 'start',
		cursor: 'pointer'
	},
	loginButton: {
		marginTop: '15px',
		backgroundColor: color.success,
		color: color.white,
		'&:hover': {
			backgroundColor: color.success
		}
	}
}))
