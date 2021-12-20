import { useState, useEffect } from 'react';
import { useContractFunction } from '@usedapp/core';
import { useForm, Controller } from 'react-hook-form';
import slugify from 'slugify';
import {
  Button,
  Form,
  InputGroup
} from 'react-bootstrap';
import useContract from '../hooks/useContract';

const GiftWords = ({ className }) => {
  const { handleSubmit, control, formState: { errors }, reset } = useForm();

  const contract = useContract();
  const { state: stateGift, send: sendGift } = useContractFunction(contract, 'giftWord');
  const onSubmit = data => sendGift([data.to], [slugify(data.word)]);

  useEffect(() => {
    if (stateGift.status === 'Success') {
      reset({to: '', word: ''});
    }
  }, [stateGift]);

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className={className}>
        <Form.Group>
          <Form.Label htmlFor="word">
            Gift a word
          </Form.Label>
          <InputGroup>
            <Controller
              name="to"
              control={control}
              defaultValue=''
              rules={{
                required: true
                // pattern: /^[A-Za-z]+$/
              }}
              render={({ field }) => <Form.Control {...field} disabled={stateGift.status === 'Mining'} placeholder="To" />}
            />
            <Controller
              name="word"
              control={control}
              defaultValue=''
              rules={{
                required: true
                // pattern: /^[A-Za-z]+$/
              }}
              render={({ field }) => <Form.Control {...field} disabled={stateGift.status === 'Mining'} placeholder="Word" />}
            />
            <Button color="primary" type="submit" disabled={stateGift.status === 'Mining'}>Save</Button>
          </InputGroup>
          {errors.to?.type === 'required' && <small className="form-text text-danger">An address is required</small>}
          {errors.word?.type === 'required' && <small className="form-text text-danger">A word is required</small>}
        </Form.Group>
      </Form>
    </>
  );
};

export default GiftWords;