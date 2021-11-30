import { useEffect } from 'react';
import { useContractFunction } from '@usedapp/core';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Form,
  InputGroup
} from 'react-bootstrap';
import useContract from '../hooks/useContract';
import useAdminData from '../hooks/useAdminData';

const SetMaxInstancesByWord = ({ className }) => {
  const { handleSubmit, control, formState: { errors }, reset } = useForm();

  const { maxInstances } = useAdminData();

  const contract = useContract();
  const { state, send } = useContractFunction(contract, 'setMaxInstancesByWord');

  const onSubmit = data => send(data.word.trim().toLowerCase(), data.maxInstances);

  useEffect(() => {
    if (state.status === 'Success') reset({word: '', maxInstances:maxInstances});
  }, [state]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className={className}>
      <Form.Group>
        <Form.Label htmlFor="word">
          Set Max Instances by Word
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
        {errors.word?.type === 'required' && <small className="form-text text-danger">A word is required</small>}
        {errors.maxInstances?.type === 'required' && <small className="form-text text-danger">A number is required</small>}
      </Form.Group>
    </Form>
  );
};

export default SetMaxInstancesByWord;