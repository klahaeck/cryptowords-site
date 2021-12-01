import { useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Form,
  InputGroup
} from 'react-bootstrap';
import useContract from '../hooks/useContract';
import useAdminData from '../hooks/useAdminData';

const SetMaxInstances = ({ className }) => {
  const { handleSubmit, setError, control, formState: { errors }, reset } = useForm();

  const { maxInstances } = useAdminData();

  const contract = useContract();
  const { state, send } = useContractFunction(contract, 'setMaxInstances');

  const onSubmit = data => {
    if (data.maxInstances === maxInstances) {
      setError('maxInstances', {
        type: 'manual',
        message: 'This is already the max instances',
      });
    } else {
      send(data.maxInstances);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={className}>
      <Form.Group>
        <Form.Label htmlFor="maxInstances">
          Set Max Instances
        </Form.Label>
        <InputGroup>
          <Controller
            name="maxInstances"
            control={control}
            defaultValue={() => maxInstances}
            rules={{
              required: true
              // pattern: /^[A-Za-z]+$/
            }}
            render={({ field }) => <Form.Control {...field} disabled={state.status === 'Mining'} placeholder="Max Instances" />}
          />
          <Button color="primary" type="submit" disabled={state.status === 'Mining'}>Save</Button>
        </InputGroup>
        {errors.defaultPrice?.type === 'required' && <small className="form-text text-danger">A number is required</small>}
        {errors.defaultPrice?.type === 'manual' && <small className="form-text text-danger">{errors.maxInstances?.message}</small>}
      </Form.Group>
    </Form>
  );
};

export default SetMaxInstances;