import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import startCase from 'lodash/startCase';
import {
  showModal,
} from '../store/root/reducer';
import useRecentWords from '../hooks/useRecentWords';
import {
  Row,
  Col,
} from 'react-bootstrap';
import { gsap } from 'gsap';
import CardWord from './CardWord';

const RecentMinted = ({ showModal, className }) => {
  const recentWords = useRecentWords(15);
  
  const tickerWrapper = useRef(null);
  const tickerList = useRef(null);
  const tlCarousel = useRef(gsap.timeline({ repeat: -1 }));

  useEffect(() => {
    if (recentWords && recentWords.length > 0) {
      const duration = tickerList.current.offsetWidth * .025;
      tlCarousel.current.to('.ticker-list', { x: '-100%', duration, ease: 'linear'}, 'start');
    }
  }, [recentWords]);

  const handleWordClick = (word) => showModal({body:<CardWord word={word} />})

  return (
    <div className={`bg-dark text-primary py-3 ${className || ''}`}>
      <Row className="align-items-center">
        <Col md="4">
          <div className="d-flex justify-content-center align-items-center mb-2 mb-md-0">
            <h6 className="m-0 text-md-end fw-light text-uppercase w-100">Recently<span className="d-none d-md-inline"><br /></span><span className="d-inline d-md-none"> </span>Purchased</h6>
            <span className="d-none d-md-block ms-2">:</span>
          </div>
        </Col>
        <Col md="20" className="fs-4 fw-lighter d-flex">
          <div ref={tickerWrapper} className="ticker-wrapper overflow-hidden d-flex">
            {Array(3).fill().map((item, index) => (
              <div key={index} ref={tickerList} className="ticker-list">
                {recentWords && recentWords.length > 0 && recentWords.map((recentWord, idx) => <span key={idx}>...<a href="#" className="text-decoration-none text-hover-underline" onClick={(event) => { event.preventDefault(); handleWordClick(recentWord);}}>{startCase(recentWord)}</a></span>)}
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: bindActionCreators(showModal, dispatch),
});

export default connect(null, mapDispatchToProps)(RecentMinted);
