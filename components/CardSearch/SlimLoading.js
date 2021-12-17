// import startCase from 'lodash/startCase';
import {
  Button,
  Card,
} from 'react-bootstrap';

const SlimLoading = ({ search }) => {
  return (
    <Card bg="light" text="dark">
      <Card.Body className="p-0 d-flex align-items-center">
        <p className="h6 m-0 me-auto p-0">{search.name}</p>
        <Button variant="outline-dark" size="sm" disabled={true} className="text-uppercase">Loading</Button>
      </Card.Body>
    </Card>
  );
};

export default SlimLoading;