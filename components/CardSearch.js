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
import {
  Button,
  Card,
} from 'react-bootstrap';
import { WORD_NOT_FOUND, WORD_MINTING, PURCHASE_SUCCESS } from '../data/text';

const CardSearch = (props) => {
  const { search, addToast, addAlert } = props;

  const { activateBrowserWallet, account } = useEthers();

  const connectWallet = () => activateBrowserWallet();

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
          <div className="p-2">
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
          <div className="p-2">
            <p className="h5">Loading</p>
            <p className="h2">{search.name}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Card bg="dark" text="light" className="rounded-0">
      <div className="ratio ratio-1x1">
        <Card.Img variant="top" width="100%" src={data.image} alt={data.name} className="rounded-0" />
      </div>
      <Card.Body>
        {!account && <Button variant="primary" onClick={connectWallet}>Connect your wallet to purchase</Button>}
        {account && <Card.Text className="mb-1">Price {price && utils.formatEther(price)} ETH</Card.Text>}
        {account && <Button className="float-right" size="sm" disabled={wordExists || state.status === 'Mining'} onClick={() => purchaseWord(search.name)}>{wordExists ? 'Not Available' : 'Purchase'}</Button>}
      </Card.Body>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addToast: bindActionCreators(addToast, dispatch),
  addAlert: bindActionCreators(addAlert, dispatch),
});

export default connect(null, mapDispatchToProps)(CardSearch);