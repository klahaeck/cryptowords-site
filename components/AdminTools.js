import { useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import useAdminData from '../hooks/useAdminData';
import {
  ListGroup,
  Button,
  ButtonToolbar
} from 'react-bootstrap';
import useContract from '../hooks/useContract';
import SetDefaultPrice from './SetDefaultPrice';
import SetCutomPriceByWord from './SetCutomPriceByWord';
import DiscountedMembers from './DiscountedMembers';

const AdminTools = () => {
  const { totalSupply, paused, defaultPrice, discountPercentage, balance } = useAdminData();

  const contract = useContract();
  const { state: statePause, send: pause } = useContractFunction(contract, 'pause');
  const { state: stateUnpaused, send: unpause } = useContractFunction(contract, 'unpause');
  const { state: stateRelease, send: release } = useContractFunction(contract, 'release');

  const handleTogglePause = () => paused ? unpause() : pause();
  const handlePayout = () => release();
  
  return (
    <>
      <ListGroup variant="flush" className="mb-3">
        <ListGroup.Item>Paused: <b>{paused.toString()}</b></ListGroup.Item>
        <ListGroup.Item>Total Words: <b>{totalSupply}</b></ListGroup.Item>
        <ListGroup.Item>Default Price: <b>{utils.formatEther(defaultPrice)}</b></ListGroup.Item>
        <ListGroup.Item>Discount: <b>{discountPercentage * .01}%</b></ListGroup.Item>
        <ListGroup.Item>Current Balance: <b>{utils.formatEther(balance)}</b></ListGroup.Item>
      </ListGroup>
      
      <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
        <Button onClick={() => handleTogglePause()} disabled={statePause.status === 'Mining'}>{paused ? 'Unpause' : 'Pause'}</Button>{' '}
        <Button onClick={() => handlePayout()} disabled={balance <= 0 || stateRelease.status === 'Mining'}>Payout</Button>
      </ButtonToolbar>
      <hr className="dropdown-divider" />
      <SetDefaultPrice className="mb-4" />
      <SetCutomPriceByWord className="mb-4" />
      <DiscountedMembers className="mb-4" />
    </>
  );
};

export default AdminTools;