import React, {useState} from 'react'
import {Flexed, Spacer} from '../styled/shared'
import {Col, Container, Row} from 'styled-bootstrap-grid'
import CustomInputField from './common/CustomInputField'
import styled from 'styled-components'
import {palette} from '../styled/colors'
import {connectSellerTradeProduct} from '../apis/apis'
import {toastError, toastSuccess} from '../styled/toastStyle'
import Loader from './common/Loader'

const TradeProduct = ({data, onClose}: any) => {
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [topic, setTopic] = useState('')
	const [contactNumber, setContactNumber] = useState('')
	const [caption, setCaption] = useState('')

	const [fullNameError, setFullNameError] = useState('')
	const [emailError, setEmailError] = useState('')
	const [captionError, setCaptionError] = useState('')
	const [contactNumberError, setContactNumberError] = useState('')
	const [loading, setLaoding] = useState(false)

	const validation = () => {
		let isValid = true

		if (caption === '') {
			setCaptionError('Caption is required')
			isValid = false
		}

		if (fullName === '') {
			setFullNameError('Name is required')
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
		if (data?.user?.email) {
			setLaoding(true)
			let res = await connectSellerTradeProduct(fullName, email, contactNumber, topic, caption, data?.user?.email, data?.name, data?.user?.first_name + ' ' + data?.user?.last_name )
			if (res?.success === true) {
				onClose()
				toastSuccess('Information is send')
				setLaoding(false)
			} else {
				setLaoding(false)
				toastError('Information sending failed ')
			}
			setLaoding(false)
		}
	}

	return (
		<Wrapper>
			<Row>
				{loading && <Loader visible={loading} />}
				<Col md={6}>
					<CustomInputField
						bgTransparent
						type="text"
						maxLength={40}
						label="Full Name"
						placeholder="John Doe"
						handleChange={(e: any) => {
							setFullNameError('')
							if (e === '') {
								setFullNameError('Name is required')
							}
							setFullName(e)
						}}
						value={fullName}
						error={fullNameError}
						errorMsg={fullNameError}
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

				<Col md={6}>
					<CustomInputField
						bgTransparent
						type="text"
						maxLength={40}
						label="Interested in"
						placeholder="Topic"
						handleChange={(e: any) => {
							setTopic(e)
						}}
						value={topic}
					/>
					<Spacer height={1.25} />
				</Col>

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

export default TradeProduct
