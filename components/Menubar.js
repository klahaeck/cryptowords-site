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
import useAdminData from '../hooks/useAdminData';
import AdminTools from './AdminTools';
import WalletConnectors from './WalletConnectors';
import AccountDisplay from './AccountDisplay';
import AccountTools from './AccountTools';

const Menubar = (props) => {
  const { showModal } = props;

  const { discountPercentage, paused } = useAdminData();

  const { account } = useEthers();
  const hasDiscount = useHasRole('DISCOUNTED_ROLE', account);
  const isAdmin = useHasRole('DEFAULT_ADMIN_ROLE', account);

  const connectWallet = () => showModal({ body: <WalletConnectors /> });

  const handleWalletInfo = () => showModal({
    header: <AccountDisplay avatarSize={24} />,
    body: <AccountTools />,
    size:'md'
  });

  return (
    <>
      {paused && <div className="p-0 m-0 bg-warning text-dark text-center">
        <p className="h5 p-2 m-0">All purchases are currently paused.</p>
      </div>}
      {account && hasDiscount && <div className="p-0 m-0 bg-success text-light text-center">
        <p className="h4 p-2 m-0">You have a {discountPercentage * .01}% discount!</p>
      </div>}
      <Navbar bg="dark" expand={false} variant="dark">
        <Container>
          <Navbar.Brand href="/" className="me-auto">
            <span className="d-md-none">CW</span>
            <span className="d-none d-md-block">CryptoWords</span>
          </Navbar.Brand>
          {!account && <Button variant="primary" onClick={connectWallet}>Connect your wallet</Button>}
          {account && <Button onClick={handleWalletInfo}><AccountDisplay /></Button>}
          
          {account && isAdmin && <Navbar.Toggle aria-controls="offcanvasNavbar" className="ms-3" />}
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