import React, {useEffect, useState} from 'react'
import {Flexed} from '../styled/shared'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {useSelector} from 'react-redux'
import {useDispatch} from 'react-redux'
import {savePostMessage} from '../actions/authActions'
import AddPostModal from './modals/AddPostModal'
import {useNavigate} from 'react-router-dom'
import LoginPopupModel from './modals/LoginPopupModel'

const NewPostWrapper = ({onChange, value}: any) => {
	const userDetails: any = useSelector<any>((state: any) => state.auth.userDetails)
	const postMessage: any = useSelector<any>((state: any) => state.auth.postTitle)
	const authToken = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const _dispatch = useDispatch()
	const [message, setMessage] = useState(postMessage)
	const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false)
	const [select, setSelect] = useState('Photo')
	const [isModalFooterOpen, setIsModalFooterOpen] = useState(true)
	const [loginPopup, setLoginPopup] = useState(false)
	const _navigate = useNavigate()

	useEffect(() => {
		setMessage(postMessage)
	}, [postMessage])

	return (
		<>
			<Wrapper direction="row">
				<div>
					<Profile>
						<Img
							src={
								userDetails?.image
									? process.env.REACT_APP_PUBLIC_IMAGE_URL + userDetails?.image
									: userDetails?.first_name
									? process.env.REACT_APP_PUBLIC_IMAGE_URL + userDetails?.first_name[0]?.toLowerCase() + '.png'
									: '/images/icons/user_logo.png'
							}
							alt=""
						/>
					</Profile>
				</div>
				<MiniWrapper
					onClick={() => {
						if (authToken !== null) {
							setIsAddPostModalOpen(true)
						} else {
							setLoginPopup(true)
							// _navigate('/sign-in')
						}
					}}>
					<Input
						disabled
						placeholder="Share ideas, experiences, thoughts and tips..."
						// value={message}
						// onChange={(e: any) => {
						// 	setMessage(e.target.value)
						// 	_dispatch(savePostMessage(e.target.value))
						// }}
					/>
				</MiniWrapper>
			</Wrapper>
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
			{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
		</>
	)
}

const Wrapper = styled(Flexed)`
	background: ${palette.gray_300};
	padding: 1.25rem;
	gap: 10.625rem;
	border-radius: 20px;
	margin-bottom: 10px;
`
const Profile = styled(Flexed)`
	width: 50px;
	height: 50px;
	border-radius: 100%;
	/* background: ${palette.gray_100}; */
`

const Img = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 100%;
`

const Input = styled.input`
	font-family: 'Lato-Regular', sans-serif;
	line-height: normal;
	outline: none;
	font-weight: 500;
	text-align: left;
	font-size: 1.125rem;
	border-radius: 1.875rem;
	padding: 0.813rem 1.25rem 0.938rem 1.25rem;
	border: 1px solid rgb(248, 249, 250);
	color: ${palette.black};
	background: ${palette.white};
	width: 100%;
	cursor: pointer;
	&::placeholder {
		color: ${palette.gray_100};
	}
`

const MiniWrapper = styled.div`
	cursor: pointer;
	width: 100%;
`
export default NewPostWrapper
