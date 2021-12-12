import { useEffect } from 'react';
import { useEthers, useEtherBalance, getExplorerAddressLink } from '@usedapp/core';
import { utils } from 'ethers';
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
import useCurrency from '../hooks/useCurrency';

const AccountTools = ({ hideModal }) => {
  const { account, deactivate } = useEthers();
  const etherBalance = useEtherBalance(account);
  const currency = useCurrency();

  useEffect(() => {
    if (!account) hideModal();
  }, [account])

  const handleClickToCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    alert('Address copied');
  };

  return (
    <>
      {etherBalance && <Row className="mb-3">
        <Col>
          <p className="m-0">Your wallet balance:</p>
          <p className="h3">{Number(utils.formatEther(etherBalance.toString())).toFixed(4)} {currency}</p>
        </Col>
      </Row>}
      <Row>
        <Col>
          <a role="button" onClick={() => handleClickToCopy(account)}><i className="bi bi-files"></i> Copy Address</a>
        </Col>
        <Col>
          <a href={getExplorerAddressLink(account, parseInt(process.env.NEXT_PUBLIC_CHAIN_ID))} target="_blank" rel="noreferrer" className="text-dark"><i className="bi bi-box-arrow-up-right"></i> View on Etherscan</a>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col className="text-end">
          <Button variant="outline-dark" size="sm" onClick={() => deactivate()}>Disconnect</Button>
        </Col>
      </Row>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: bindActionCreators(hideModal, dispatch),
});

export default connect(null, mapDispatchToProps)(AccountTools);
