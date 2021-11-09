import useSWR from 'swr';
import fetcher from '../lib/fetcher';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showModal } from '../store/root/reducer';
import {
  Card,
} from 'react-bootstrap';

const CardWord = (props) => {
  const { word, showModal } = props;

  const { data, error } = useSWR(word ? `/api/token/${word}` : null, fetcher);

  if (error) return (
    <Card bg="secondary" text="light" className="rounded-0">
      <div className="ratio ratio-1x1">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <div className="p-2">
            <p className="h3">{word}</p>
            <p className="h5">{WORD_NOT_FOUND}</p>
          </div>
        </div>
      </div>
    </Card>
  );
  if (!data) return (
    <Card bg="light" text="dark" className="rounded-0">
      <div className="ratio ratio-1x1">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <div className="p-2">
            <p className="h5">Loading</p>
            <p className="h2">{word}</p>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Card role="button" bg="secondary" text="light" className="rounded-0" onClick={() => showModal({body:<Card.Img variant="top" width="100%" src={data.image} alt={data.name} />})}>
      <div className="ratio ratio-1x1">
        <Card.Img variant="top" width="100%" src={data.image} alt={data.name} className="rounded-0" />
      </div>
    </Card>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: bindActionCreators(showModal, dispatch),
});

export default connect(null, mapDispatchToProps)(CardWord);