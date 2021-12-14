import { useState, useEffect } from 'react';
import { useEthers, useContractFunction, shortenAddress } from '@usedapp/core';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
} from 'react-bootstrap';
import useContract from '../hooks/useContract';
import useRoleMembers from '../hooks/useRoleMembers';

const Minters = ({ className }) => {
  const { chainId } = useEthers();
  const [ toDelete, setToDelete ] = useState('');
  const [ minterRole, minterMembers ] = useRoleMembers('MINTER_ROLE');
  const { handleSubmit, control, getValues, formState: { errors }, reset } = useForm();

  const contract = useContract();
  const { state: stateGrantRole, send: sendGrantRole } = useContractFunction(contract, 'grantRole');
  const { state: stateRevokeRole, send: sendRevokeRole } = useContractFunction(contract, 'revokeRole');

  const onSubmit = data => sendGrantRole(minterRole.toString(), data.address.toString());
  const handleRevokeRole = (address) => {
    setToDelete(address);
    sendRevokeRole(minterRole.toString(), address.toString());
  };

  useEffect(() => {
    if (stateGrantRole.status === 'Success') {
      fetch('/api/roles/minter', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chainId,
          address: getValues('address')
        })
      })
        // .then((res) => res.json())
        .then(() => {
          // console.log(data);
          reset({address: ''});
        })
        .catch(error => console.error(error));
    }
  }, [stateGrantRole]);

  useEffect(() => {
    if (stateRevokeRole.status === 'Success') {
      fetch('/api/roles/minter', {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chainId,
          address: toDelete
        })
      })
        // .then((res) => res.json())
        .then(() => {
          // console.log(data);
          setToDelete('');
        })
        .catch(error => console.error(error));
    }
  }, [stateRevokeRole]);

  return (
    <div className={className}>
      <h5>Minters</h5>
      {minterMembers && <div className="">
        <ListGroup variant="flush" className="mb-1">
          {minterMembers.map((member, index) => (
            <ListGroup.Item key={index} as="li" className="d-flex justify-content-between align-items-start">
              <div className="w-75 text-truncate">{member?.address && shortenAddress(member.address)}</div>
              <Button variant="danger" size="sm" onClick={() => handleRevokeRole(member.address)} disabled={stateRevokeRole.status === 'Mining'}>X</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label htmlFor="address" className="visually-hidden" >
            Grant Role
          </Form.Label>
          <InputGroup>
            <Controller
              name="address"
              control={control}
              defaultValue=''
              rules={{
                required: true
                // pattern: /^[A-Za-z]+$/
              }}
              render={({ field }) => <Form.Control {...field} placeholder="Address" disabled={stateGrantRole.status === 'Mining'} />}
            />
            <Button color="primary" type="submit" disabled={stateGrantRole.status === 'Mining'}>Add</Button>
          </InputGroup>
          {errors.address?.type === 'required' && <small className="form-text text-danger">An address is required</small>}
        </Form.Group>
      </Form>
    </div>
  );
};

export default Minters;