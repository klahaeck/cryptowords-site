import { useEthers } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  showModal,
} from '../store/root/reducer';
import {
  Container,
  Navbar,
  Button,
  Offcanvas,
} from 'react-bootstrap';
import useHasRole from '../hooks/useHasRole';
import AdminTools from './AdminTools';
import WalletConnectors from './WalletConnectors';
import AccountDisplay from './AccountDisplay';
import AccountTools from './AccountTools';

const Menubar = (props) => {
  const { showModal } = props;

  const { account } = useEthers();
  const isAdmin = useHasRole('DEFAULT_ADMIN_ROLE', account);

  const connectWallet = () => showModal({ body: <WalletConnectors /> });

  const handleWalletInfo = () => showModal({
    header: <AccountDisplay avatarSize={24} />,
    body: <AccountTools />,
    size:'md'
  });

  return (
    <>
      <Navbar bg="dark" expand={false} variant="dark">
        <Container>
          <Navbar.Brand href="/" className="me-auto">
            <span className="d-md-none text-primary">CW</span>
            <span className="d-none d-md-block text-primary">CryptoWords</span>
          </Navbar.Brand>
          {!account && <Button variant="primary" onClick={connectWallet}>Connect your wallet</Button>}
          {account && <Button variant="outline-primary" onClick={handleWalletInfo}><AccountDisplay /></Button>}
          
          {account && isAdmin && <Navbar.Toggle aria-controls="offcanvasNavbar" className="ms-3 border-primary outline-0 shadow-none"><i className="bi bi-list fs-3 text-primary"></i></Navbar.Toggle>}
          {account && isAdmin && <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Admin</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <AdminTools />
            </Offcanvas.Body>
          </Navbar.Offcanvas>}
        </Container>
      </Navbar>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: bindActionCreators(showModal, dispatch),
});

export default connect(null, mapDispatchToProps)(Menubar);