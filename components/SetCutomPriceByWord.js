import { useEffect } from 'react';
import { useEthers, useContractFunction, ChainId } from '@usedapp/core';
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
  const { chainId } = useEthers();
  const { handleSubmit, control, formState: { errors }, reset } = useForm();

  const { defaultPrice } = useAdminData();

  const contract = useContract();
  const { state, send } = useContractFunction(contract, 'setCustomPriceByWord');

  const onSubmit = data => send(data.word.trim().toLowerCase(), utils.parseUnits(data.price));

  useEffect(() => {
    if (state.status === 'Success') reset({word: '', price: utils.formatEther(defaultPrice)});
  }, [state]);

  const getCurrency = () => {
    return chainId === ChainId.Polygon || chainId === ChainId.Mumbai ? 'MATIC' : 'ETH';
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={className}>
      <Form.Group>
        <Form.Label htmlFor="word">
          Set Custom Price by Word ({getCurrency()})
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
            render={({ field }) => <Form.Control {...field} disabled={state.status === 'Mining'} placeholder="Word" />}
          />
          <Controller
            name="price"
            control={control}
            defaultValue={() => utils.formatEther(defaultPrice)}
            rules={{
              required: true
              // pattern: /^[A-Za-z]+$/
            }}
            render={({ field }) => <Form.Control {...field} disabled={state.status === 'Mining'} placeholder={`Price in ${getCurrency()}`} />}
          />
          <Button color="primary" type="submit" disabled={state.status === 'Mining'}>Save</Button>
        </InputGroup>
        {errors.word?.type === 'required' && <small className="form-text text-danger">A word is required</small>}
        {errors.price?.type === 'required' && <small className="form-text text-danger">A price in {getCurrency()} is required</small>}
      </Form.Group>
    </Form>
  );
};

export default SetCutomPriceByWord;