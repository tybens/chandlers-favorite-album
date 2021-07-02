import React, { useState, useEffect } from 'react';
import { Typography, Button, Divider, CircularProgress } from '@material-ui/core';
import {
  Elements,
  CardElement,
  ElementsConsumer,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import useStyles from './styles';

const stripePromise = loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`);

const PaymentForm = ({ product, token, nextStep, backStep, shippingData }) => {
  console.log(process.env)

  return (
    <>
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: '20px 0' }}>
        Payment method
      </Typography>
      <Elements stripe={stripePromise}>
            <StripePayment
              product={product}
              token={token}
              nextStep={nextStep}
              backStep={backStep}
              shippingData={shippingData}
            />
      </Elements>
    </>
  );
};

const StripePayment = ({product, token, nextStep, backStep, shippingData}) => {
  const url = 'https://api.printful.com/store/products/213019495';

  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const classes = useStyles();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('api/stripesecret', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      });
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "orange",
        iconColor: "orange"
      }
    }
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : '');
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);

      // if payment succeed, create and fulfill order with printful
      // TODO: confirm: true
      let data = {
        update_existing: true,
        recipient: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          address1: shippingData.address1,
          city: shippingData.city,
          state_code: shippingData.stateCode,
          country_code: 'US',
          zip: shippingData.zip,
          email: shippingData.email,
        },
        items: [
          {
            sync_variant_id: product.id,
            quantity: 1,
            files: [
              {
                url: `https://chandlersfavorite.s3.us-east-2.amazonaws.com/${token}/swag.png`,
              },
            ],
          },
        ],
      };

      // server side create order
      fetch('/api/printful', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(
          (ref) => {
            // go to the confirmation page
            nextStep();
          },
          (error) => {
            console.log('[ERROR]', error);
          }
        );
    }
  };

  return (
    <form className={classes.paymentForm} onSubmit={handleSubmit}>
      <CardElement className={classes.cardElement} options={cardStyle} onChange={handleChange} />
      <br /> <br />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" onClick={backStep}>
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          className={(processing || disabled || succeeded) ? classes.disabled : ''}
          id="submit"
          color="primary">
          <span className={classes.buttonText}>
            {processing ? <CircularProgress className={classes.spinner} /> : 'Pay $15'}
          </span>
        </Button>
      </div>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className={classes.cardError} role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default PaymentForm;
