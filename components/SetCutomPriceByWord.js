import { useEffect } from 'react';
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

const SetCutomPriceByWord = ({ className }) => {
  const { handleSubmit, control, formState: { errors }, reset } = useForm();

  const { defaultPrice } = useAdminData();

  const contract = useContract();
  const { state, send } = useContractFunction(contract, 'setCustomPriceByWord');

  const onSubmit = data => {
    console.log(data.word.toLowerCase(), utils.parseUnits(data.price).toString());
    send(data.word.toLowerCase(), utils.parseUnits(data.price));
  };

  useEffect(() => {
    if (state.status === 'Success') reset({word: '', price:''});
  }, [state]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={className}>
      <Form.Group>
        <Form.Label htmlFor="word">
          Set Custom Price by Word (ETH)
        </Form.Label>
        <InputGroup>
          <Controller
            name="word"
            control={control}
            defaultValue=''
            rules={{
              required: true
              // pattern: /^[A-Za-z]+$/
            }}
            render={({ field }) => <Form.Control {...field} disabled={state.status === 'Mining'} />}
          />
          <Controller
            name="price"
            control={control}
            defaultValue={() => utils.formatEther(defaultPrice)}
            rules={{
              required: true
              // pattern: /^[A-Za-z]+$/
            }}
            render={({ field }) => <Form.Control {...field} disabled={state.status === 'Mining'} />}
          />
          <Button color="primary" type="submit" disabled={state.status === 'Mining'}>Save</Button>
        </InputGroup>
        {errors.word?.type === 'required' && <small className="form-text text-danger">A word is required</small>}
        {errors.price?.type === 'required' && <small className="form-text text-danger">A price in ETH is required</small>}
      </Form.Group>
    </Form>
  );
};

export default SetCutomPriceByWord;