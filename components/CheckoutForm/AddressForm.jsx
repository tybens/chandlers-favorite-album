import React, {useState} from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import SelectUSState from 'react-select-us-states';

import FormInput from './FormInput';

const AddressForm = ({ next }) => {
  const [stateCode, setStateCode] = useState(null)
  const methods = useForm();

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((data) =>
            next({
              ...data,
              stateCode,
            })
          )}>
          <Grid container spacing={3}>
            <FormInput required name="firstName" label="First name" />
            <FormInput required name="lastName" label="Last name" />
            <FormInput required name="email" label="Email" />
            <FormInput required name="address1" label="Address line 1" />
            <FormInput required name="city" label="City" />
            <Grid item xs={12} sm={6}><SelectUSState className="w-full h-full border-b border-gray-500 text-base text-gray-600 pt-3" onChange={setStateCode} /></Grid>
          </Grid>
          <Grid container spacing={12}>
            <FormInput required name="zip" label="Zip / Postal code" />
          </Grid>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="submit" variant="contained" color="primary">
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
