import startCase from 'lodash/startCase';
import {
  Button,
  Card,
  Spinner
} from 'react-bootstrap';

const FullLoading = ({ search, className }) => {
  return (
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
};

export default FullLoading;