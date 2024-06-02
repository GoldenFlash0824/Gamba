import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import { Text, Spacer, Flexed } from '../../styled/shared'
import { palette } from '../../styled/colors'
import { Col, media } from 'styled-bootstrap-grid'
import Button from '../common/Button'
import { hideEvent, hidePost, hideSeller } from '../../apis/apis'
import { saveRoute, setIsLoading } from '../../actions/authActions'
import { useDispatch } from 'react-redux'
import { toastError, toastSuccess } from '../../styled/toastStyle'
import { useNavigate } from 'react-router-dom'
import LoginPopupModel from './LoginPopupModel'
const closeIcon = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M13.4099 12.0002L17.7099 7.71019C17.8982 7.52188 18.004 7.26649 18.004 7.00019C18.004 6.73388 17.8982 6.47849 17.7099 6.29019C17.5216 6.10188 17.2662 5.99609 16.9999 5.99609C16.7336 5.99609 16.4782 6.10188 16.2899 6.29019L11.9999 10.5902L7.70994 6.29019C7.52164 6.10188 7.26624 5.99609 6.99994 5.99609C6.73364 5.99609 6.47824 6.10188 6.28994 6.29019C6.10164 6.47849 5.99585 6.73388 5.99585 7.00019C5.99585 7.26649 6.10164 7.52188 6.28994 7.71019L10.5899 12.0002L6.28994 16.2902C6.19621 16.3831 6.12182 16.4937 6.07105 16.6156C6.02028 16.7375 5.99414 16.8682 5.99414 17.0002C5.99414 17.1322 6.02028 17.2629 6.07105 17.3848C6.12182 17.5066 6.19621 17.6172 6.28994 17.7102C6.3829 17.8039 6.4935 17.8783 6.61536 17.9291C6.73722 17.9798 6.86793 18.006 6.99994 18.006C7.13195 18.006 7.26266 17.9798 7.38452 17.9291C7.50638 17.8783 7.61698 17.8039 7.70994 17.7102L11.9999 13.4102L16.2899 17.7102C16.3829 17.8039 16.4935 17.8783 16.6154 17.9291C16.7372 17.9798 16.8679 18.006 16.9999 18.006C17.132 18.006 17.2627 17.9798 17.3845 17.9291C17.5064 17.8783 17.617 17.8039 17.7099 17.7102C17.8037 17.6172 17.8781 17.5066 17.9288 17.3848C17.9796 17.2629 18.0057 17.1322 18.0057 17.0002C18.0057 16.8682 17.9796 16.7375 17.9288 16.6156C17.8781 16.4937 17.8037 16.3831 17.7099 16.2902L13.4099 12.0002Z"
			fill="#75788D"
		/>
	</svg>
)

const HideModal = ({ onClose, eventId, setSellerId, community, getAllSellers, setIsSellerSelfProfileOpen, post, getAllEvents, postId, getAllUserAndPosts, event, sellerProfile, sellerId, title, body }: any) => {
	const _dispatch = useDispatch()
	const _navigate = useNavigate()
	const token = localStorage.getItem('authorization') || sessionStorage.getItem('authorization')
	const [loginPopup, setLoginPopup] = useState(false)

	const doHideEvent = async () => {
		_dispatch(setIsLoading(true))
		onClose()
		const response = await hideEvent(eventId)

		if (response?.success) {
			// alert(1)
			await getAllEvents()
			toastSuccess(response?.message)
		} else toastError(response?.message)

		_dispatch(setIsLoading(false))
	}
	const doHidePost = async () => {
		_dispatch(setIsLoading(true))
		onClose()
		const response = await hidePost(postId)

		if (response?.success) {
			await getAllUserAndPosts()
			toastSuccess(response?.message)
		} else toastError(response?.message)

		_dispatch(setIsLoading(false))
	}
	const doHideSeller = async () => {
		if (token) {
			_dispatch(setIsLoading(true))

			const response = await hideSeller(sellerId)

			if (response?.success) {
				if (!community) {
					await getAllSellers()
					setIsSellerSelfProfileOpen(false)
				} else {
					// _dispatch(saveRoute('/products'))
					// _navigate('/products')
					setSellerId('')
				}
				onClose()
				toastSuccess(response?.message)
			} else toastError(response?.message)

			_dispatch(setIsLoading(false))
		} else {
			setLoginPopup(true)
		}
	}
	return (
		<>
			<Modal
				open={true}
				onClose={() => {
					onClose(false)
				}}
				center
				closeIcon={closeIcon}
				classNames={{
					overlay: 'customOverlay',
					modal: 'smallModal'
				}}>
				<ModalWrapper>
					<Head direction="row" align="center" justify="space-between">
						<Text fontSize={1.5} lineHeight="1.438" fontWeight={700} color="black_300">
							Hide {post ? 'Post' : event ? 'Event' : sellerProfile ? 'Seller Profile' : ''}
						</Text>
					</Head>
					<Body>
						<Text type="normal" fontWeight={400} color="black_300">
							Are you sure you want to hide this {post ? 'Post' : event ? 'Event' : sellerProfile ? 'Seller Profile' : ''}?
						</Text>
						<Spacer height="1.5" />
						<Flexed direction="row" align="center" justify="space-between">
							<Button hasBorder type="clear" label="Close" ifClicked={onClose} />
							<Button
								type="danger"
								label="Hide"
								ifClicked={async () => {
									if (event) {
										doHideEvent()
									} else if (post) {
										doHidePost()
									} else if (sellerProfile) {
										doHideSeller()
									}
								}}
							/>
						</Flexed>
					</Body>
				</ModalWrapper>
				<Spacer height="2" />

				{loginPopup && <LoginPopupModel onClose={() => setLoginPopup(false)} />}
			</Modal>
		</>
	)
}

const ModalWrapper = styled.div``

const Head = styled(Flexed)`
	background: ${palette.opacity.sky_navy_0_5};
	// padding: 2rem 2.5rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
	padding-bottom: 1rem;
`

const Body = styled.div`
	background: ${palette.white};
	// padding: 0.5rem 2.5rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
`

export default HideModal
