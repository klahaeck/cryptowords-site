import { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
// import { utils } from 'ethers';
import { useEthers, useContractFunction } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  showModal,
  addToast,
} from '../store/root/reducer';
import startCase from 'lodash/startCase';
import usePrice from '../hooks/usePrice';
import useWordExists from '../hooks/useWordExists';
import useContract from '../hooks/useContract';
import useAdminData from '../hooks/useAdminData';
import {
  Button,
  Card,
} from 'react-bootstrap';
import CardSearch from './CardSearch';

const CardSearchSlim = (props) => {
  const { search, onCloseClick, showModal, addToast } = props;

  const { account } = useEthers();

  const { paused } = useAdminData();
  const price = usePrice(account, search.name);
  const wordExists = useWordExists(search.name);
  const contract = useContract();

  const { state, send } = useContractFunction(contract, 'purchaseWord');
  
  const { data, error } = useSWR(search.name ? `/api/token/${search.name}` : null, fetcher);
  
  const purchaseWord = (searchName) => send(account, searchName, { value: price });

  useEffect(() => {
    switch(state.status) {
      case 'Mining':
        addToast({bg:'primary', header:'CryptoWords', body:<p>The word <b>{search.name}</b> is minting.</p>});
        break;
      case 'Success':
        addToast({bg:'primary', header:'CryptoWords', body:<p>The word <b>{search.name}</b> has been minted to your wallet.</p>});
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
        {price && wordExists && <b><s>{utils.formatEther(price)} ETH</s></b>}
        {price && !wordExists && <b>{utils.formatEther(price)} ETH</b>} */}
        <p className="h6 m-0 me-auto text-truncate">{wordExists ? <s>{startCase(search.name)}</s> : startCase(search.name)}</p>

        <Button variant="link" size="sm" disabled={!account || paused || wordExists || state.status === 'Mining'} onClick={() => purchaseWord(search.name)} className="outline-0 shadow-none py-0 px-2"><i className="fs-5 bi bi-coin"></i></Button>
        <Button variant="link"  className="outline-0 shadow-none py-0 px-2" onClick={() => handleClickExpand()}><i className="bi bi-arrows-angle-expand"></i></Button>
        <Button variant="link" className="outline-0 shadow-none py-0 px-2" onClick={() => onCloseClick(search.name)}><i className="fs-5 bi bi-x-lg"></i></Button>
      </Card.Body>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: bindActionCreators(showModal, dispatch),
  addToast: bindActionCreators(addToast, dispatch),
});

export default connect(null, mapDispatchToProps)(CardSearchSlim);