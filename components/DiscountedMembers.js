import { useEffect } from 'react';
import { useContractFunction } from '@usedapp/core';
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Form,
  InputGroup,
  ListGroup,
  CloseButton
} from 'react-bootstrap';
import useContract from '../hooks/useContract';
import useRoleMembers from '../hooks/useRoleMembers';

const DiscountedMembers = ({ className }) => {
  const [ discountedRole, discountedMembers ] = useRoleMembers('DISCOUNTED_ROLE');
  const { handleSubmit, control, formState: { errors }, reset } = useForm();

  const contract = useContract();
  const { state: stateGrantRole, send: sendGrantRole } = useContractFunction(contract, 'grantRole');
  const { state: stateRevokeRole, send: sendRevokeRole } = useContractFunction(contract, 'revokeRole');

  const onSubmit = data => sendGrantRole(discountedRole.toString(), data.address.toString());
  const handleRevokeRole = (member) => sendRevokeRole(discountedRole.toString(), member.toString());

  useEffect(() => {
    if (stateGrantRole.status === 'Success') reset({address: ''});
  }, [stateGrantRole]);

  return (
    <div className={className}>
      <h5>Discounted Members</h5>
      {discountedMembers && <div className="">
        <ListGroup variant="flush" className="mb-3">
          {discountedMembers.map((member, index) => (
            <ListGroup.Item key={index} as="li" className="d-flex justify-content-between align-items-start">
              <div className="w-75 text-truncate">{member}</div>
              <Button variant="danger" size="sm" onClick={() => handleRevokeRole(member)} disabled={stateRevokeRole.status === 'Mining'}>X</Button>
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
              render={({ field }) => <Form.Control {...field} disabled={stateGrantRole.status === 'Mining'} />}
            />
            <Button color="primary" type="submit" disabled={stateGrantRole.status === 'Mining'}>Add</Button>
          </InputGroup>
          {errors.address?.type === 'required' && <small className="form-text text-danger">An address is required</small>}
        </Form.Group>
      </Form>
    </div>
  );
};

export default DiscountedMembers;