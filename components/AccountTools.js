import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  hideModal,
} from '../store/root/reducer';
import {
  Row,
  Col,
  Button
} from 'react-bootstrap';

const AccountTools = ({ hideModal }) => {
  const { account, deactivate } = useEthers();

  useEffect(() => {
    if (!account) hideModal();
  }, [account])

  const handleClickToCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    alert('Address copied');
  };

  return (
    <>
      <Row>
        <Col>
          <a role="button" onClick={() => handleClickToCopy(account)}><i className="bi bi-files"></i> Copy Address</a>
        </Col>
        <Col>
          <a href={`https://etherscan.io/address/${account}`} target="_blank" rel="noreferrer"><i className="bi bi-box-arrow-up-right"></i> View on Etherscan</a>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-end">
          <Button variant="outline-secondary" size="sm" onClick={() => deactivate()}>Disconnect</Button>
        </Col>
      </Row>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: bindActionCreators(hideModal, dispatch),
});

export default connect(null, mapDispatchToProps)(AccountTools);
