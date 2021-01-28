import React, { useState, useEffect } from 'react';
import {
  CssBaseline,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from '@material-ui/core';

import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import useStyles from './styles';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({ token, selectedProduct, error, onClose }) => {
  const [product, setProduct] = useState(selectedProduct);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();
  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    setShippingData(data);
    nextStep();
  };

  let Confirmation = () =>
    shippingData.firstName ? (
      <>
        <div>
          <Typography variant="h5">
            Thank you for your purchase, {shippingData.firstName} {shippingData.lastName}!
          </Typography>
          <Divider className={classes.divider} />
          <Typography variant="subtitle2">
            You can expect an email receipt of your purchase as well as an email confirmation of
            your order's shipment.
          </Typography>
          <img
            onClick={onClose()}
            className="mx-auto"
            style={{ maxHeight: token ? '50vh' : '10vh' }}
            src={token ? `api/shirt?token=${token}` : '/images/loading.gif'}></img>
        </div>
        <br />
      </>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );

  if (error) {
    Confirmation = () => (
      <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
      </>
    );
  }

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm nextStep={nextStep} setShippingData={setShippingData} next={next} />
    ) : (
      <PaymentForm
        token={token}
        product={product}
        nextStep={nextStep}
        backStep={backStep}
        shippingData={shippingData}
      />
    );

  return (
    <>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : <Form />}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
