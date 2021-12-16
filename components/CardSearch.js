import { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { utils } from 'ethers';
import { useEthers, useContractFunction, useNotifications, useTransactions, ChainId } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import startCase from 'lodash/startCase';
import {
  setCardStatus,
  showModal,
  addToast,
  addAlert,
} from '../store/root/reducer';
import usePrice from '../hooks/usePrice';
import useWordAvailable from '../hooks/useWordAvailable';
import useInstancesAvailable from '../hooks/useInstancesAvailable';
import useContract from '../hooks/useContract';
import useHasRole from '../hooks/useHasRole';
import useAdminData from '../hooks/useAdminData';
import useCurrency from '../hooks/useCurrency';
import {
  Row,
  Col,
  Button,
  Card,
  Spinner
} from 'react-bootstrap';

const CardSearch = (props) => {
  const { search, onCloseClick, setCardStatus, showModal, addAlert, addToast, className } = props;

  const { account, chainId } = useEthers();

  const { notifications } = useNotifications();
  // const { transactions } = useTransactions();

  const isDiscountedUser = useHasRole('DISCOUNTED_ROLE', account);
  const isMinter = useHasRole('MINTER_ROLE', account);
  const { discountPercentage, discountPercentageGlobal, paused } = useAdminData();
  const price = usePrice(account, search.name);
  const wordAvailable = useWordAvailable(search.name);
  const instancesAvailable = useInstancesAvailable(search.name);
  const contract = useContract();
  const currency = useCurrency();

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
      //   setCardStatus({name: search.name, status: null});
      //   addToast({bg:'primary', header:'CryptoWords', body:<p>The word <b>{search.name}</b> has been minted to your wallet.</p>});
      //   break;
      case 'Exception':
        setCardStatus({name: search.name, nonce: state.transaction.nonce, status: null});
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

  const handleClickExpand = () => {
    showModal({body:<Card.Img variant="top" width="100%" src={data.image} alt={data.name} />})
  };

  if (error) return (
    <Card bg="danger" text="light" className={className}>
      {onCloseClick && <Card.Header className="p-0 text-end">
        <Button variant="link" className="outline-0 shadow-none py-0 px-2 text-light" onClick={() => onCloseClick(search.name)}><i className="bi bi-x-lg"></i></Button>
      </Card.Header>}
      <Card.Body>
        <div className="ratio ratio-1x1">
          <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="p-2 text-center">
              <p className="h3">{startCase(search.name)}</p>
              <p className="h5">Sorry, we cannot find this word.</p>
            </div>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="text-end px-2">
        <Button variant="outline-light" size="sm" disabled={true} className="text-uppercase">Not Available</Button>
      </Card.Footer>
    </Card>
  );
  if (!data) return (
    <Card bg="light" text="dark" className={className}>
      <Card.Body>
        <div className="ratio ratio-1x1">
          <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="p-2 text-center">
              <div className="d-flex align-items-center mb-3">
                <Spinner animation="border" variant="dark" size="sm" className="me-1" />
                <p className="h5 p-0 m-0">loading</p>
              </div>
              <p className="h2">{startCase(search.name)}</p>
            </div>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="text-end px-2">
        <Button variant="outline-dark" size="sm" disabled={true} className="text-uppercase">Loading</Button>
      </Card.Footer>
    </Card>
  );

  const getFullPrice = (_price, _discountPercentage) => utils.formatEther(`${Number(_price) / (1 - (_discountPercentage / 100)).toFixed(2)}`);

  return (
    <Card bg="dark" text="light" className={className}>
      {onCloseClick && <Card.Header className="p-0 text-end">
        <Button variant="link"  className="outline-0 shadow-none py-0 px-2" onClick={() => handleClickExpand()}><i className="bi bi-arrows-angle-expand"></i></Button>
        <Button variant="link" className="outline-0 shadow-none py-0 px-2" onClick={() => onCloseClick(search.name)}><i className="bi bi-x-lg"></i></Button>
      </Card.Header>}
      
      <div className="ratio ratio-1x1">
        <Card.Img variant="top" width="100%" src={data.image} alt={data.name} />
      </div>

      <Card.Footer>
        {!account && <Card.Text className="text-center m-0 text-primary">Connect your wallet to purchase</Card.Text>}

        <Row className="align-items-center">
          <Col xs="auto">
            {/* <Card.Text> */}
              {price && isDiscountedUser && discountPercentage > 0 && <><s>{getFullPrice(price, discountPercentage)} ETH</s><br /></>}
              {price && !isDiscountedUser && !isMinter && discountPercentageGlobal > 0 && <><s>{getFullPrice(price, discountPercentageGlobal)} {currency}</s><br /></>}
              <div className="mb-n1">
                {price && !wordAvailable && <b><s>{utils.formatEther(price)} {currency}</s></b>}
                {price && wordAvailable && <b>{utils.formatEther(price)} {currency}</b>}
              </div>
              {wordAvailable && instancesAvailable && <small>{instancesAvailable.toString()} Available</small>}
            {/* </Card.Text> */}
          </Col>
          <Col className={`text-end ${!wordAvailable ? 'pe-1' : ''}`}>
            {(account && !wordAvailable && !isMinter) && <Button variant="outline-primary" size="sm" disabled={true} className="text-uppercase">Not Available</Button>}
            {((account && wordAvailable) || isMinter) && <Button variant={!wordAvailable ? 'outline-primary' : 'primary'} size="sm" disabled={paused || search.status === 'mining'} onClick={() => purchaseWord(search.name)} className="text-uppercase">{search.status === 'mining' ? <div className="d-flex align-items-center"><Spinner animation="border" variant="dark" size="sm" className="me-1" />Minting</div> : 'Purchase'}</Button>}
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setCardStatus: bindActionCreators(setCardStatus, dispatch),
  showModal: bindActionCreators(showModal, dispatch),
  addToast: bindActionCreators(addToast, dispatch),
  addAlert: bindActionCreators(addAlert, dispatch),
});

export default connect(null, mapDispatchToProps)(CardSearch);