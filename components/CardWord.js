import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showModal } from '../store/root/reducer';
import startCase from 'lodash/startCase';
import {
  Card,
  Button,
  Spinner
} from 'react-bootstrap';

const CardWord = (props) => {
  const { word, tools, showModal } = props;

  const { data, error } = useSWR(word ? `/api/token/${word}` : null, fetcher);

  if (error) return (
    <Card bg="danger" text="light">
      <div className="ratio ratio-1x1">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <div className="p-2">
            <p className="h3">{word}</p>
            <p className="h5">Sorry, we cannot find this word.</p>
          </div>
        </div>
      </div>
    </Card>
  );
  if (!data) return (
    <Card bg="light" text="dark">
      <div className="ratio ratio-1x1">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <div className="p-2">
            <div className="d-flex align-items-center mb-3">
              <Spinner animation="border" variant="dark" size="sm" className="me-1" />
              <p className="h5 p-0 m-0">loading</p>
            </div>
            <p className="h2">{startCase(word)}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  const handleOnClick = () => {
    showModal({body:<Card.Img variant="top" width="100%" src={data.image} alt={data.name} />})
  };

  return (
    <Card bg="dark" text="light">
      {tools && <Card.Header className="p-0 text-end">
        <Button variant="link"  className="outline-0 shadow-none py-0 px-2" onClick={() => handleOnClick()}><i className="bi bi-arrows-angle-expand"></i></Button>
      </Card.Header>}
      <div className="ratio ratio-1x1">
        <Card.Img role="button" variant="top" width="100%" src={data.image} alt={data.name} onClick={() => handleOnClick()} />
      </div>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: bindActionCreators(showModal, dispatch),
});

export default connect(null, mapDispatchToProps)(CardWord);