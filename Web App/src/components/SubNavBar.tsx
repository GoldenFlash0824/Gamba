import React, { useEffect, useState } from 'react'
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from 'react-places-autocomplete'
import styled from 'styled-components'
import { Col, media } from 'styled-bootstrap-grid'
import { Text, Arrow, Flexed } from '../styled/shared'
import { palette } from '../styled/colors'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AddPostModal from './modals/AddPostModal'
import MobViewAddPost from './MobViewAddPost'
import Loader from './common/Loader'
import { useDispatch } from 'react-redux'
import { saveSearchLat, saveSearchLog, saveSearchText } from '../actions/authActions'
import LoginPopupModel from './modals/LoginPopupModel'

const SubNavBar = () => {
	const _navigate = useNavigate()
	const { pathname } = useLocation()
	const authToken = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const isLoading = useSelector<any>((state: any) => state.auth.isLoading)
	const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false)
	const [address, setAddress]: any = useState('')
	const [select, setSelect] = useState('Photo')
	const [isModalFooterOpen, setIsModalFooterOpen] = useState(true)
	const [serachText, setSearchText] = useState('')
	const _dispatch = useDispatch()
	const searchQuery: any = useSelector<any>((state: any) => state.auth.topSearch)
	const [loginPopup, setLoginPopup] = useState(false)

	const handleSelect = (address: any) => {
		if (address !== '') {
			setAddress(address);
			geocodeByAddress(address)
				.then((results: any[]) => {
					if (results.length > 0) {
						const location = results[0].geometry.location;
						return {
							lat: location.lat(),
							lng: location.lng()
						};
					} else {
						throw new Error('No results found for the specified address.');
					}
				})
				.then((latLng: any) => {
					_dispatch(saveSearchLat(latLng?.lat))
					_dispatch(saveSearchLog(latLng?.lng))
				}).catch((err: any) => console.log('Error: ', err))
		}
	}

	useEffect(() => {
		setSearchText(searchQuery)
	}, [searchQuery])

	useEffect(() => {
		if (address === '') {
			_dispatch(saveSearchLat(null))
			_dispatch(saveSearchLog(null))
		}
	}, [address])
	return (
		<>
			<Grid>
				<PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
					{({ getInputProps, suggestions, getSuggestionItemProps }: any) => (
						<div style={{ flexGrow: 1 }}>
							<>
								<LocationInputWrapper>
									<GoogleAutoLocation width={'100%'} borderRadius={'0.2rem'} margin={'0'} padding={'0.8rem 0.8rem 0.8rem 2.5rem'} value={address} {...getInputProps()} placeholder="Enter Zip Code, City, Neighborhood" />
									<Search src="/images/icons/search.svg" alt="search" />
								</LocationInputWrapper>
								<ListItems open={suggestions?.length > 0}>
									{suggestions?.map((suggestion: any, i: any) => {
										const style = {
											backgroundColor: suggestion.active ? '#32CD32' : 'white'
										}
										return (
											<LocationList
												key={i + 'mapkey'}
												{...getSuggestionItemProps(suggestion, {
													style
												})}>
												{suggestion?.description}
											</LocationList>
										)
									})}
								</ListItems>
							</>
						</div>
					)}
				</PlacesAutocomplete>
				<InputWrapper>
					{!pathname.includes('/chat') && !pathname.includes('/notification') && !pathname.includes('/cart') && !pathname.includes('/settings') && (
						<>
							<Input
								className=''
								placeholder="Search"
								value={serachText}
								onChange={(e: any) => {
									setSearchText(e.target.value)
									_dispatch(saveSearchText(e.target.value))
								}}
							/>
							<Search src="/images/icons/search.svg" alt="search" />
						</>
					)}
				</InputWrapper>
				<Flexed direction="row">
					<div>
						<PostWebView>
							<PostButton
								onClick={() => {
									if (authToken !== null) {
										setIsAddPostModalOpen(true)
									} else {
										setLoginPopup(true)
										// _navigate('/sign-in')
									}
								}}>
								<img src="/images/icons/add_btn.svg" alt="add" />
								Post
							</PostButton>
						</PostWebView>
					</div>
				</Flexed>
			</Grid>

			{isAddPostModalOpen && (
				<AddPostModal
					setSelect={setSelect}
					setIsModalFooterOpen={setIsModalFooterOpen}
					isModalFooterOpen={isModalFooterOpen}
					select={select}
					onClose={() => {
						setIsAddPostModalOpen(false)
					}}
				/>
			)}

			{isLoading && <Loader visible={isLoading} />}
			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</>
	)
}

