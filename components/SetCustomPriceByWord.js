import { useState, useEffect } from 'react';
import { useEthers, useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import { useForm, Controller } from 'react-hook-form';
import slugify from 'slugify';
import {
  Button,
  Form,
  InputGroup,
  ListGroup
} from 'react-bootstrap';
import useContract from '../hooks/useContract';
import useAdminData from '../hooks/useAdminData';
import useCurrency from '../hooks/useCurrency';
import useCustomPrices from '../hooks/useCustomPrices';

const SetCutomPriceByWord = ({ className }) => {
  const { chainId } = useEthers();
  const [ toDelete, setToDelete ] = useState('');
  const currency = useCurrency();
  const customPrices = useCustomPrices();
  const { handleSubmit, control, getValues, formState: { errors }, reset } = useForm();

  const { defaultPrice } = useAdminData();

  const contract = useContract();
  const { state: stateSet, send: sendSet } = useContractFunction(contract, 'setCustomPriceByWord');
  const { state: stateDelete, send: sendDelete } = useContractFunction(contract, 'deleteCustomPriceByWord');

  const onSubmit = data => sendSet(slugify(data.word), utils.parseUnits(data.price));

  const handleRemoveCustomPrice = (word) => {
    setToDelete(word);
    sendDelete(word);
  }

  useEffect(() => {
    if (stateSet.status === 'Success') {
      fetch('/api/custom/price', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chainId,
          word: slugify(getValues('word')),
          price: getValues('price'),
        })
      })
        // .then((res) => res.json())
        .then(() => {
          // console.log(data);
          reset({word: '', price: utils.formatEther(defaultPrice)});
        })
        .catch(error => console.error(error));
    }
  }, [stateSet]);

  useEffect(() => {
    if (stateDelete.status === 'Success') {
      fetch('/api/custom/price', {
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
    }
  }, [stateDelete]);

  return (
    <>
      {customPrices && customPrices.length > 0 && <div className="">
        <h5>Custom Prices:</h5>
        <ListGroup variant="flush" className="mb-1">
          {customPrices.map((cp, index) => (
            <ListGroup.Item key={index} as="li" className="d-flex justify-content-between align-items-start">
              <div className="w-75 text-truncate">{cp.word} - {cp.price}</div>
              <Button variant="danger" size="sm" onClick={() => handleRemoveCustomPrice(slugify(cp.word))} disabled={stateDelete.status === 'Mining'}>X</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>}
      <Form onSubmit={handleSubmit(onSubmit)} className={className}>
        {defaultPrice && <Form.Group>
          <Form.Label htmlFor="word">
            Set Custom Price by Word ({currency})
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
              render={({ field }) => <Form.Control {...field} disabled={stateSet.status === 'Mining'} placeholder="Word" />}
            />
            <Controller
              name="price"
              control={control}
              defaultValue={() => utils.formatEther(defaultPrice)}
              rules={{
                required: true
                // pattern: /^[A-Za-z]+$/
              }}
              render={({ field }) => <Form.Control {...field} disabled={stateSet.status === 'Mining'} placeholder={`Price in ${currency}`} />}
            />
            <Button color="primary" type="submit" disabled={stateSet.status === 'Mining'}>Save</Button>
          </InputGroup>
          {errors.word?.type === 'required' && <small className="form-text text-danger">A word is required</small>}
          {errors.price?.type === 'required' && <small className="form-text text-danger">A price in {currency} is required</small>}
        </Form.Group>}
      </Form>
    </>
  );
};

export default SetCutomPriceByWord;