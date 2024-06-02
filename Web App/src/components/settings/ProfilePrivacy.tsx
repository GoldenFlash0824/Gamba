import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { media } from 'styled-bootstrap-grid'
import { Flexed, Spacer, Text } from '../../styled/shared'
import { palette } from '../../styled/colors'
import Toggle from '../common/Toggle'
import { getUserPrivacySetting, updateUserPrivacySetting } from '../../apis/apis'
import Loader from '../common/Loader'
import { Button } from './ProfileUpdate'
import { toastSuccess } from '../../styled/toastStyle'

const ProfilePrivacy = ({ setSelectProfileSettingsCategory, setSelectCategory }) => {
	const [isProfileHide, setIsProfileHide] = useState(true)
	const [isEmailHide, setIsEmailHide] = useState(false)
	const [isPhoneNumberHide, setIsPhoneNumberHide] = useState(false)
	const [isBirthDayHide, setIsBirthDayHideHide] = useState(false)
	const [isDOBDateMonthHide, setIsDOBDateMonthHide] = useState(true)
	const [isDOBDateMonthYearHide, setIsDOBDateMonthYearHide] = useState(false)
	const [isPostHide, setIsPostHide] = useState(false)
	const [isProductHide, setIsProductHide] = useState(false)
	const [isEventHide, setIsEventHide] = useState(false)
	const [loading, setLoading] = useState(false)
	useEffect(() => {
		getUserPrivacy()
	}, [])

	useEffect(() => {
		if (isProfileHide === false) {
			setIsEmailHide(false)
			setIsPhoneNumberHide(false)
			setIsBirthDayHideHide(false)
			setIsDOBDateMonthHide(true)
			setIsDOBDateMonthYearHide(false)
			setIsPostHide(false)
			setIsProductHide(false)
			setIsEventHide(false)
		}
	}, [isProfileHide])

	const getUserPrivacy = async () => {
		setLoading(true)
		let response = await getUserPrivacySetting()
		if (response?.data) {
			setIsProfileHide(response?.data?.display_profile)
			setIsEmailHide(response?.data?.display_email)
			setIsBirthDayHideHide(response?.data?.display_dob)
			setIsPhoneNumberHide(response?.data?.display_phone)
			setIsDOBDateMonthHide(response?.data?.display_dob_full_format == false)
			setIsDOBDateMonthYearHide(response?.data?.display_dob_full_format)
		}
		setLoading(false)
	}

	const onUpdatePrivacyClick = async () => {
		let res = await updateUserPrivacySetting(isPhoneNumberHide, isEmailHide, isBirthDayHide, false, isProfileHide, isDOBDateMonthYearHide)
		if (res?.success) {
			toastSuccess('Privacy updated')
			getUserPrivacy()
		}
	}

	return (
		<>
			<Wrapper>
				{loading && <Loader visible={loading} />}
				<Text type="normal" margin="0.5rem 0rem" fontWeight={700} color="black_100">
					Display my information :
				</Text>
				<Spacer height={0.5} />
				<Flex direction="row" align="center" justify="space-between" gap="1">
					<Text type="normal" fontWeight={700} color="black_100">
						Profile
					</Text>
					<Switch
						onClick={() => {
							setIsProfileHide(!isProfileHide)
						}}
						toggle={isProfileHide}>
						<Dot toggle={isProfileHide} />
					</Switch>
				</Flex>
				<Spacer height={1.25} />
				<Flex direction="row" align="center" justify="space-between" gap="1">
					<Text type="normal" fontWeight={700} color="black_100">
						Email address
					</Text>
					<Switch
						onClick={() => {
							isProfileHide && setIsEmailHide(!isEmailHide)
						}}
						toggle={isEmailHide}
						disabled={!isProfileHide}>
						<Dot toggle={isEmailHide} />
					</Switch>
				</Flex>
				<Spacer height={1.25} />
				<Flex direction="row" align="center" justify="space-between" gap="1">
					<Text type="normal" fontWeight={700} color="black_100">
						Phone no.
					</Text>
					<Switch
						onClick={() => {
							isProfileHide && setIsPhoneNumberHide(!isPhoneNumberHide)
						}}
						toggle={isPhoneNumberHide}
						disabled={!isProfileHide}>
						<Dot toggle={isPhoneNumberHide} />
					</Switch>
				</Flex>
				<Spacer height={1.25} />
				<Flex direction="row" align="center" justify="space-between" gap="1">
					<Text type="normal" fontWeight={700} color="black_100">
						Birthday
					</Text>
					<Switch
						onClick={() => {
							isProfileHide && setIsBirthDayHideHide(!isBirthDayHide)
						}}
						toggle={isBirthDayHide}
						disabled={!isProfileHide}>
						<Dot toggle={isBirthDayHide} />
					</Switch>
				</Flex>
				<Spacer height={1.25} />
				{isBirthDayHide && (
					<>
						<Flex direction="row" align="center" justify="space-between" gap="1">
							<Text type="normal" fontWeight={700} color="black_100">
								DOB, Only day & month
							</Text>
							<Switch
								onClick={() => {
									setIsDOBDateMonthHide(!isDOBDateMonthHide)
									setIsDOBDateMonthYearHide(!isDOBDateMonthYearHide)
								}}
								toggle={isDOBDateMonthHide}
								disabled={!isProfileHide}>
								<Dot toggle={isDOBDateMonthHide} />
							</Switch>
						</Flex>
						<Spacer height={1.25} />
						<Flex direction="row" align="center" justify="space-between" gap="1">
							<Text type="normal" fontWeight={700} color="black_100">
								DOB, day, month & year
							</Text>
							<Switch
								onClick={() => {
									setIsDOBDateMonthYearHide(!isDOBDateMonthYearHide)
									setIsDOBDateMonthHide(!isDOBDateMonthHide)
								}}
								toggle={isDOBDateMonthYearHide}
								disabled={!isProfileHide}>
								<Dot toggle={isDOBDateMonthYearHide} />
							</Switch>
						</Flex>
						<Spacer height={1.25} />
					</>
				)}
				{/* <Flex direction="row" align="center" justify='space-between' gap="1">
					<Text type="normal" fontWeight={700} color='black_100'>
						Posts
					</Text>
					<Switch onClick={() => { isProfileHide && setIsPostHide(!isPostHide) }} toggle={isPostHide} disabled={!isProfileHide}>
						<Dot toggle={isPostHide} />
					</Switch>
				</Flex>
				<Spacer height={1.25} />
				<Flex direction="row" align="center" justify='space-between' gap="1">
					<Text type="normal" fontWeight={700} color='black_100'>
						Products
					</Text>
					<Switch onClick={() => { isProfileHide && setIsProductHide(!isProductHide) }} toggle={isProductHide} disabled={!isProfileHide}>
						<Dot toggle={isProductHide} />
					</Switch>
				</Flex>
				<Spacer height={1.25} />
				<Flex direction="row" align="center" justify='space-between' gap="1">
					<Text type="normal" fontWeight={700} color='black_100'>
						Events
					</Text>
					<Switch onClick={() => { isProfileHide && setIsEventHide(!isEventHide) }} toggle={isEventHide} disabled={!isProfileHide}>
						<Dot toggle={isEventHide} />
					</Switch>
				</Flex> */}

				<Spacer height={0.25} />
				<Flexed direction="row" align="center" margin="0rem 0rem 1.25rem 0rem">
					<Button onClick={() => onUpdatePrivacyClick()}>Save Changes</Button>
				</Flexed>
			</Wrapper>
		</>
	)
}

const Wrapper = styled.div`
	background-color: ${palette.white};
	padding: 0rem 0.6rem;
	width: 100%;
	padding: 24px !important;
	border-radius : 1rem !important;
`

const Flex = styled(Flexed) <any>`
	border: 1px solid ${palette.stroke};
	border-radius: 0.875rem;
	background: ${palette.white};
	padding: 1.25rem;
	
`

const Switch = styled.div<any>`
	display: flex;
	align-items: center;
	justify-content: ${({ toggle }) => (toggle ? 'flex-end' : 'flex-start')};
	background-color: ${({ toggle }) => (toggle ? palette.Btn_dark_green : palette.gray_100)};
	width: 40px;
	height: 26px;
	border-radius: 1rem;
	padding: 0.5rem 0.1rem;
	transition: justify-content 2s, transform 2s;
	border: 0.063rem solid ${({ toggle }) => (toggle ? palette.fbBg : palette.fbBg)};
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
	opacity: ${({ disabled }) => (disabled ? '0.4' : '1')};
`

const Dot = styled.div<any>`
	width: 20px;
	height: 20px;
	border-radius: 100%;
	background-color: ${palette.white};
`

export default ProfilePrivacy