const Grid = styled.div`
	display: flex;
	align-items: center;
	gap: 0.5rem;
`

const SocialIcon = styled.img<any>`
	width: 1.5rem;
	color: ${({ pathname }) => (pathname === '/products' ? palette.Btn_dark_green : palette.text)};
`
const ProductsIcon = styled.img<any>`
	width: 1.3rem;
	color: ${({ pathname }) => (pathname === '/products' ? palette.Btn_dark_green : palette.text)};
`
const CalenderIcon = styled.img<any>`
	width: 1.4rem;
	color: ${({ pathname }) => (pathname === '/calendar' ? palette.Btn_dark_green : palette.text)};
`
const Input = styled.input`
	font-family: 'Lato-Regular', sans-serif;
	line-height: normal;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1.25rem;
	border-radius: 1.875rem;
	padding: 0.45rem 4.25rem 0.45rem 1.25rem;
	border: 1px solid rgb(248, 249, 250);
	color: ${palette.black};
	background: #F0F2F5;
	width: 100%;
	&::placeholder {
		color: ${palette.gray_100};
	}
`

const GoogleAutoLocation = styled.input<any>`
	font-family: 'Lato-Regular', sans-serif;
	line-height: normal;
	outline: none;
	font-weight: 400;
	text-align: left;
	font-size: 1rem;
	border-radius: 0.5rem;
	padding: 0.45rem 4.25rem 0.45rem 1.25rem;
	border: 1px solid ${palette.stroke};
	background: #F0F2F5;
	width: 100%;
	&:focus {
		border: 1px solid ${({ error, disabled }) => (disabled ? 'none' : error ? palette.danger : palette.Btn_dark_green)};
	}
	&::placeholder {
		color: ${palette.gray_100};
	}

	&:-ms-input-placeholder {
		/* Internet Explorer 10-11 */
		color: ${({ disabled, isDarkTheme }) => (disabled || isDarkTheme ? `${palette.silver}` : `${palette.gray_100}`)};
	}

	&::-ms-input-placeholder {
		/* Microsoft Edge */
		// color: ${palette.gray_100};
	}
`

const LocationList = styled.div`
	background - color: ${palette.white};
	cursor: pointer;
	line - height: 2rem;
	padding: 0.5rem 0.8rem;
	border - bottom: 1px solid ${palette.stroke};
	font - family: 'Lato-Regular', sans - serif;
	text - transform: normal;
	color: ${palette.heading_color};
		&:hover {
		background: ${palette.Btn_dark_green};
		color: ${palette.white};
	}

		&: first - child {
		border - top - left - radius: 0.375rem;
		border - top - right - radius: 0.375rem;
	}
		&: last - child {
		border - bottom - left - radius: 0.375rem;
		border - bottom - right - radius: 0.375rem;
	}
		&: last - child {
		border - bottom: 0;
	}
`

const CustomCol = styled(Col)`
	display: flex;
	min-height: 4.375rem;
	align-items: center;
`

const MobMenuIcons = styled.div`
	display: flex;
	cursor: pointer;
`

const PostWebView = styled.div`
	display: block;
`
const LocationInputWrapper = styled.div`
	position: relative;
`

