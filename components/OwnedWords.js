import { useEthers } from '@usedapp/core';
// import useOwnedWords from '../hooks/useOwnedWords';
import {
  Row,
  Col,
} from 'react-bootstrap';
import CardWord from './CardWord';

const OwnedWords = ({ className }) => {
  const { account } = useEthers();
  // const ownedWords = useOwnedWords(account);
  // const ownedWords = [];

  return (
    <div className={className}>
      <Row className="">
        <Col>
          <h5 className="text-uppercase">Your Words</h5>
        </Col>
      </Row>
      <Row className="g-1">
        {/* {ownedWords.map((word, index) => (
          <Col key={index} xs="12" sm="8" md="6" lg="4" xl="3">
            <CardWord word={word} tools={true} />
          </Col>
        ))} */}
      </Row>
    </div>    
  );
};

export default OwnedWords;