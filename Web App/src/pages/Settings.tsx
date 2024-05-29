import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Container, Row, Col, media } from 'styled-bootstrap-grid'
import SideMenu from '../components/SideMenu'
import { Text, RsponsiveSpacer } from '../styled/shared'
import ProfileSettings from '../components/settings/ProfileSettings'
import ProfilePrivacy from '../components/settings/ProfilePrivacy'
import ProfileUpdate from '../components/settings/ProfileUpdate'
import ChangePassword from '../components/settings/ChangePassword'
import NotificationSetting from '../components/settings/NotificationSetting'
import PaymentSetting from '../components/settings/PaymentSetting'
import CreditCardPayment from '../components/paymentOptions/CreditCardPayment'
import { palette } from '../styled/colors'
import ContactUs from '../components/ContactUs'
import SellerAggrement from './SellerAggrement'

const Settings = ({ addToCart, getUserProfile, setUserId, selectCategory, setSelectCategory, setSelectProfileSettingsCategory, selectProfileSettingsCategory }) => {
	const [selectedPaymentOption, setSelectedPaymentOption] = useState('')
	const [profileInfoMenu, setProfileInfoMenu] = useState(false)

	return (
		<Main fluid className='mt-3'>
			<Row>
				<Col>
					<RsponsiveSpacer height={1.875} />
				</Col>
			</Row>
			<Row>
				<Col xxl={2.5} xl={2.5}>
					<ContentSection>
						<SideMenu setSelectCategory={setSelectCategory} setSelectProfileSettingsCategory={setSelectProfileSettingsCategory} selectCategory={selectCategory} />
					</ContentSection>
				</Col>
				<Col
					xxl={9.5}
					xl={9.5}>
					<Section >
						{selectCategory === 'profile' && (
							<>
								<ProfileSettings setProfileInfoMenu={setProfileInfoMenu} selectProfileSettingsCategory={selectProfileSettingsCategory} setSelectProfileSettingsCategory={setSelectProfileSettingsCategory} />
								{selectProfileSettingsCategory === 'personalInfo' ? (
									<ProfileUpdate profileInfoMenu={profileInfoMenu} getUserProfile={getUserProfile} setSelectCategory={setSelectCategory} setSelectProfileSettingsCategory={setSelectProfileSettingsCategory} />
								) : selectProfileSettingsCategory === 'privacy' ? (
									<ProfilePrivacy setSelectCategory={setSelectCategory} setSelectProfileSettingsCategory={setSelectProfileSettingsCategory} />
								) :
									selectProfileSettingsCategory === 'changePassword' ? (
										<ChangePassword setSelectCategory={setSelectCategory} setSelectProfileSettingsCategory={setSelectProfileSettingsCategory} />
									) : (
										<></>
									)}
							</>
						)}

						{selectCategory === 'notification' && (
							<div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
								<NotificationSetting />
							</div>
						)}

						{selectCategory === 'support' && (
							<>
								<ContactUs />
							</>
						)}
						{selectCategory === 'payment' && (
							<>
								{selectedPaymentOption === 'creditCard' ? (
									<>
										<CreditCardPayment setSelectedPaymentOption={setSelectedPaymentOption} setSelectCategory={setSelectCategory} setSelectProfileSettingsCategory={setSelectProfileSettingsCategory} />
									</>
								) : (
									<>
										<PaymentSetting setSelectedPaymentOption={setSelectedPaymentOption} />
									</>
								)}
							</>
						)}
					</Section>
				</Col>
			</Row>
		</Main>
	)
}

const Main = styled(Container)`
	padding-right: 0;
	padding-left: 0;
	${media.sm`
		padding-right:0.938rem;
		padding-left: 0.938rem;
	`}
`

const Section = styled.div`
	width: 100%;
`

const ContentSection = styled.div<any>`
	position: sticky;
	top: 168.03px;
	overflow-x: auto;
	margin-bottom: 1rem;
	${media.xl`
	// top: 132.03px;
	top: 100px;
	height: calc(100vh - 132.03px);
	 overflow-y: auto; padding-top: 0rem;
	//  padding-right:1.875rem;
	 border-bottom: none;
	 
	margin-bottom: 0rem;
	`}
	display:block;
	::-webkit-scrollbar {
		display: none;
	}
`

const HomeIcon = styled.img`
	height: 1.2rem;
`

const StyledHeading = styled(Text) <any>`
	cursor: pointer;
`

export default Settings
