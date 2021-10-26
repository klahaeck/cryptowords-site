import {
  Button,
  Card,
} from 'react-bootstrap';
import {
  WORD_EXISTS
} from '../data/text';

const CardLocal = ({ word, purchaseWord, price, status = false }) => {
  return (
    <Card bg="dark" text="light" className="rounded-0">
      <div className="ratio ratio-1x1">
        <Card.Img variant="top" width="100%" src={word.image} alt={word.name} className="rounded-0" />
      </div>
      <Card.Body>
        {/* <Card.Title tag="h5">{word.word}</Card.Title> */}
        {/* <Card.Subtitle tag="h6" className="mb-2 text-muted">Card subtitle</Card.Subtitle> */}
        {/* <Card.Text>{word.description}</Card.Text> */}
        <Card.Text>
          {!word.exists &&<small>Price {price} ETH</small>}
          {word.exists && <small>{WORD_EXISTS}</small>}
          <br />
          {!word.exists && <Button className="float-right" size="sm" disabled={!status || word.exists} onClick={() => purchaseWord(word)}>Purchase</Button>}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CardLocal;