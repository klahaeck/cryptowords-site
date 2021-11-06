import { useEthers } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  addToast,
  addAlert,
  removeToast,
  removeAlert,
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
import ProfileTools from './ProfileTools';

const Menubar = (props) => {
  const { addToast, addAlert } = props;

  const connectWallet = () => activateBrowserWallet();
  const disconnectWallet = (event) => {
    event.preventDefault();
    console.log('disconnect');
  };

  const { discountPercentage } = useAdminData();

  const { activateBrowserWallet, account } = useEthers();
  const hasDiscount = useHasRole('DISCOUNTED_ROLE', account);
  const isAdmin = useHasRole('DEFAULT_ADMIN_ROLE', account);

  return (
    <>
      {account && hasDiscount && <div className="p-0 m-0 bg-success text-light text-center">
        <p className="h4 p-2 m-0">You have a {discountPercentage * .01}% discount!</p>
      </div>}
      <Navbar bg="dark" expand={false} variant="dark">
        <Container>
          <Navbar.Brand href="/" className="me-auto">CryptoWords</Navbar.Brand>
          {!account && <Button variant="primary" onClick={connectWallet}>Connect your wallet</Button>}
          {account && <Navbar.Text>
            {account} <a href="#" className="text-decoration-underline" onClick={disconnectWallet}>change</a>
          </Navbar.Text>}
          <Navbar.Toggle aria-controls="offcanvasNavbar" className="ms-3" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Admin</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              {isAdmin && <AdminTools />}
              <ProfileTools />
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addToast: bindActionCreators(addToast, dispatch),
  addAlert: bindActionCreators(addAlert, dispatch),
  removeToast: bindActionCreators(removeToast, dispatch),
  removeAlert: bindActionCreators(removeAlert, dispatch),
});

export default connect(null, mapDispatchToProps)(Menubar);