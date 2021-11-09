import { useContractFunction } from '@usedapp/core';
// import { utils } from 'ethers';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Form,
  InputGroup
} from 'react-bootstrap';
import useContract from '../hooks/useContract';
import useAdminData from '../hooks/useAdminData';

const SetDiscountPercentage = ({ className }) => {
  const { handleSubmit, setError, control, formState: { errors }, reset } = useForm();

  const { discountPercentage } = useAdminData();

  const contract = useContract();
  const { state, send } = useContractFunction(contract, 'setDiscountPercentage');

  const onSubmit = data => {
    if (data.discountPercentage === discountPercentage * .01) {
      setError('discountPercentage', {
        type: 'manual',
        message: 'This is already the discount percentage',
      });
    } else {
      send(data.discountPercentage * 100);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={className}>
      <Form.Group>
        <Form.Label htmlFor="word">
          Set Discount Percentage
        </Form.Label>
        <InputGroup>
          <Controller
            name="discountPercentage"
            control={control}
            defaultValue={() => discountPercentage * .01}
            rules={{
              required: true
              // pattern: /^[A-Za-z]+$/
            }}
            render={({ field }) => <Form.Control {...field} disabled={state.status === 'Mining'} placeholder="Percentage" />}
          />
          <Button color="primary" type="submit" disabled={state.status === 'Mining'}>Save</Button>
        </InputGroup>
        {errors.discountPercentage?.type === 'required' && <small className="form-text text-danger">A percentage is required</small>}
        {errors.discountPercentage?.type === 'manual' && <small className="form-text text-danger">{errors.discountPercentage?.message}</small>}
      </Form.Group>
    </Form>
  );
};

export default SetDiscountPercentage;