import { useWeb3React } from '@web3-react/core';
import {
  Row,
  Col
} from 'react-bootstrap';

const Header = () => {
  const { active } = useWeb3React();

  return (
    <>
      <h1 className="text-center">Crypto Words</h1>
      <h2 className="text-center mb-5">Own the english language,<br />one word at a time.</h2>
      
      {active && <Row className="justify-content-center">
        <Col md="8" lg="6">
          <p className="text-center">There is only one instance of each word.<br />Once a word is purchased, it is no longer available.</p>
        </Col>
      </Row>}
    </>
  );
};

export default Header;