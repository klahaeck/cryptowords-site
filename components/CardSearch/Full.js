import { useEthers } from '@usedapp/core';
import { utils } from 'ethers';
import useHasRole from '../../hooks/useHasRole';
import useAdminData from '../../hooks/useAdminData';
import usePrice from '../../hooks/usePrice';
import useWordAvailable from '../../hooks/useWordAvailable';
import useInstancesAvailable from '../../hooks/useInstancesAvailable';
import useCurrency from '../../hooks/useCurrency';
import {
  Row,
  Col,
  Button,
  Card,
} from 'react-bootstrap';

const Full = ({ search, data, className, onCloseClick, handleClickExpand, purchaseWord }) => {
  const { account } = useEthers();

  const isDiscountedUser = useHasRole('DISCOUNTED_ROLE', account);
  const isMinter = useHasRole('MINTER_ROLE', account);
  const { discountPercentage, discountPercentageGlobal, paused } = useAdminData();
  const price = usePrice(account, search.slug);
  const wordAvailable = useWordAvailable(search.slug);
  const instancesAvailable = useInstancesAvailable(search.slug);
  const currency = useCurrency();

  const getFullPrice = (_price, _discountPercentage) => utils.formatEther(`${Number(_price) / (1 - (_discountPercentage / 100)).toFixed(2)}`);

  return (
    <Card bg="dark" text="light" className={className}>
      {onCloseClick && <Card.Header className="p-0 text-end">
        <Button variant="link"  className="outline-0 shadow-none py-0 px-2" onClick={() => handleClickExpand()}><i className="bi bi-arrows-angle-expand"></i></Button>
        <Button variant="link" className="outline-0 shadow-none py-0 px-2" onClick={() => onCloseClick(search.slug)}><i className="bi bi-x-lg"></i></Button>
      </Card.Header>}
      
      <div className="ratio ratio-1x1">
        <Card.Img variant="top" width="100%" src={data.image} alt={data.name} />
      </div>

      <Card.Footer>
        {!account && <Card.Text className="text-center m-0 text-primary">Connect your wallet to purchase</Card.Text>}

        {account && <Row className="align-items-center">
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
            {((account && wordAvailable) || isMinter) && <Button variant={!wordAvailable ? 'outline-primary' : 'primary'} size="sm" disabled={paused || search.status === 'mining'} onClick={() => purchaseWord(search.slug)} className="text-uppercase">{search.status === 'mining' ? <div className="d-flex align-items-center"><Spinner animation="border" variant="dark" size="sm" className="me-1" />Minting</div> : 'Purchase'}</Button>}
          </Col>
        </Row>}
      </Card.Footer>
    </Card>
  );
};

export default Full;