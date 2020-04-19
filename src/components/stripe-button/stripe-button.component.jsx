import React from 'react';
import StripeCheckout from 'react-stripe-checkout';

const StripCheckoutButton = ({price}) => {
    const priceForStripe = price * 100;
    const publishableKey = 'pk_live_bSMNMt656GpE0CMgtHPzHFp2';

    const onToken = token => {
        console.log(token);
        alert('Payment Successful');
    }


    return (
        <StripeCheckout
        label='Pay Now'
        name='V- CART'
        billingAddress
        shippingAddress
        image='https://svgshare.com/i/CUz.svg'
        description={`Your total is $${price}`}
        amount={priceForStripe}
        panelLabel='Pay Now'
        token={onToken}
        stripeKey={publishableKey}
        />
    );
}

export default StripCheckoutButton;