import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {media} from 'styled-bootstrap-grid'
import {palette} from '../../styled/colors'
import {Flexed, Spacer, Text} from '../../styled/shared'
import Toggle from '../common/Toggle'
import {getNotificationSettingApi, notificationSetting} from '../../apis/apis'
import {setIsLoading} from '../../actions/authActions'
import {useDispatch} from 'react-redux'

const NotificationSetting = () => {
	const _dispatch = useDispatch()
	const [allowOffers, setAllowOffers] = useState(false)
	const [emailNotification, setEmailNotification] = useState(false)
	const [smsNotification, setSmsNotification] = useState(false)
	const [recieveMessages, setRecieveMessages] = useState(false)
	const [twoFactorAuthentication, setTwoFactorAuthentication] = useState(false)

	useEffect(() => {
		doGetNotificationSettingApi()
	}, [])

	const doGetNotificationSettingApi = async () => {
		_dispatch(setIsLoading(true))

		const response = await getNotificationSettingApi()
		setAllowOffers(response?.promotional_offers)
		setEmailNotification(response?.email_notification)
		setSmsNotification(response?.sms_notification)
		setRecieveMessages(response?.recieve_msg)
		setTwoFactorAuthentication(response?.two_fector_auth)
		_dispatch(setIsLoading(false))
	}

	const doNotificationSetting = async () => {
		_dispatch(setIsLoading(true))

		await notificationSetting(allowOffers, emailNotification, smsNotification, recieveMessages, twoFactorAuthentication)
		_dispatch(setIsLoading(false))
	}

	return (
		<>
			<Wrapper>
				<Flex  direction="row" align="center" justify="space-between" gap="1">
					<CustomText type="normal" toggle={allowOffers}>
						Allow Promotional offers
					</CustomText>
					<Toggle setToggle={setAllowOffers} toggle={allowOffers} />
				</Flex>
				<Spacer height={1.25} />
				<Flex direction="row" align="center" justify="space-between" gap="1">
					<CustomText type="normal" toggle={emailNotification}>
						Email Notification
					</CustomText>
					<Toggle setToggle={setEmailNotification} toggle={emailNotification} />
				</Flex>
				{/* <Spacer height={1.25} /> */}
				{/* <Flex direction="row" align="center" justify="space-between" gap="1">
					<CustomText type="normal" toggle={smsNotification}>
						Recieve SMS Notification
					</CustomText>
					<Toggle setToggle={setSmsNotification} toggle={smsNotification} />
				</Flex>
				<Spacer height={1.25} />
				<Flex direction="row" align="center" justify="space-between" gap="1">
					<CustomText type="normal" toggle={recieveMessages}>
						Recieve Messages
					</CustomText>
					<Toggle setToggle={setRecieveMessages} toggle={recieveMessages} />
				</Flex> */}
				<Spacer height={1.25} />
				<Flex direction="row" align="center" justify="space-between" gap="1">
					<CustomText type="normal" toggle={twoFactorAuthentication}>
						Two Factor Authentication
					</CustomText>
					<Toggle setToggle={setTwoFactorAuthentication} toggle={twoFactorAuthentication} />
				</Flex>
				<Spacer height={1.875} />
				<ButtonWrapper margin="0rem 0rem 1.25rem 0rem">
					<Button
						onClick={() => {
							doNotificationSetting()
						}}>
						Save Changes
					</Button>
				</ButtonWrapper>
			</Wrapper>
		</>
	)
}

const Wrapper = styled.div`
	background-color: ${palette.white};
	 width: 100%; 
	// display: ;
	padding: 24px !important;
	border-radius : 1rem ;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	${media.lg`align-items: center; padding: 0rem 0.6rem;`}
	${media.xl`align-items: start;`}
`

const Flex = styled(Flexed)<any>`
	border: 1px solid ${palette.stroke};
	border-radius: 0.5rem;
	background: ${palette.white};
	padding: 1.25rem;
	width: 100%;
	${media.lg`width: 100%;`}
`

const CustomText = styled(Text)`
	color: ${palette.text};
`

const ButtonWrapper = styled(Flexed)`
	width: 100%;
	align-items: center;
	${media.lg`justify-content: center;`};
	${media.xl`flex-direction: row; justify-content: flex-start`};
`

const Button = styled.div<any>`
	padding: 1.25rem 1.3rem;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 1.875rem;
	height: 3.125rem;
	color: ${palette.white};
	font-weight: 700;
	font-family: 'Lato-Regular', sans-serif;
	font-size: 1rem;
	text-align: left;
	opacity: 1;
	width: 150px;
	border: 1px solid ${palette.green_200};
	background-color: ${({disabled}) => (disabled ? palette.white : palette.green_200)};
	cursor: ${({disabled}) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		background-color: ${palette.green};
		color: ${palette.white};
		border-color: ${palette.green}
	}
`

export default NotificationSetting
