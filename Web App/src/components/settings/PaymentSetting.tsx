/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { palette } from '../../styled/colors'
import { Flexed, Spacer, Text } from '../../styled/shared'
import { media } from 'styled-bootstrap-grid'
import { Link, useNavigate } from 'react-router-dom'
import { connectToStripe, doGetUserProfile, removeConnectedAccount, retriveUserAccount, getCards, setCardAsDefault } from '../../apis/apis'
import useRouter from '../useRouterHook'
import { toastError, toastSuccess } from '../../styled/toastStyle'
import Loader from '../common/Loader'
import { FaStripeS } from 'react-icons/fa'
import { Elements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe, PaymentMethod, Stripe } from '@stripe/stripe-js'
import Button from '../common/Button'
import StripeCardLayout from './StripeCardLayout'


const PaymentSetting = ({ setSelectedPaymentOption }) => {

	const [sellerAccount, setSellerAccount] = useState(false);
	const [buyerAccount, setBuyerAccount] = useState(false);

	const [displayChooseCard, setDisplayChooseCard] = useState(false);
	const [displayAddCard, setDisplayAddCard] = useState(false);
	const [cards, setSavedCards] = useState([] as string[]);

	const handleSellerAccountClick = () => {
		setSellerAccount(true);
		setBuyerAccount(false);
		setDisplayChooseCard(false);
		setDisplayAddCard(false);
	};

	const handleBuyerAccountClick = () => {
		setBuyerAccount(true);
		setSellerAccount(false);
	};

	const handleChooseDefaultCardClick = async () => {
		setLoading(true)
		setDisplayChooseCard(true);
		setDisplayAddCard(false);

		const cards: any = await getCards();
		if (cards.success) {
			setSavedCards(cards.data as string[]);
		}
		setLoading(false);
	};

	const handleAddNewCardClick = () => {
		setDisplayChooseCard(false);
		setDisplayAddCard(true);
	};


	const [loading, setLoading] = useState(false)
	const [user, setUser] = useState<any>({})
	const router = useRouter()
	const _navigate = useNavigate()

	useEffect(() => {
		getUserProfileInfo()
	}, [])

	useEffect(() => {
		if (router.query.status === 'stripe_return' && router.query.account_id) {
			userStripeAccount(router.query.account_id)
		}
	}, [router.query])

	const userStripeAccount = async (id) => {
		setLoading(true)
		const res: any = await retriveUserAccount(id)
		if (res.success) {
			_navigate('/settings')
			getUserProfileInfo()
			toastSuccess(res?.message)
			setLoading(false)
		} else {
			_navigate('/settings')
			toastError(res?.message)
			setLoading(false)
		}
	}

	const connectStripe = async () => {
		setLoading(true)
		let data: any = await connectToStripe()
		if (data?.data?.url) {
			window.location.href = data?.data?.url
			setLoading(false)
		}
		setLoading(false)
	}

	const getUserProfileInfo = async () => {
		setLoading(true)
		const response = await doGetUserProfile()
		if (response?.data) {
			setUser(response?.data)
			setLoading(false)
		}
		setLoading(false)
	}

	const removeLinkedAccount = async () => {
		setLoading(true)
		const response: any = await removeConnectedAccount()
		if (response?.success) {
			setUser(response?.data?.data)
			setLoading(false)
			toastSuccess('Stripe account removed')
		} else {
			setLoading(false)
			toastError(response?.message)
		}
	}


	const handleCheckboxChange = async (paymentMethodId) => {
		setLoading(true);
		const response: any = await setCardAsDefault(paymentMethodId)
		if (response.success) {
			const cards: any = await getCards();
			if (cards.success) {
				setSavedCards(cards.data as string[]);
			}
			toastSuccess(response?.message)
		}
		setLoading(false)
	};


	return (
		<>
			<Wrapper>
				<Loader visible={loading} />


				<Flexed  className="justify-content-between flex-md-row flex-column  align-items-md-center border-bottom pb-2 "  gap="0.875">
						<h2 className='fs-4 fw-semibold'>Payment</h2>
						<div className={`d-flex gap-2 ${sellerAccount ? 'buyer-button' : 'seller-button '}`}>
						<Button className='btns'
						label="Seller Account"
						type="primary"
						ifClicked={() => {
							handleSellerAccountClick()
						}}
					/>
					<Button
						label="Buyer Account"
						type="primary"
						ifClicked={() => {
							handleBuyerAccountClick()
						}}
					/>
						</div>
					</Flexed>
				<Flexed direction="column" gap="1">
					<Spacer height={.325} />
					{sellerAccount && (
						<div>
							<Text type="normal" color="gray" margin="0.5rem 0rem">
								If you are a seller and would like to sell your products on Gamba, you need to have a Strip account. If you do not have an account, please go to{' '}
								<a href="https://dashboard.stripe.com/register" target="blank">
									Stripe
								</a>{' '}
								to create one. If you have an account,{' '}
								<a href="#" onClick={() => connectStripe()}>
									link
								</a>{' '}
								it here. Every product that is sold is processed by Stripe, and the money is transferred straight into your Stripe account. Please refer to the{' '}
								<SellerAggrementText onClick={() => router.navigate('/seller-aggrement')}>seller agreement</SellerAggrementText> for additional information regarding payments and fees.
							</Text>
							<Spacer height={1.25} />
							<div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
								<Flex direction="row" align="center" justify={'center'} gap="1" width={'max-content'}>
									<Flexed direction="row" align="center" gap={0.5}>
										{/* <Image src="/icons/veno.png" /> */}
									</Flexed>

									<Flexed align="center" direction="row" gap={1.5}>
										<Flexed direction="row" align="center" gap={0.5}>
											<div style={{ border: '1px solid gray', margin: '0.3rem', borderRadius: '0.2rem' }}>
												<FaStripeS />
											</div>
											<CustomText type="normal" color="black_100" fontWeight={700}>
												Stripe
											</CustomText>
										</Flexed>

										<Link to="">
											<StyledText type="small" color="blue" onClick={() => (user?.stripe_account_verified ? removeLinkedAccount() : connectStripe())}>
												{user?.stripe_account_verified ? 'Remove Linked  Account' : 'Link Card'}
											</StyledText>
										</Link>
									</Flexed>
								</Flex>
							</div>
							<Spacer height={1.25} />
						</div>
					)}

					{buyerAccount && (
						<div className='d-flex'>
							<button className='buyer-btns' onClick={handleChooseDefaultCardClick}>Choose Default Card</button>
							<button className='buyer-btns' onClick={handleAddNewCardClick}>Add New Card</button>

						</div>
					)}

					{displayChooseCard && (
						<div>
							{
								<CardDetailsTable cardDetails={cards} handleCheckboxChange={handleCheckboxChange} />
							}
						</div>
					)}

					{displayAddCard && (
						
							<Elements stripe={stripePromise || null} options={{ mode: 'setup', currency: 'usd', paymentMethodCreation: 'manual' }}>
								<StripeCardLayout />
							</Elements>
					)}

					
				</Flexed>

			</Wrapper>
		</>
	)
}

