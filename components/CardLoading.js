import {
  Card,
} from 'react-bootstrap';

const CardLoading = (props) => {
  const { word } = props;
  return (
    <Card bg="dark" text="light" className="rounded-0">
      <div className="ratio ratio-1x1">
        <Card.Img variant="top" width="100%" src={'https://via.placeholder.com/1200x1200?text=Searching...'} alt="Searching" className="rounded-0" />
      </div>
      <Card.Body>
        {/* <Card.Title tag="h5">{word.word}</Card.Title> */}
        {/* <Card.Subtitle tag="h6" className="mb-2 text-muted">Card subtitle</Card.Subtitle> */}
        {/* <Card.Text>{word.description}</Card.Text> */}
        <Card.Text>
          <small>Searching for {word.name}</small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default CardLoading;