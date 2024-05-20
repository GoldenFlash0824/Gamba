import React, { useState } from 'react'
import styled from 'styled-components'
import { palette } from '../../styled/colors'
import { Text,Flexed } from '../../styled/shared'
import { media } from 'styled-bootstrap-grid'

const ProfileSettings = ({ setProfileInfoMenu, selectProfileSettingsCategory, setSelectProfileSettingsCategory }) => {
	return (
		<Wrapper>
			{/* <StyledText type="normal" fontWeight={700} color="black_100">
				My Account
			</StyledText> */}
			<SubWrapper>
			<CustomHeading
				type="normal"
				active={selectProfileSettingsCategory === 'personalInfo'}
				onClick={() => {
					setSelectProfileSettingsCategory('personalInfo')
					setProfileInfoMenu(true)
				}}>
				<Icon active={selectProfileSettingsCategory === 'personalInfo'} src="/images/icons/user-edit-profile.svg" alt='user-edit-profile' />
				Personal Info
			</CustomHeading>

			<CustomHeading
				type="normal"
				active={selectProfileSettingsCategory === 'changePassword'}
				onClick={() => {
					setSelectProfileSettingsCategory('changePassword')
				}}>
				<Icon active={selectProfileSettingsCategory === 'changePassword'} src="/images/icons/lock.svg" alt='lock' />
				Change Password
			</CustomHeading>
			<CustomHeading
				type="normal"
				active={selectProfileSettingsCategory === 'privacy'}
				onClick={() => {
					setSelectProfileSettingsCategory('privacy')
				}}>
				<Icon active={selectProfileSettingsCategory === 'privacy'} src="/images/icons/shield.svg" alt='shield' />
				Privacy
			</CustomHeading>

			{/* <CustomHeading
				type="normal"
				onClick={() => {
					setSelectProfileSettingsCategory('favorites')
				}}>
				<Icon src="/icons/favourite.png" />
				Favorites
			</CustomHeading> */}


			</SubWrapper>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	
	
	${media.xl`	border-right: 1px solid ${palette.stroke};`}
`

const CustomHeading = styled(Text) <any>`
	position: relative;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.625rem;
	color: ${({ active }) => (active ? palette.green_200 : palette.gray)};
	font-weight: ${({ active }) => (active ? 700 : 500)};
	padding: 0.625rem;
	border-radius: 8px;
	background: ${({ active }) => (active ? palette.green_300 : palette.white)};
	margin-bottom : 0.5rem
`

const Icon = styled.img<any>`
	filter: ${({ active }) => (active ? 'invert(49%) sepia(36%) saturate(2429%) hue-rotate(66deg) brightness(96%) contrast(101%);' : '')};
`

const StyledText = styled(Text)`
	margin: 0.5rem 0rem;
`

const SubWrapper = styled(Flexed)`
	width: 100%;
	flex-direction: row !important;
	column-gap:1rem;
	flex-wrap: wrap;
	${media.lg`	justify-content: start;`}
	${media.xl`	flex-direction: column; margin-bottom: 0rem;`}
	
	justify-content: center;
`

export default ProfileSettings
