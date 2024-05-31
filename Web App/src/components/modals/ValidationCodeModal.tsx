import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal } from 'react-responsive-modal'
import 'react-responsive-modal/styles.css'
import { Text, Flexed, Spacer } from '../../styled/shared'
import { palette } from '../../styled/colors'
import Button from '../common/Button'
import { Col, Container, media, Row } from 'styled-bootstrap-grid'
import InputField from '../common/InputField'
import { verifyUserRegisterCodeApi } from '../../apis/apis'
import VerificationInput from 'react-verification-input'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setIsLoading } from '../../actions/authActions'
import Loader from '../common/Loader'
import { useSelector } from 'react-redux'
import { toastError, toastSuccess } from '../../styled/toastStyle'

const ValidationCodeModal = ({ onClose, registrationCode, email, setEmail }: any) => {
	const [verified, setVerified] = useState('')
	const [errorMsg, setErrorMsg] = useState('')
	const isLoading = useSelector<any>((state: any) => state.auth.isLoading)

	const _dispatch = useDispatch()
	let _navigate = useNavigate()

	const checkVerification = async () => {
		_dispatch(setIsLoading(true))
		const response = await verifyUserRegisterCodeApi(email, verified)
		_dispatch(setIsLoading(false))
		if (response.message === 'User verified successfully') {
			toastSuccess(response.message)
			onClose(false)
			setVerified('')
			setEmail('')
			_navigate('/sign-in')
		} else if (response.message === 'User already verified, Please login') {
			toastError(response.message)
			_navigate('/sign-in')
		} else {
			toastError(response.message)
			setErrorMsg(response.message)
		}
	}

	return (
		<>
			<Modal
				open={registrationCode}
				onClose={() => { }}
				center
				showCloseIcon={false}
				classNames={{
					overlay: 'customOverlay',
					modal: 'smallModal'
				}}>
				<>
					<ModalWrapper>
						<Head direction="row" align="center" justify="space-between">
							<Text type="small" lineHeight="1.438" color="heading_color">
								Please Enter the Validation Code which send to your Email
							</Text>
						</Head>
						<Body>
							<Container>
								<Row>
									<CustomCol>
										<VerificationInput
											validChars="0-9"
											classNames={{
												character: 'character'
											}}
											onChange={(e: any) => {
												setErrorMsg('')
												setVerified(e)
											}}
											// onComplete={() => {
											// 	checkVerification()
											// }}

											value={verified}
										/>
									</CustomCol>
									<Col>
										<Spacer height="1" />
										<Text fontSize={0.725} type="small" color="danger">
											{errorMsg}
										</Text>
									</Col>
								</Row>
							</Container>
						</Body>
						<Footer>
							<Flexed direction="row" align="center">
								<Button
									type="danger"
									disabled={verified.length < 6}
									label="Verify Now"
									ifClicked={() => {
										checkVerification()
									}}
								/>
							</Flexed>
						</Footer>
					</ModalWrapper>
					{isLoading && <Loader visible={isLoading} />}
				</>
			</Modal>
		</>
	)
}

const ModalWrapper = styled.div``

const Head = styled(Flexed)`
	background: ${palette.opacity.sky_navy_0_5};
	// padding: 1rem 2.5rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
	padding-bottom: 1rem;
`

const Footer = styled.div`
	padding: 1rem 2.5rem;
	${media.xs`padding: 1.5rem 1.5rem;`};
`
const Body = styled.div`
	background: ${palette.white};
	// padding: 1rem 2.5rem;
	// ${media.xs`padding: 1.5rem 1.5rem;`};
`
const CustomCol = styled(Col)`
	padding-left: 0;
`

export default ValidationCodeModal
