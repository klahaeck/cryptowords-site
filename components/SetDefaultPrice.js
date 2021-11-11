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

const SetDefaultPrice = ({ className }) => {
  const { handleSubmit, setError, control, formState: { errors }, reset } = useForm();

  const { defaultPrice } = useAdminData();

  const contract = useContract();
  const { state, send } = useContractFunction(contract, 'setDefaultPrice');

  const onSubmit = data => {
    if (utils.formatUnits(utils.parseUnits(data.defaultPrice)) === defaultPrice) {
      setError('defaultPrice', {
        type: 'manual',
        message: 'This is already the default price',
      });
    } else {
      send(utils.formatUnits(utils.parseUnits(data.defaultPrice)));
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={className}>
      <Form.Group>
        <Form.Label htmlFor="word">
          Set Default Price (ETH)
        </Form.Label>
        <InputGroup>
          <Controller
            name="defaultPrice"
            control={control}
            defaultValue={() => utils.formatEther(defaultPrice)}
            rules={{
              required: true
              // pattern: /^[A-Za-z]+$/
            }}
            render={({ field }) => <Form.Control {...field} disabled={state.status === 'Mining'} placeholder="Price in ETH" />}
          />
          <Button color="primary" type="submit" disabled={state.status === 'Mining'}>Save</Button>
        </InputGroup>
        {errors.defaultPrice?.type === 'required' && <small className="form-text text-danger">A price in ETH is required</small>}
        {errors.defaultPrice?.type === 'manual' && <small className="form-text text-danger">{errors.defaultPrice?.message}</small>}
      </Form.Group>
    </Form>
  );
};

export default SetDefaultPrice;