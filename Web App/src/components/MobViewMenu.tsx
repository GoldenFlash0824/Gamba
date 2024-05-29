import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { useNavigate } from 'react-router-dom'
import { FaAngleDown } from 'react-icons/fa'
import { media } from 'styled-bootstrap-grid'
import { useDispatch } from 'react-redux'
import { setUserId } from '../actions/authActions'
import { addItemInCart, clearCart } from '../actions/cartActions'
import { BiUser } from 'react-icons/bi'
import { logoutUser } from '../apis/apis'
// import NotificationsPanel from './NotificationsPanel'

const MobViewMenu = ({ setIsMenuOpen, myRef, allItemsCount, setUserDetails, selectCategory, setSelectCategory, isnotificationOpen, setNavBarListOpen, setSelectProfileSettingsCategory, authToken }) => {
	const [isSubMenuOpen, setIsSubMenuOpen] = useState(authToken === null ? true : false)
	const _navigate = useNavigate()
	const dispatch = useDispatch()

	const handleClickOutside = (e: any) => {
		if (!myRef?.current?.contains(e?.target)) {
			setIsMenuOpen(false)
			setNavBarListOpen(false)
		}
	}
	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	})

	return (
		<CustomDropContent>
			<>
				<DropMenu
					onClick={() => {
						_navigate('/settings')
						setIsMenuOpen(false)
						setNavBarListOpen(false)
						setSelectProfileSettingsCategory('personalInfo')
						setSelectCategory('profile')
					}}>
					My Account <BiUser />
				</DropMenu>
				<DropMenu
					onClick={() => {
						_navigate('/profileposts')
						setIsMenuOpen(false)
						setNavBarListOpen(false)
					}}>
					My Posts ({allItemsCount?.data?.mypost ? allItemsCount?.data?.mypost : 0})
				</DropMenu>

				<DropMenu
					onClick={() => {
						_navigate('/myevents')
						setIsMenuOpen(false)
						setNavBarListOpen(false)
					}}>
					My Events ({allItemsCount?.data?.myevent ? allItemsCount?.data?.myevent : 0})
				</DropMenu>

				<DropMenu
					onClick={() => {
						_navigate('/myproducts')
						setIsMenuOpen(false)
						setNavBarListOpen(false)
					}}>
					My Products ({allItemsCount?.data?.myproduct ? allItemsCount?.data?.myproduct : 0})
				</DropMenu>
				<DropMenu
					onClick={() => {
						_navigate('/history')
						setIsMenuOpen(false)
						setNavBarListOpen(false)
					}}>
					Orders ({allItemsCount?.data?.myorders ? allItemsCount?.data?.myorders : 0})
				</DropMenu>

				<DropMenu
					onClick={() => {
						setIsMenuOpen(false)
						setNavBarListOpen(false)
						_navigate('/my-network')
					}}>
					My Network ({allItemsCount?.data?.myfevSeller ? allItemsCount?.data?.myfevSeller : 0})
				</DropMenu>

			</>

			<Divider className='mt-1' />

			<DropMenu
				className='d-flex align-items-center gap-2 '
				onClick={async () => {
					await logoutUser();
					setIsMenuOpen(false)
					dispatch(setUserId(null))
					setNavBarListOpen(false)
					setUserDetails('')
					dispatch(clearCart('0'))
					localStorage.removeItem('userLocation')
					_navigate('/sign-in')
				}}
				color="red"
				fontWeight={600}>
				<svg width='16' height='16' viewBox="0 0 512 512"><path d="M505 273c9.4-9.4 9.4-24.6 0-33.9L377 111c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l87 87L184 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l246.1 0-87 87c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0L505 273zM168 80c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 32C39.4 32 0 71.4 0 120L0 392c0 48.6 39.4 88 88 88l80 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-80 0c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l80 0z" fill="#ff0000" /></svg>
				Logout
			</DropMenu>
		</CustomDropContent>
	)
}

const MenuList = styled.div<any>`
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	border-radius: ${({ borderRadius }) => (borderRadius ? `${borderRadius}rem` : '1rem')};
	background-color: ${palette.white};
	gap: 0.5rem;

	/* ${media.md`
	padding:${({ padding }: any) => (padding ? padding : '0')};`};
	${media.lg`
	padding:${({ padding }: any) => (padding ? padding : '0.3rem 1rem')};`}; */
`
const CustomDropContent = styled.div<any>`
	position: absolute;
	z-index: 10;
	top: 2.8rem;
	right: 0rem;
	padding: 0.625rem;
	max-height: fit-content;
	overflow-y: scroll;
	background-color: ${({ isDarkTheme }) => (isDarkTheme ? palette.black : palette.white)};
	box-shadow: 0px 8px 18px 0px rgba(0, 0, 0, 0.1);
	border-radius: 0.75rem;
	overflow: hidden ;
`

const SubMenu = styled.div`
	padding: 0 1rem;
`

const CustomArrow = styled(FaAngleDown) <any>`
	transform: rotate(180deg);
`
const DownArrow = styled(FaAngleDown) <any>``

const View = styled.div`
	display: block;
	${media.md`
display:none
`}
`

const DropMenu = styled.span<any>`
	min-width: 10.5rem;
	color: ${({ color }) => (color ? palette[color] : palette.black_100)};
	font-size: 0.875rem;
	font-family: 'Lato-Regular', sans-serif;
	padding:6px 12px;
	border-radius: 8px;
	font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : '500')};
	// &:not(:last-child) {
	// 	margin-bottom: 1.25rem;
	// }
	text-decoration: none;
	display: block;
	background-color: ${palette.white};
	&:hover {
		// color: ${palette.green_200};
	 background: ${palette.fbBg};
	}
`

const Divider = styled.div`
	height: 1px;
	background: ${palette.stroke};
	margin-bottom: 0.25rem;
`

export default MobViewMenu
