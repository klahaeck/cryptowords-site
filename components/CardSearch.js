import { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { utils } from 'ethers';
import { useEthers, useContractFunction } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  showModal,
  addToast,
  // addAlert,
} from '../store/root/reducer';
import usePrice from '../hooks/usePrice';
import useWordExists from '../hooks/useWordExists';
import useContract from '../hooks/useContract';
import useHasRole from '../hooks/useHasRole';
import useAdminData from '../hooks/useAdminData';
import {
  Row,
  Col,
  Button,
  Card,
} from 'react-bootstrap';

const CardSearch = (props) => {
  const { search, onCloseClick, showModal, addToast, className } = props;

  const { account } = useEthers();

  const hasDiscount = useHasRole('DISCOUNTED_ROLE', account);
  const { discountPercentage, paused } = useAdminData();
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
              <p className="h3">{search.name}</p>
              <p className="h5">Sorry, we cannot find this word.</p>
            </div>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="text-end">
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
              <p className="h5">Loading</p>
              <p className="h2">{search.name}</p>
            </div>
          </div>
        </div>
      </Card.Body>
      <Card.Footer className="text-end">
        <Button variant="outline-dark" size="sm" disabled={true} className="text-uppercase">Loading</Button>
      </Card.Footer>
    </Card>
  );

  const getFullPrice = (_price, _discountPercentage) => utils.formatEther(`${Number(_price) / (1 - (_discountPercentage / 10000)).toFixed(2)}`);

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
        {!account && <Card.Text className="text-center">Connect your wallet to purchase</Card.Text>}

        <Row className="align-items-center">
          <Col xs="auto">
            <Card.Text>
              {price && discountPercentage && hasDiscount && <><s>{getFullPrice(price, discountPercentage)} ETH</s><br /></>}
              {price && wordExists && <b><s>{utils.formatEther(price)} ETH</s></b>}
              {price && !wordExists && <b>{utils.formatEther(price)} ETH</b>}
            </Card.Text>
          </Col>
          <Col className="text-end pe-1 ">
            {account && wordExists && <Button variant="outline-primary" size="sm" disabled={true} className="text-uppercase">Not Available</Button>}
            {account && !wordExists && <Button variant={wordExists ? 'outline-primary' : 'primary'} size="sm" disabled={paused || state.status === 'Mining'} onClick={() => purchaseWord(search.name)} className="text-uppercase">{state.status === 'Mining' ? 'Minting' : 'Purchase'}</Button>}
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: bindActionCreators(showModal, dispatch),
  addToast: bindActionCreators(addToast, dispatch),
  // addAlert: bindActionCreators(addAlert, dispatch),
});

export default connect(null, mapDispatchToProps)(CardSearch);