const CardDetailsTable = ({ cardDetails, handleCheckboxChange }) => {
	return (
		<table cellPadding={5} cellSpacing={5}>
			<thead>
				<tr>
					<th style={{width: '200px'}} >Brand</th>
					<th style={{width: '80px'}}>Last 4 Digits</th>
					<th style={{width: '250px'}}>Default</th>
				</tr>
			</thead>
			<tbody>
				{cardDetails.map(card => (

							<tr className={card.isDefault ? 'payment-cards default-card' : 'payment-cards'} key={card.id}>
						<td  style={{ padding : '20px'}}>{card.brand}</td>
						<td style={{ padding : '20px'}}>{card.last4}</td>
					<td style={{ padding : '20px'}} className='d-flex justify-content-end align-items-center gap-2'> {card.isDefault ? "Default Card" : "set as Default"} <input
							className='form-check'
							type="checkbox"
							checked={card.isDefault}
							id="cb1"
							onChange={() => handleCheckboxChange(card.id)}
						/></td>
					</tr>
					
				))}
			</tbody>
		</table>
	);
};

const ButtonWrapper = styled.div<any>`
	display: flex;
	align-items: center;
	gap: 1rem;
	position: absolute;
	top: 70vh;
	width: 100%;
	justify-content: center;
	right: ${({ right }) => (right ? `${right}` : '')};
	left: ${({ left }) => (left ? `${left}` : '')};
	z-index: 9;
`

const paymentElementOptions: any = {
	layout: 'tabs',
	billingDetails: true,
	hidePostalCode: true,
	clientSecret: '{{CLIENT_SECRET}}',
}
const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY && loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)



const Wrapper = styled.div`
	background-color: ${palette.white};
	width: 100%;
	
	flex-direction: column;
	padding: 24px !important;
	align-items: start;
	border-radius : 1rem ;
	${media.lg`align-items: center; padding: 0rem 0.6rem;`}
	${media.xl`align-items: start;`}
	margin-bottom : 20px !important;
`

const Image = styled.img`
	width: 1.5rem;
`
const StyledText = styled(Text)`
	text-decoration: underline;
	&:hover {
		font-weight: bold;
	}
`

const Flex = styled(Flexed)`
	padding: 1rem;
	display: block;
	background-color: ${palette.white};
	border: 0.063rem solid ${palette.stroke};
	border-radius: 1rem;
	margin-bottom: 0.5rem;
	&:hover {
		background-color: ${palette.gray_200};
		cursor: pointer;
		transition: color 0.1s ease 0.1s;
	}
	width: ${({ width }) => (width ? width : ' 100% ')};
	gap: 0.5rem;
	justify-content: space-between;
	${media.sm`
	gap:1.5rem;
	`}
`

const SellerAggrementText = styled.span`
	text-decoration: underline;
	cursor: pointer;
	&:hover {
		color: #007bff;
		font-weight: bold;
	}
`

const CustomText = styled(Text)`
`


export default PaymentSetting
