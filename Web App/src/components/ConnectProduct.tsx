import React, { useState } from 'react'
import { Flexed, Spacer } from '../styled/shared'
import { Col, Container, Row } from 'styled-bootstrap-grid'
import CustomInputField from './common/CustomInputField'
import styled from 'styled-components'
import { palette } from '../styled/colors'
import { connectTradeProduct, connectGiveAwayProduct } from '../apis/apis'
import { toastError, toastSuccess } from '../styled/toastStyle'
import Loader from './common/Loader'

const ConnectProduct = ({ data, onClose, category }: any) => {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('')
	const [tradeWith, setTradeWith] = useState('');
	const [topic, setTopic] = useState('')
	const [contactNumber, setContactNumber] = useState('')
	const [caption, setCaption] = useState('')

	const [firstNameError, setFirstNameError] = useState('')
	const [lastNameError, setLastNameError] = useState('')
	const [emailError, setEmailError] = useState('')
	const [captionError, setCaptionError] = useState('')
	const [contactNumberError, setContactNumberError] = useState('')
	const [loading, setLoading] = useState(false)

	const validation = () => {
		let isValid = true

		if (caption === '') {
			setCaptionError('Caption is required')
			isValid = false
		}

		if (firstName === '') {
			setFirstNameError('First Name is required')
			isValid = false
		}

		if (lastName === '') {
			setLastNameError('Last Name is required')
			isValid = false
		}

		if (email === '') {
			setEmailError('Email is required')
			isValid = false
		}

		if (contactNumber === '') {
			setContactNumberError('Contact number is required')
			isValid = false
		}

		return isValid
	}

	const connectHandler = async () => {
		if (category === 'trade') {
			if (data?.user?.email) {
				setLoading(true)
				const trade_info = data.trade[0].title;
				let full_name = firstName + lastName;
				let res = await connectTradeProduct(full_name, email, contactNumber, topic, tradeWith, caption, data?.user?.email, data?.name, data?.user?.first_name + ' ' + data?.user?.last_name, trade_info);
				if (res?.success === true) {
					onClose()
					toastSuccess('Information is send')
					setLoading(false)
				} else {
					setLoading(false)
					toastError('Information sending failed ')
				}
				setLoading(false)
			}
		} else {
			if (data?.user?.email) {
				setLoading(true);
				let full_name = firstName + ' ' + lastName;
				let res = await connectGiveAwayProduct(full_name, email, contactNumber, topic, caption, data?.user?.email, data?.name, data?.user?.first_name + ' ' + data?.user?.last_name)
				if (res?.success === true) {
					onClose()
					toastSuccess('Information is send')
					setLoading(false)
				} else {
					setLoading(false)
					toastError('Information sending failed ')
				}
				setLoading(false)
			}
		}
	}

	return (
		<Wrapper>
			<Row>
				{loading && <Loader visible={loading} />}
				<Col md={3}>
					<CustomInputField
						bgTransparent
						type="text"
						maxLength={40}
						label="First Name"
						placeholder="John"
						handleChange={(e: any) => {
							setFirstNameError('')
							if (e === '') {
								setFirstNameError('First Name is required')
							}
							setFirstName(e)
						}}
						value={firstName}
						error={firstNameError}
						errorMsg={firstNameError}
						required
					/>
					<Spacer height={1.25} />
				</Col>
				<Col md={3}>
					<CustomInputField
						bgTransparent
						type="text"
						maxLength={40}
						label="Last Name"
						placeholder="Doe"
						handleChange={(e: any) => {
							setLastNameError('')
							if (e === '') {
								setLastNameError('Last Name is required')
							}
							setLastName(e)
						}}
						value={lastName}
						error={lastNameError}
						errorMsg={lastNameError}
						required
					/>
					<Spacer height={1.25} />
				</Col>
				<Col md={6}>
					<CustomInputField
						bgTransparent
						type="email"
						maxLength={40}
						label="Email"
						placeholder="johndoe@mail.com"
						handleChange={(e: any) => {
							setEmailError('')
							if (e === '') {
								setEmailError('Email is required')
							}
							setEmail(e)
						}}
						value={email}
						error={emailError}
						errorMsg={emailError}
						required
					/>
					<Spacer height={1.25} />
				</Col>
				<Col md={6}>
					<CustomInputField
						bgTransparent
						type="text"
						maxLength={40}
						label="Phone No."
						placeholder="+1 234 567 8901"
						handleChange={(e: any) => {
							setContactNumberError('')
							if (e === '') {
								setContactNumberError('Contact Number is required')
							}
							setContactNumber(e)
						}}
						value={contactNumber}
						error={contactNumberError}
						errorMsg={contactNumberError}
						required
						allowPhoneNumberOnly
					/>
					<Spacer height={1.25} />
				</Col>

				{category === 'trade' && <>
					<Col md={3}>
						<CustomInputField
							bgTransparent
							type="text"
							maxLength={40}
							label="Trade"
							placeholder="Guava"
							handleChange={(e: any) => {
								setTopic(e)
							}}
							value={topic}
						/>
						<Spacer height={1.25} />
					</Col>
					<Col md={3}>
						<CustomInputField
							bgTransparent
							type="text"
							maxLength={40}
							label="with"
							placeholder="Banana"
							handleChange={(e: any) => {
								setTradeWith(e)
							}}
							value={tradeWith}
						/>
						<Spacer height={1.25} />
					</Col>
				</>}

				{category === 'donate' && <>
					<Col md={6}>
						<CustomInputField
							bgTransparent
							type="text"
							maxLength={40}
							label="Giveaway"
							placeholder="Apple"
							handleChange={(e: any) => {
								setTopic(e)
							}}
							value={topic}
						/>
						<Spacer height={1.25} />
					</Col>
				</>}

				<Col>
					<CustomInputField
						bgTransparent
						type="textarea"
						label="More Info"
						placeholder="Write message..."
						handleChange={(e: any) => {
							setCaptionError('')
							if (e === '') {
								setCaptionError('Description is required')
							}
							setCaption(e)
						}}
						value={caption}
						error={captionError}
						errorMsg={captionError}
						required
						textAreaRows={6}
					/>
					<Spacer height={1.125} />
				</Col>

				<Col>
					<Flexed direction="row" justify="">
						<Button
							onClick={() => {
								if (validation()) {
									connectHandler()
								}
							}}>
							Connect
						</Button>
					</Flexed>
				</Col>
			</Row>
		</Wrapper>
	)
}

const Wrapper = styled(Container)`
	padding: 0rem;
`

const Button = styled.div`
	border-radius: 1.875rem;
	border: none;
	height: 50px;
	font-size: 1rem;
	color: ${palette.white};
	background: ${palette.green_200};
	font-weight: 700;
	cursor: pointer;
	width: 150px;
	line-height: normal;
	white-space: nowrap;
	-webkit-box-align: center;
	align-items: center;
	position: relative;
	display: flex;
	-webkit-box-pack: center;
	justify-content: center;
	transition: all 0.25s ease 0s;
	font-family: Lato-Bold, sans-serif;
`

export default ConnectProduct;
