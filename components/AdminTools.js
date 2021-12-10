import { useContractFunction } from '@usedapp/core';
import { utils } from 'ethers';
import useAdminData from '../hooks/useAdminData';
import {
  ListGroup,
  Button,
  ButtonToolbar
} from 'react-bootstrap';
import useContract from '../hooks/useContract';
import SetMaxInstances from './SetMaxInstances';
import SetMaxInstancesByWord from './SetMaxInstancesByWord';
import SetDefaultPrice from './SetDefaultPrice';
import SetDiscountPercentage from './SetDiscountPercentage';
import SetDiscountPercentageGlobal from './SetDiscountPercentageGlobal';
import SetCutomPriceByWord from './SetCutomPriceByWord';
import DiscountedMembers from './DiscountedMembers';
import Minters from './Minters';

const AdminTools = () => {
  const { totalSupply, paused, maxInstances, defaultPrice, discountPercentage, discountPercentageGlobal, balance } = useAdminData();

  const contract = useContract();
  const { state: statePause, send: pause } = useContractFunction(contract, 'pause');
  const { state: stateUnpaused, send: unpause } = useContractFunction(contract, 'unpause');
  const { state: stateRelease, send: release } = useContractFunction(contract, 'release');

  const handleTogglePause = () => paused ? unpause() : pause();
  const handlePayout = () => release();
  
  return (
    <>
      <ListGroup variant="flush" className="mb-3">
        <ListGroup.Item className="ps-0">Paused: <b>{paused.toString()}</b></ListGroup.Item>
        <ListGroup.Item className="ps-0">Total Words: <b>{totalSupply}</b></ListGroup.Item>
        <ListGroup.Item className="ps-0">Max Instances: <b>{maxInstances}</b></ListGroup.Item>
        <ListGroup.Item className="ps-0">Default Price: <b>{utils.formatEther(defaultPrice)}</b></ListGroup.Item>
        <ListGroup.Item className="ps-0">Global Discount: <b>{discountPercentageGlobal}%</b></ListGroup.Item>
        <ListGroup.Item className="ps-0">Discount: <b>{discountPercentage}%</b></ListGroup.Item>
        <ListGroup.Item className="ps-0">Current Balance: <b>{utils.formatEther(balance)}</b></ListGroup.Item>
      </ListGroup>
      
      <ButtonToolbar className="mb-3" aria-label="Toolbar with Button groups">
        <Button onClick={() => handleTogglePause()} disabled={statePause.status === 'Mining'}>{paused ? 'Unpause' : 'Pause'}</Button>{' '}
        <Button onClick={() => handlePayout()} disabled={balance <= 0 || stateRelease.status === 'Mining'}>Payout</Button>
      </ButtonToolbar>
      <hr className="dropdown-divider" />
      <SetMaxInstances className="mb-4" />
      <SetMaxInstancesByWord className="mb-4" />
      <SetDefaultPrice className="mb-4" />
      <SetCutomPriceByWord className="mb-4" />
      <SetDiscountPercentageGlobal className="mb-4" />
      <SetDiscountPercentage className="mb-4" />
      <DiscountedMembers className="mb-4" />
      <Minters className="mb-4" />
    </>
  );
};

export default AdminTools;