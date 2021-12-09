import { useEffect, useRef } from 'react';
import { useEthers, useTokenBalance, useToken } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import useContract from '../hooks/useContract';
import startCase from 'lodash/startCase';
import {
  showModal,
} from '../store/root/reducer';
// import useRecentWords from '../hooks/useRecentWords';
import {
  Row,
  Col,
} from 'react-bootstrap';
import { gsap } from 'gsap';
import CardWord from './CardWord';

const RecentMinted = ({ showModal, className }) => {
  const { account, library } = useEthers();
  const CONTRACT_ADDRESS = '0xf01465Ca3e08514163cA66536705E79aFa731C82';
  const wordBalance = useTokenBalance(CONTRACT_ADDRESS, account);
  const wordInfo = useToken(CONTRACT_ADDRESS);
  console.log(wordInfo.toString());
  // console.log(library);
  // const recentWords = useRecentWords(10);
  const contract = useContract();
  
  const recentWords = [];
  const tickerWrapper = useRef(null);
  const tickerList = useRef(null);
  const tlCarousel = useRef(gsap.timeline({ repeat: -1 }));

  useEffect(() => {
    // async function init() {
    //   if (contract) {
    //     // console.log(contract);
    //     const eventFilter = contract.filters.WordMinted();
    //     // console.log(eventFilter);
    //     console.log(library);
    //     const events = await library.provider.queryFilter(eventFilter);
    //     console.log(events);
    //   }
    // }
    // init();
    // console.log(events);

    if (library) {
      library.on('WordMinted', (error, event) => {
        console.log(event);
      });
    }
  }, [library]);

  // useEffect(() => {
  //   const duration = tickerList.current.offsetWidth * .015;
  //   tlCarousel.current.to('.ticker-list', { x: '-100%', duration, ease: 'linear'}, 'start');
  // }, []);

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
          {recentWords.length > 0 && <div ref={tickerWrapper} className="ticker-wrapper overflow-hidden d-flex">
            {Array(3).fill().map((item, index) => (
              <div key={index} ref={tickerList} className="ticker-list">
                {recentWords.map((word, idx) => <span key={idx}>...<a href="#" className="text-decoration-none text-hover-underline" onClick={(event) => { event.preventDefault(); handleWordClick(word);}}>{startCase(word)}</a></span>)}
              </div>
            ))}
          </div>}
        </Col>
      </Row>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: bindActionCreators(showModal, dispatch),
});

export default connect(null, mapDispatchToProps)(RecentMinted);
