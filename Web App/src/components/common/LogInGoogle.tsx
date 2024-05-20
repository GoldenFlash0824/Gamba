import React from 'react'
import GoogleLogin from 'react-google-login'
import styled from 'styled-components'
import {Text} from '../../styled/shared'
import {useSelector} from 'react-redux'
import {palette} from '../../styled/colors'

const LogInGoogle = () => {
	const _isDarkTheme: any = useSelector<any>((state: any) => state.auth.isDarkTheme)

	return (
		<>
			<GoogleLogin
				clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
				render={(renderProps) => (
					<Button onClick={renderProps.onClick} disabled={renderProps.disabled} justify="center" isDarkTheme={_isDarkTheme}>
						<Icon src="/images/icons/google.svg" />

						<Text type="normal" color="Btn_dark_green">
							Continue with Google
						</Text>
					</Button>
				)}
				// onSuccess={responseGoogle}
				// onFailure={responseGoogle}
				cookiePolicy={'single_host_origin'}
			/>
		</>
	)
}
const Button = styled.button<any>`
	align-items: center;
	padding: 0.563rem 0rem;
	font-weight: 600;
	width: 100%;
	cursor: pointer;
	white-space: nowrap;
	font-size: 0.875rem;
	position: relative;
	display: flex;
	justify-content: ${({justify}) => justify};
	transition: all ease 0.25s;
	background-color: ${({isDarkTheme}) => (isDarkTheme ? palette.black : palette.white)};
	border: 0.063rem solid ${({isDarkTheme}) => (isDarkTheme ? palette.Btn_dark_green : palette.Btn_dark_green)};
	border-radius: 0.375rem;
`

const Icon = styled.img`
	margin-right: 0.7rem;
	height: 1.563rem;
	width: 1.563rem;
`

export default LogInGoogle
