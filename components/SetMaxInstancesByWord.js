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
import useAdminData from '../hooks/useAdminData';
import useCustomMaxInstances from '../hooks/useCustomMaxInstances';

const SetMaxInstancesByWord = ({ className }) => {
  const [ toDelete, setToDelete ] = useState('');
  const { handleSubmit, control, getValues, formState: { errors }, reset } = useForm();

  const { maxInstances } = useAdminData();
  const customMaxInstances = useCustomMaxInstances();

  const contract = useContract();
  const { state, send } = useContractFunction(contract, 'setMaxInstancesByWord');

  const onSubmit = data => send(slugify(data.word), data.maxInstances);

  const handleRemoveCustomMaxInstances = (word) => {
    setToDelete(word);
    send(word, 0);
  }

  useEffect(() => {
    if (state.status === 'Success' && toDelete !== '') {
      fetch('/api/custom/max-instances', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chainId,
          word: toDelete
        })
      })
        // .then((res) => res.json())
        .then(() => {
          // console.log(data);
          setToDelete('');
        })
        .catch(error => console.error(error));
    } else if (state.status === 'Success') {
      fetch('/api/custom/max-instances', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chainId,
          word: slugify(getValues('word')),
          maxInstances: getValues('maxInstances'),
        })
      })
        // .then((res) => res.json())
        .then(() => {
          // console.log(data);
          reset({word: '', maxInstances});
        })
        .catch(error => console.error(error));
    }
  }, [state]);

  return (
    <>
      {customMaxInstances && customMaxInstances.length > 0 && <div className="">
        <h5>Custom Max Instances:</h5>
        <ListGroup variant="flush" className="mb-1">
          {customPrices.map((cmi, index) => (
            <ListGroup.Item key={index} as="li" className="d-flex justify-content-between align-items-start">
              <div className="w-75 text-truncate">{cmi.word} - {cmi.maxInstances}</div>
              <Button variant="danger" size="sm" onClick={() => handleRemoveCustomMaxInstances(slugify(cmi.word))} disabled={state.status === 'Mining'}>X</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>}
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
    </>
  );
};

export default SetMaxInstancesByWord;