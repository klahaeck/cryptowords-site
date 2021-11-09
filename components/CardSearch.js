import { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { utils } from 'ethers';
import { useEthers, useContractFunction } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  addToast,
  addAlert,
} from '../store/root/reducer';
import usePrice from '../hooks/usePrice';
import useWordExists from '../hooks/useWordExists';
import useContract from '../hooks/useContract';
import useHasRole from '../hooks/useHasRole';
import useAdminData from '../hooks/useAdminData';
import {
  Button,
  Card,
} from 'react-bootstrap';
import { WORD_NOT_FOUND, WORD_MINTING, PURCHASE_SUCCESS } from '../data/text';

const CardSearch = (props) => {
  const { search, onCloseClick, addToast, addAlert } = props;

  const { activateBrowserWallet, account } = useEthers();

  const connectWallet = () => activateBrowserWallet();

  const hasDiscount = useHasRole('DISCOUNTED_ROLE', account);
  const { discountPercentage } = useAdminData();
  const price = usePrice(account, search.name);
  const wordExists = useWordExists(search.name);
  const contract = useContract();

  const { state, send } = useContractFunction(contract, 'purchaseWord');
  
  const { data, error } = useSWR(search.name ? `/api/token/${search.name}` : null, fetcher);
  
  const purchaseWord = (searchName) => send(account, searchName, { value: price });

  useEffect(() => {
    switch(state) {
      case state.status === 'Mining':
        addToast({bg:'light', header:'CryptoWords', body:WORD_MINTING});
        break;
      case state.status === 'Success':
        addToast({bg:'light', header:'CryptoWords', body:PURCHASE_SUCCESS});
        break;
    }
  }, [state]);

  if (error) return (
    <Card bg="secondary" text="light" className="rounded-0">
      <div className="ratio ratio-1x1">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <div className="p-2 text-center">
            <p className="h3">{search.name}</p>
            <p className="h5">{WORD_NOT_FOUND}</p>
          </div>
        </div>
      </div>
    </Card>
  );
  if (!data) return (
    <Card bg="light" text="dark" className="rounded-0">
      <div className="ratio ratio-1x1">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <div className="p-2 text-center">
            <p className="h5">Loading</p>
            <p className="h2">{search.name}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  const getFullPrice = (_price, _discountPercentage) => utils.formatEther(`${Number(_price) / (1 - (_discountPercentage / 10000)).toFixed(2)}`);

  return (
    <Card text="light" className="">
      {onCloseClick && <Card.Header className="p-0 text-end">
        <Button variant="transparent"  className="outline-0 shadow-none" onClick={() => onCloseClick(search.name)}><i className="bi bi-x-lg"></i></Button>
      </Card.Header>}
      
      <div className="ratio ratio-1x1">
        <Card.Img variant="top" width="100%" src={data.image} alt={data.name} />
      </div>
      <Card.Body className="bg-light border-top">
        {!account && <Button variant="primary" onClick={connectWallet}>Connect your wallet to purchase</Button>}
        {account && !wordExists && hasDiscount && price && discountPercentage && <Card.Text className="mb-1"><s>Purchase for {getFullPrice(price, discountPercentage)} ETH</s></Card.Text>}
        {/* {account && <Card.Text className="mb-1">Price {price && utils.formatEther(price)} ETH</Card.Text>} */}
        {account && <Button className="float-right" size="md" disabled={wordExists || state.status === 'Mining'} onClick={() => purchaseWord(search.name)}>{wordExists ? 'Not Available' : `Purchase${price ? ' for ' + utils.formatEther(price) + ' ETH' : ''}`}</Button>}
      </Card.Body>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addToast: bindActionCreators(addToast, dispatch),
  addAlert: bindActionCreators(addAlert, dispatch),
});

export default connect(null, mapDispatchToProps)(CardSearch);