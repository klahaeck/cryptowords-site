import startCase from 'lodash/startCase';
import useWordAvailable from '../../hooks/useWordAvailable';
import useAdminData from '../../hooks/useAdminData';
import {
  Button,
  Card,
} from 'react-bootstrap';

const Slim = ({ search, handleClickExpand, onCloseClick, purchaseWord }) => {
  const { paused } = useAdminData();
  const wordAvailable = useWordAvailable(search.name);

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

export default Slim;