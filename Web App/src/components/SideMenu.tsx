import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {media} from 'styled-bootstrap-grid'
import {Flexed, Text} from '../styled/shared'
import {palette} from '../styled/colors'
import DeleteAccountModal from './modals/DeleteAccountModal'
import {useNavigate} from 'react-router-dom'
import useRouter from './useRouterHook'

const SideMenu = ({setSelectCategory, selectCategory, setSelectProfileSettingsCategory}) => {
	let _navigate = useNavigate()
	const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false)
	const authToken = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const router = useRouter()
	useEffect(() => {
		if (router.query.status === 'stripe_return') {
			setSelectCategory('payment')
		}
	}, [router])

	return (
		<>
			<MainWrapper>
				<Tab
					className="d-flex align-items-center justify-content-center justify-content-md-start "
					direction="row"
					align="center"
					border
					gap={0.625}
					active={selectCategory === 'Home'}
					onClick={() => {
						_navigate('/')
					}}>
					<div>
						<SocialIcon active={selectCategory === 'Home'} src="/images/icons/home.svg" alt="home" />
					</div>
					<StyledText active={selectCategory === 'Home'} type="normal">
						Home
					</StyledText>
				</Tab>
				{authToken && (
					<Tab
					className="d-flex align-items-center justify-content-center justify-content-md-start "
						direction="row"
						align="center"
						border
						gap={0.625}
						active={selectCategory === 'profile'}
						onClick={() => {
							setSelectProfileSettingsCategory('personalInfo')
							setSelectCategory('profile')
						}}>
						<div>
							<SocialIcon active={selectCategory === 'profile'} src="/images/icons/account.svg" alt="account" />
						</div>
						<StyledText active={selectCategory === 'profile'} type="normal">
							Account
						</StyledText>
					</Tab>
				)}
				{/* <Tab
				direction="row"
				align="center"
				border
				gap={0.625}
					active={selectCategory === 'shield'}
					onClick={() => {
						setSelectProfileSettingsCategory('personalInfo')
						setSelectCategory('shield')
					}}>
					<div>
						<SocialIcon active={selectCategory === 'shield'} src="/images/icons/home.svg" alt='home' />
					</div>
					<StyledText active={selectCategory === 'shield'} type='normal'>
							Account Security
					</StyledText>
				</Tab>  */}

				{authToken && (
					<Tab
					className="d-flex align-items-center justify-content-center justify-content-md-start "
						direction="row"
						align="center"
						border
						gap={0.625}
						active={selectCategory === 'payment'}
						onClick={() => {
							setSelectProfileSettingsCategory('personalInfo')
							setSelectCategory('payment')
						}}>
						<div>
							<SocialIcon active={selectCategory === 'payment'} src="/images/icons/payment.svg" alt="payment" />
						</div>
						<StyledText active={selectCategory === 'payment'} type="normal">
							Payment
						</StyledText>
					</Tab>
				)}

				{authToken && (
					<Tab
					className="d-flex align-items-center justify-content-center justify-content-md-start "
						direction="row"
						align="center"
						border
						gap={0.625}
						active={selectCategory === 'notification'}
						onClick={() => {
							setSelectProfileSettingsCategory('personalInfo')
							setSelectCategory('notification')
						}}>
						<div>
							<SocialIcon active={selectCategory === 'notification'} src="/images/icons/notification.svg" alt="home" />
						</div>
						<StyledText active={selectCategory === 'notification'} type="normal">
							Notification
						</StyledText>
					</Tab>
				)}
				<Tab
				className="d-flex align-items-center justify-content-center justify-content-md-start "
					direction="row"
					align="center"
					border
					gap={0.625}
					active={selectCategory === 'support'}
					onClick={() => {
						setSelectProfileSettingsCategory('personalInfo')
						setSelectCategory('support')
					}}>
					<div>
						<SocialIcon active={selectCategory === 'support'} src="/images/icons/support.svg" alt="support" />
					</div>
					<StyledText active={selectCategory === 'support'} type="normal">
						Contact
					</StyledText>
				</Tab>

				{authToken && (
					<Tab
					className="d-flex align-items-center justify-content-center justify-content-md-start "
						direction="row"
						align="center"
						border
						gap={0.625}
						active={selectCategory === 'delete'}
						onClick={() => {
							setSelectProfileSettingsCategory('personalInfo')
							setIsDeleteAccountModalOpen(true)
							// setSelectCategory('delete')
						}}>
						<div>
							<SocialIcon active={selectCategory === 'delete'} src="/images/icons/delete_account.svg" alt="delete_account" />
						</div>
						<StyledText active={selectCategory === 'delete'} type="normal">
							<span className='text-nowrap'>Disable Account</span>
						</StyledText>
					</Tab>
				)}

				{isDeleteAccountModalOpen && (
					<DeleteAccountModal
						deleteAccount={true}
						onClose={() => {
							setIsDeleteAccountModalOpen(false)
						}}
					/>
				)}
			</MainWrapper>
		</>
	)
}

const MainWrapper = styled(Flexed)<any>`
	flex-direction: row;

	${media.xs` padding: 0rem 0.3rem;`};
	${media.sm`gap:0.25rem;`}
	${media.lg` justify-content: center;`};
	${media.xl`
	flex-direction: column;
	justify-content: start;
	`};
`
const SocialIcon = styled.img<any>`
	filter: ${({active}) => (active ? 'invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);' : '')};
`

const MenuText = styled(Text)<any>`
	position: relative;
	color: ${({active}) => (active ? "#0f1419" : palette.gray)};
	cursor: pointer;
	// &:hover {
	// 	color: ${palette.green_200};
	// 	transition: color 0.1s ease 0.1s;
	// }
`

const StyledText = styled(MenuText)`
	display: block;
	font-weight: ${({active}) => (active ? 700 : 500)};
`

const Tab = styled(Flexed)<any>`
	display: flex;
	border-radius: 48px !important;
	padding: 0.5rem 1.25rem;
	@media only screen and (min-width: 1200px) {
		background-color: ${({active}) => (active ? ` ${palette.white}` : `0.25rem solid transparent`)};
		box-shadow: ${({active}) => (active ? '0 .125rem .25rem rgba(0,0,0,.075)!important;' : 'none')};
		// background-color: ${({active}) => (active ? `${palette.green_200}` : `transparent`)};
		border-top-right-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
		&:hover {
			background-color: ${({ active }) => (active ? '#ffffff' : '#E7E7E8')} !important;
		}
	}

	@media screen and (min-width: 0px) and (max-width: 768px) {
		// border-bottom: ${({active}) => (active ? `0.25rem solid ${palette.green_200}` : `0.25rem solid transparent`)};
		// border-bottom-left-radius: 0.25rem;
		// border-bottom-right-radius: 0.25rem;
		// &:hover {
		// 	border-bottom: 0.25rem solid ${palette.green_200};
		// }
		background-color: ${({active}) => (active ? ` ${palette.white}` : `0.25rem solid transparent`)};
		box-shadow: ${({active}) => (active ? '0 .125rem .25rem rgba(0,0,0,.075)!important;' : 'none')};
		height: 36px;
		padding: 0.5rem .75rem;
	}
	cursor: pointer;
	height: 50px;
	&:hover ${SocialIcon} {
		filter: #000000;
	}
	&:hover ${StyledText} {
		// color: ${palette.green_200};
		// font-weight: 700;
	}
`

export default SideMenu
