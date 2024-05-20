import React from 'react'
import {PaymentElement, useStripe, useElements, CardElement} from '@stripe/react-stripe-js'
import Loader from '../common/Loader'
import Button from './Button'
import {Flexed, Spacer} from '../../styled/shared'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
import {makePaymentInitialze, paymentApi} from '../../apis/apis'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import {useDispatch} from 'react-redux'
import {clearCart} from '../../actions/cartActions'
import {editCartBeforeCheckout} from '../../actions/authActions'
import {toastError} from '../../styled/toastStyle'

export default function CheckoutForm({sellersAndProducts}: any) {
	const stripe: any = useStripe()
	const MySwal = withReactContent(Swal)
	const cart: any = useSelector<any>((state: any) => state.cart)
	const elements: any = useElements()
	const [message, setMessage] = React.useState<any>(null)
	const [isLoading, setIsLoading] = React.useState(false)
	const user: any = useSelector<any>((state: any) => state.auth.userDetails)
	let _navigate = useNavigate()
	const dispatch = useDispatch()

	const handleSubmit = async (event) => {
		try {
			event.preventDefault()
			setIsLoading(true)
			const {token, error} = await stripe.createToken(elements.getElement(CardElement), {billing_details: {name: user?.first_name + ' ' + user?.last_name, email: user?.email}})

			if (error) {
				setIsLoading(false)
				toastError(error.message)
			} else {
				const total: number = cart?.products?.reduce((result, item) => {
					return result + item.quantity * item.discountPrice
				}, 0)

				let response = await makePaymentInitialze(token, sellersAndProducts, 'debitOrCreditCard', total)
				if (response?.data) {
					// await placeOrderPopup()
					setIsLoading(false)
					MySwal.fire({
						customClass: {
							container: 'my-custom-swal'
						},
						showCloseButton: true,
						denyButtonText: 'Your order is placed.',
						imageUrl: '/images/ThankYouGreen.png'
					}).then(() => {
						dispatch(clearCart('0'))
						_navigate('/products')
					})
				} else {
					setIsLoading(false)
					if (response?.message?.raw?.message) {
						toastError(response?.message?.raw?.message)
					} else if (!response?.success) {
						toastError(response?.message)
					}
				}
			}
		} catch (error) {
			setIsLoading(false)
		}
	}

	const paymentElementOptions: any = {
		layout: 'tabs',
		billingDetails: true,
		hidePostalCode: true
	}

	return (
		<div className=" xl:w-1/2 lg:w-1/2 sm:w-full mt-4 ">
			{isLoading && <Loader visible={isLoading} />}

			<form id="payment-form" onSubmit={handleSubmit} className={'m-1'}>
				{/* <PaymentElement id="payment-element" options={paymentElementOptions} /> */}
				<CardElement options={paymentElementOptions} />

				<Spacer height={2} />
				{message && <div id="payment-message">{message}</div>}
			</form>

			<Flexed direction="row" gap={2} margin="1rem 0rem 0rem 0rem">
				<Button
					medium
					hasBorder
					type="clear"
					label="Edit Order"
					width="100%"
					ifClicked={() => {
						dispatch(editCartBeforeCheckout(true))
						_navigate('/cart')
					}}
				/>
				<Button
					medium
					label="Place Order"
					width="100%"
					ifClicked={(e) => {
						if (cart?.products?.some((res) => !res?.user?.stripe_account_verified)) {
							toastError(`It seams some seller not accept online payments, so remove it's products from cart or do cash on delivery`)
						} else {
							handleSubmit(e)
						}
					}}
				/>
			</Flexed>
		</div>
	)
}
