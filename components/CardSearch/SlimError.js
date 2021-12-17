import startCase from 'lodash/startCase';
import {
  Button,
  Card,
} from 'react-bootstrap';

const SlimError = ({ search, onCloseClick }) => {
  return (
    <Card bg="danger" text="light">
      <Card.Body className="py-0 pe-0 d-flex align-items-center">
        <p className="h6 m-0 me-auto p-0"><s>{startCase(search.name)}</s></p>
        {onCloseClick && <Button variant="link" className="outline-0 shadow-none py-0 px-2 text-light" onClick={() => onCloseClick(search.slug)}><i className="fs-5 bi bi-x-lg"></i></Button>}
      </Card.Body>
    </Card>
  );
};

export default SlimError;