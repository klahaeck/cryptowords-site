import startCase from 'lodash/startCase';
import {
  Button,
  Card,
} from 'react-bootstrap';

const FullError = ({ search, className, onCloseClick }) => {
  return (
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
};

export default FullError;