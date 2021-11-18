import { useEffect, useRef } from 'react';
import useRecentWords from '../hooks/useRecentWords';
import {
  Row,
  Col,
} from 'react-bootstrap';
import { gsap } from 'gsap';

const RecentMinted = ({ className }) => {
  const recentWords = useRecentWords(10);
  const tickerWrapper = useRef(null);
  const tickerList = useRef(null);
  const tlCarousel = useRef(gsap.timeline({ repeat: -1 }));

  useEffect(() => {
    const duration = tickerList.current.offsetWidth * .01;
    tlCarousel.current.to('.ticker-list', { x: '-100%', duration, ease: 'linear'}, 'start');
  }, []);

  const handleWordClick = (word) => {
    console.log(word);
  };

  return (
    <div className={`bg-dark text-primary p-3 ${className}`}>
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
                {recentWords.map((word, idx) => <span key={idx}>...<a href="#" className="text-decoration-none text-hover-underline" onClick={(event) => { event.preventDefault(); handleWordClick(word);}}>{word}</a></span>)}
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RecentMinted;