const InputWrapper = styled.div`
	position: relative;
	max-width: 15rem
`

const LabelWrapper = styled.div``

const Search = styled.img`
	position: absolute;
	top: 30%;
	
	right: 1.25rem;
	margin: auto;
	width:20px;
	height:18px;
`

const ListItems = styled.div<any>`
	position: absolute;
	background: ${palette.white};
	z - index: 1;
	width: calc(100 % - 1.875rem);
	border: ${({ open }) => (open ? `1px solid ${palette.stroke}` : null)};

	border - radius: 1rem;

	max - height: 15rem;
	overflow - y: auto;
`

const PostButton = styled.div`
	background-color: ${palette.green_200};
	color: ${palette.white};
	padding: 0.625rem 1.2rem;
	font-size: 1rem;
	border-radius: 2rem;
	font-family: 'Lato-Bold', sans-serif;
	height: 40px;
	display: flex;
	font-weight: 700;
	gap: 0.5rem;
	align-items: center;
	cursor: pointer;
	&:hover {
		/* opacity: 0.7; */
		transition: background-color 0.3s ease 0.2s;
		background-color: rgb(64, 115, 10);
	}
	${media.xs`
	padding: 0.6rem 1rem;
	 `};
	${media.sm`
	padding: 0.6rem 1rem;
	 `};
	${media.md`
	padding: 0.625rem 1.2rem;
	 `};
	${media.lg`
	padding: 0.625rem 1.2rem;
	 `}
`

const CartIcon = styled.span`
	font-size: 1.5rem;
`

export const MenuText = styled(Text) <any>`
	position: relative;
	color: ${palette.text};
	letter-spacing: 0.05em;
	/* font-weight: 600; */
	font-size: ${({ fontSize, active }) => (fontSize ? fontSize : active ? '1rem' : '1rem')};

	cursor: pointer;
	&:not(:last-child) {
		/* padding-right: 2.5rem; */
	}

	& ${Arrow} {
		color: ${({ scroll, path, isDarkTheme }) => (isDarkTheme ? `${palette.silver}` : scroll < 0 && path ? `${palette.text_black}` : `${palette.gray}`)};
	}

	&:hover ${Arrow} {
		transform: rotate(-180deg);
		color: ${palette.orange};
	}

	&:hover {
		color: ${({ active }) => (active ? palette.Btn_dark_green : palette.Btn_dark_green)};
		transition: color 0.1s ease 0.1s;
	}
`

const StyledText = styled(MenuText)`
	display: block;
	font-weight: ${({ active }) => (active ? 600 : 400)};
	${media.xs`
	display:none
	`}
`

const Tab = styled(Flexed) <any>`
	display: flex;
	/* justify-content: center; */
	padding: 0.5rem 0rem;
	/* min-width: 33%; old property */
	/* min-width: 20%; */
	/* margin-bottom: 0.125rem; */
	border-bottom: ${({ active }) => (active ? `0.188rem solid ${palette.orange}` : `0.188rem solid transparent`)};
	/* border-right: ${({ border }) => (border ? ` 0.063rem solid ${palette.gray}` : '')}; */
	cursor: pointer;

	/* background-color: ${({ active }) => (active ? '#e5e6e9' : '')}; */
	/* opacity: 0.1; */
	&:hover {
		border-bottom: 0.188rem solid ${palette.orange};
	}
	&:hover ${SocialIcon} {
		color: ${palette.orange};
	}
	&:hover ${CalenderIcon} {
		color: ${palette.orange};
	}
	&:hover ${ProductsIcon} {
		color: ${palette.orange};
	}
	&:hover ${StyledText} {
		color: ${palette.orange};
	}

	/* ${media.md`
    min-width: 11rem;
  `}
	${media.lg`
    min-width: 12.8rem;
  `}
	${media.xl`
    min-width: 16rem;
  `} */
`
export default SubNavBar
