import {
  Button,
  Card,
} from 'react-bootstrap';

const CardLocal = ({ word, purchaseWord, price, status = false }) => {
  return (
    <Card bg="dark" text="light" className="rounded-0">
      <div className="ratio ratio-1x1">
        <Card.Img variant="top" width="100%" src={word.image} alt={word.name} className="rounded-0" />
      </div>
      {status && <Card.Body>
        {/* <Card.Title tag="h5">{word.word}</Card.Title> */}
        {/* <Card.Subtitle tag="h6" className="mb-2 text-muted">Card subtitle</Card.Subtitle> */}
        {/* <Card.Text>{word.description}</Card.Text> */}
        {!word.exists &&
          <Card.Text>
            <small>Price {price} ETH</small><br />
            <Button className="float-right" size="sm" block disabled={word.exists} onClick={() => purchaseWord(word)}>Purchase</Button>
          </Card.Text>
        }
        {word.exists &&
          <Card.Text>This NFT has already been purchased</Card.Text>
        }
      </Card.Body>}
    </Card>
  );
};

export default CardLocal;