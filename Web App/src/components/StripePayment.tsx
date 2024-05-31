import React from 'react'
import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import CheckoutForm from './common/CheckoutForm'

function Payment({sellersAndProducts}) {
	// 'pk_test_51Kb0ePDSjVZgUcZq85ofvzUaFW2Du9IxtoqVil8tEuxth5gFTQG5iygVpuypBIfHdG0giNU7nePTXiSdFQfIfhvQ001T6RfXl9'
	const stripePromise = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY && loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

	return (
		<Elements stripe={stripePromise || null}>
			<CheckoutForm sellersAndProducts={sellersAndProducts} />
		</Elements>
	)
}

export default Payment
