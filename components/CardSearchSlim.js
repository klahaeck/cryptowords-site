import { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
// import { utils } from 'ethers';
import { useEthers, useContractFunction, useNotifications } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setCardStatus,
  showModal,
  addToast,
  addAlert,
} from '../store/root/reducer';
import startCase from 'lodash/startCase';
import usePrice from '../hooks/usePrice';
import useWordAvailable from '../hooks/useWordAvailable';
import useContract from '../hooks/useContract';
import useAdminData from '../hooks/useAdminData';
import {
  Button,
  Card,
} from 'react-bootstrap';
import CardSearch from './CardSearch';

const CardSearchSlim = (props) => {
  const { search, onCloseClick, setCardStatus, showModal, addAlert, addToast } = props;

  const { account } = useEthers();

  const { notifications } = useNotifications();

  const { paused } = useAdminData();
  const price = usePrice(account, search.name);
  const wordAvailable = useWordAvailable(search.name);
  const contract = useContract();

  const { state, send } = useContractFunction(contract, 'purchaseWord');
  
  const { data, error } = useSWR(search.name ? `/api/token/${search.name}` : null, fetcher);
  
  const purchaseWord = (searchName) => {
    if (account) {
      send(account, searchName, { value: price });
    } else {
      addAlert({position: 'global', color: 'primary', msg:'You must connect your wallet to purchase a word'});
    }
  };

  useEffect(() => {
    const purchaseSuccess = notifications.filter(n => n.type === 'transactionSucceed' && n.transaction.nonce === search.nonce);
    if (purchaseSuccess.length > 0) {
      if (search.status === 'mining') {
        addToast({bg:'primary', header:'CryptoWords', body:<p>The word <b>{search.name}</b> has been minted to your wallet.</p>});
        setCardStatus({ name: search.name, status: null });
      }
    }
  }, [notifications]);

  useEffect(() => {
    switch(state.status) {
      case 'Mining':
        setCardStatus({ name: search.name, nonce: state.transaction.nonce, status: 'mining' });
        addToast({bg:'primary', header:'CryptoWords', body:<p>The word <b>{search.name}</b> is minting.</p>});
        break;
      // case 'Success':
      //   setCardStatus({name: search.name, status: ''});
      //   addToast({bg:'primary', header:'CryptoWords', body:<p>The word <b>{search.name}</b> has been minted to your wallet.</p>});
      //   break;
      case 'Exception':
        setCardStatus({name: search.name, status: ''});
        // console.error(state.errorMessage);
        // console.log(state.errorMessage.includes('insufficient funds'));
        if (state.errorMessage.includes('insufficient funds')) {
          showModal({size:'lg', header: 'Insufficient funds', body:<>
            <p>There is not enough {currency} in your wallet to make this purchase including the gas fee.</p>
            {chainId === ChainId.Polygon && <p>If you need to transfer funds from the Ethereum mainnet to Polygon, you can use the <a href="https://wallet.polygon.technology/bridge" target="_blank" rel="noreferrer" className="color-polygon"><b>Polygon Bridge</b></a></p>}
          </>});
        }
        break;
    }
  }, [state]);

  const handleClickExpand = () => showModal({body:<CardSearch search={{name:data.name}} />});

  if (error) return (
    <Card bg="danger" text="light">
      <Card.Body className="py-0 pe-0 d-flex align-items-center">
        <p className="h6 m-0 me-auto p-0"><s>{search.name}</s></p>
        {onCloseClick && <Button variant="link" className="outline-0 shadow-none py-0 px-2 text-light" onClick={() => onCloseClick(search.name)}><i className="fs-5 bi bi-x-lg"></i></Button>}
      </Card.Body>
    </Card>
  );
  if (!data) return (
    <Card bg="light" text="dark">
      <Card.Body className="p-0 d-flex align-items-center">
        <p className="h6 m-0 me-auto p-0">{search.name}</p>
        <Button variant="outline-dark" size="sm" disabled={true} className="text-uppercase">Loading</Button>
      </Card.Body>
    </Card>
  );

  // const getFullPrice = (_price, _discountPercentage) => utils.formatEther(`${Number(_price) / (1 - (_discountPercentage / 10000)).toFixed(2)}`);

  return (
    <Card bg="dark" text="light">
      <Card.Body className="py-1 ps-2 pe-0 d-flex align-items-center">
        {/* {price && discountPercentage && hasDiscount && <><s>{getFullPrice(price, discountPercentage)} ETH</s><br /></>}
        {price && wordAvailable && <b><s>{utils.formatEther(price)} ETH</s></b>}
        {price && !wordAvailable && <b>{utils.formatEther(price)} ETH</b>} */}
        <p className="h6 m-0 me-auto text-truncate">{!wordAvailable ? <s>{startCase(search.name)}</s> : startCase(search.name)}</p>

        <Button variant="link" size="sm" disabled={paused || !wordAvailable || search.status === 'mining'} onClick={() => purchaseWord(search.name)} className="outline-0 shadow-none py-0 px-2"><i className="fs-5 bi bi-coin"></i></Button>
        <Button variant="link"  className="outline-0 shadow-none py-0 px-2" onClick={() => handleClickExpand()}><i className="bi bi-arrows-angle-expand"></i></Button>
        <Button variant="link" className="outline-0 shadow-none py-0 px-2" onClick={() => onCloseClick(search.name)}><i className="fs-5 bi bi-x-lg"></i></Button>
      </Card.Body>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCardStatus: bindActionCreators(setCardStatus, dispatch),
  showModal: bindActionCreators(showModal, dispatch),
  addToast: bindActionCreators(addToast, dispatch),
  addAlert: bindActionCreators(addAlert, dispatch)
});

export default connect(null, mapDispatchToProps)(CardSearchSlim);