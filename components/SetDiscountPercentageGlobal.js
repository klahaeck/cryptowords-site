import { useContractFunction } from '@usedapp/core';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Form,
  InputGroup
} from 'react-bootstrap';
import useContract from '../hooks/useContract';
import useAdminData from '../hooks/useAdminData';

const SetDiscountPercentageGlobal = ({ className }) => {
  const { handleSubmit, setError, control, formState: { errors }, reset } = useForm();

  const { discountPercentageGlobal } = useAdminData();

  const contract = useContract();
  const { state, send } = useContractFunction(contract, 'setDiscountPercentageGlobal');

  const onSubmit = data => {
    if (data.discountPercentageGlobal === discountPercentageGlobal) {
      setError('discountPercentageGlobal', {
        type: 'manual',
        message: 'This is already the global discount percentage',
      });
    } else {
      send(data.discountPercentageGlobal);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={className}>
      <Form.Group>
        <Form.Label htmlFor="discountPercentageGlobal">
          Set Global Discount Percentage
        </Form.Label>
        <InputGroup>
          <Controller
            name="discountPercentageGlobal"
            control={control}
            defaultValue={discountPercentageGlobal}
            rules={{
              required: true
              // pattern: /^[A-Za-z]+$/
            }}
            render={({ field }) => <Form.Control {...field} disabled={state.status === 'Mining'} placeholder="Percentage" />}
          />
          <Button color="primary" type="submit" disabled={state.status === 'Mining'}>Save</Button>
        </InputGroup>
        {errors.discountPercentageGlobal?.type === 'required' && <small className="form-text text-danger">A percentage is required</small>}
        {errors.discountPercentageGlobal?.type === 'manual' && <small className="form-text text-danger">{errors.discountPercentageGlobal?.message}</small>}
      </Form.Group>
    </Form>
  );
};

export default SetDiscountPercentageGlobal;