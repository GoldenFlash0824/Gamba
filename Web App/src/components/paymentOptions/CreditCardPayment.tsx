import React, {useState} from 'react'
import styled from 'styled-components'
import {palette} from '../../styled/colors'
import {Flexed, Spacer, Text} from '../../styled/shared'
import {Row, Col, media} from 'styled-bootstrap-grid'
import {IoIosArrowForward} from 'react-icons/io'
import CustomInputField from '../common/CustomInputField'

const CreditCardPayment = ({setSelectCategory, setSelectedPaymentOption, setSelectProfileSettingsCategory}) => {
	const [cardNumber, setCardNumber] = useState('')
	const [cardHolderName, setCardHolderName] = useState('')
	const [ccv, setCcv] = useState('')
	const [expiry, setExpiry] = useState('')

	const [ccvError, setCcvError] = useState('')
	const [expiryError, serExpiryError] = useState('')
	const [cardNumberError, setCardNumberError] = useState('')
	const [cardHolderNameError, setCardHolderNameError] = useState('')
	return (
		<>
			<Flexed direction="row" align="center" gap="0.5" margin="0rem 0rem 0.5rem 0.6rem">
				<Text
					pointer
					type="normal"
					color="gray"
					fontWeight={500}
					onClick={() => {
						setSelectProfileSettingsCategory('')
						setSelectCategory('payment')
						setSelectedPaymentOption('')
					}}>
					Payment
				</Text>
				<img src='/images/icons/arrow.svg' alt='arrow' />
				<Text type="normal" color="black_100" fontWeight={500}>
					Credit Card
				</Text>
			</Flexed>
			<Wrapper>
				<Spacer height={1.875} />
				<Row>
					<Col sm={6}>
						<CustomInputField
							type="text"
							label="Card No"
							placeholder="Enter"
							handleChange={(e: any) => {
								setCardNumberError('')
								if (e === '') {
									setCardNumberError('Card number is required')
								}
								setCardNumber(e)
							}}
							value={cardNumber}
							error={cardNumberError}
							errorMsg={cardNumberError}
							required
						/>
						<Spacer height={1.5} />
					</Col>
					<Col sm={6}>
						<CustomInputField
							type="text"
							label="Card Holder Name"
							placeholder="Enter"
							handleChange={(e: any) => {
								setCardHolderNameError('')
								if (e === '') {
									setCardHolderNameError('Card Holder name is required')
								}
								setCardHolderName(e)
							}}
							value={cardHolderName}
							error={cardHolderNameError}
							errorMsg={cardHolderNameError}
							required
						/>
						<Spacer height={1.5} />
					</Col>
					<Col sm={6}>
						<CustomInputField
							type="text"
							label="Ccv"
							placeholder="Enter"
							handleChange={(e: any) => {
								setCcvError('')
								if (e === '') {
									setCcvError('ccv is required')
								}
								setCcv(e)
							}}
							value={ccv}
							error={ccvError}
							errorMsg={ccvError}
							required
						/>
						<Spacer height={1.5} />
					</Col>
					<Col sm={6}>
						<CustomInputField
							type="text"
							label="Expiry"
							placeholder="Enter"
							handleChange={(e: any) => {
								serExpiryError('')
								if (e === '') {
									serExpiryError('expiry date is required')
								}
								setExpiry(e)
							}}
							value={expiry}
							error={expiryError}
							errorMsg={expiryError}
							required
						/>
						<Spacer height={1.5} />
					</Col>
					<Col>
						<Flexed direction="row" align="center">
							<Button>Submit</Button>
						</Flexed>
					</Col>
				</Row>
			</Wrapper>
		</>
	)
}

const Wrapper = styled.div`
	background-color: ${palette.white};
	padding: 0rem 0.6rem;
	width: 100%;s
`

const Image = styled.img`
	width: 2rem;
`

const Flex = styled(Flexed)`
	width: 100%;
	gap: 0.5rem;
	${media.sm`
	gap:1.5rem;
	`}
`

const CustomText = styled(Text)`
	width: 20rem;
	color: ${palette.text};
`
const CustomHeading = styled.div<any>`
	position: relative;
	font-size: 1.25rem !important;
	margin: 0.5rem 0rem;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 0.5rem;
	justify-content: center;

	text-align: center;
	color: ${({active}) => (active ? palette.Btn_dark_green : palette.text)};
	margin-bottom: 0.5rem;

	${media.lg`justify-content: flex-start;
	`}

	&:hover {
		color: ${palette.Btn_dark_green};
		transition: color 0.1s ease-in-out;
	}
`
const Button = styled.div<any>`
	padding: 1.25rem 1.3rem;
	display: flex;
	-webkit-box-align: center;
	align-items: center;
	-webkit-box-pack: center;
	justify-content: center;
	border-radius: 1.875rem;
	height: 3.125rem;
	color: ${palette.white};
	font-weight: 700;
	font-family: 'Lato-Regular' , sans-serif;
	font-size: 1rem;
	text-align: left;
	opacity: 1;
	width: 150px;
	border: 1px solid ${palette.green_200};
	background-color: ${({ disabled }) => (disabled ? palette.white : palette.green_200)};
	cursor: ${({ disabled }) => (disabled ? 'no-drop' : 'pointer')};
	&:hover {
		background-color: ${palette.white};
		color: ${palette.green_200};
	}
`

export default CreditCardPayment
