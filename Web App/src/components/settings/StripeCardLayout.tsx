import { useStripe, useElements, PaymentElement, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { addCard } from '../../apis/apis'
import Button from '../common/Button'
import styled from 'styled-components';
const StripeCardLayout = () => {

  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsProcessing(true);

    elements.submit();
    const result = await stripe.createPaymentMethod({
      elements
    });

    if (result.error) {
      setMessage(result.error.message as string);
    } else {
      console.log(result?.paymentMethod?.id);
      const res: any = await addCard(result?.paymentMethod?.id)
      if (res.success) { setMessage(res.message); }
      else { 
        setMessage(res.message.raw.message);
      }

    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement  />
      <Button  disabled={isProcessing || !stripe || !elements} id="submit"
						label={isProcessing ? "Processing ... " : "Save Card"}
						type="primary"
					></Button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
};

export default StripeCardLayout; 
