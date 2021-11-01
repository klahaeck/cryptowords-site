import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setBalance,
  setPaused,
  setDefaultPrice,
  setDiscountPercentage,
  addToast,
  addAlert,
  removeToast,
  removeAlert,
} from '../store/root/reducer';
import {
  Container,
  Navbar,
  Nav,
  Offcanvas,
  Button,
  Form,
  InputGroup
} from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';

const AdminNavbar = (props) => {
  const { contract, totalWords, paused, defaultPrice, discountPercentage, balance } = props;
  const { setPaused, setDefaultPrice, setDiscountPercentage, setBalance, addToast, addAlert } = props;

  const { account, library } = useWeb3React();

  const { handleSubmit, control, formState: { errors }, reset } = useForm();

  useEffect(() => {
    async function init() {
      setBalance(library.utils.fromWei(await library.eth.getBalance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS), 'ether'));
      setDefaultPrice(library.utils.fromWei(await contract.methods.defaultPrice().call(), 'ether'));
      setDiscountPercentage(await contract.methods.discountPercentage().call());
      setPaused( await contract.methods.paused().call());
    }
    contract && library ? init() : null;
  }, [contract, library, setBalance, setDefaultPrice, setDiscountPercentage, setPaused]);

  const handleTogglePause = () => {
    const thisPausedMethod = paused ? contract.methods.unpause() : contract.methods.pause();
    thisPausedMethod.send({from:account})
      .on('receipt', (receipt) => {
        setPaused(!paused);
        addToast({
          bg: 'success',
          header: 'Crypto Words',
          body: 'The pause state has been set'
        });
      })
      .catch(error => {
        console.error(error);
        addAlert({ color: 'danger', msg: error.message});
      });
  };

  const payoutHandler = () => {
    contract.methods.release(account).send({from:account})
      .then(async () => setBalance(web3.utils.fromWei(await web3.eth.getBalance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS), 'ether')))
      .catch(error => console.error(error));
  };

  const onSubmitSetPrice = async data => {
    contract.methods.setDefaultPrice(data.defaultPrice).send({from:account})
      .then(async () => {
        const thisPrice = w3.utils.fromWei(await c.methods.defaultPrice().call(), 'ether');
        setDefaultPrice(thisPrice);
      })
      .catch(error => console.error(error));
  };

  const grantDiscountedRoleHandler = async thisAddress => {
    const discountedRole = await contract.methods.DISCOUNTED_ROLE().call();
    // await contract.methods.grantRole(discountedRole, thisAddress).send({ from: account });
    const count = await contract.methods.getRoleMemberCount(discountedRole).call();
    // const member = await contract.methods.getRoleMember(discountedRole, 0).call();
    const members = [...Array(count)].map(async (item, index) => await contract.methods.getRoleMember(discountedRole, index).call());

    Promise.all(members).then(completed => console.log(completed));    
  }

  return (
    <Navbar bg="light" expand={false}>
      <Container>
        <Navbar.Brand href="/">Admin</Navbar.Brand>
        <Navbar.Text>{`Paused: ${paused}`}</Navbar.Text>
        <Navbar.Text>Total Words: {totalWords}</Navbar.Text>
        <Navbar.Text>Default Price: {defaultPrice}</Navbar.Text>
        <Navbar.Text>Discount: {discountPercentage * .01}%</Navbar.Text>
        <Navbar.Text>Current Balance: {balance}</Navbar.Text>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />          
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Config</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="ms-auto">
              <Nav.Item>
                <Button onClick={() => handleTogglePause()}>{`Paused: ${paused}`}</Button>
              </Nav.Item>
              <hr className="dropdown-divider" />
              <Nav.Item>
                <Button onClick={() => payoutHandler()} disabled={balance <= 0}>Payout</Button>
              </Nav.Item>
              <hr className="dropdown-divider" />
              <Nav.Item>
                <Button onClick={() => grantDiscountedRoleHandler('0x25843c62836730b206c8ff9357655f2B4a3398e1')}>Grant Discount Role</Button>
              </Nav.Item>
            </Nav>
            <Form onSubmit={handleSubmit(onSubmitSetPrice)}>
              <Form.Group>
                <Form.Label htmlFor="word" className="visually-hidden">
                  <i className="bi bi-arrow-clockwise"></i>
                  Set Price
                </Form.Label>
                <InputGroup>
                  <Controller
                    name="defaultPrice"
                    control={control}
                    defaultValue={defaultPrice}
                    rules={{
                      required: true
                      // pattern: /^[A-Za-z]+$/
                    }}
                    render={({ field }) => <Form.Control {...field} />}
                  />
                  <Button color="primary" type="submit">Set Default Price</Button>
                </InputGroup>
                {errors.price?.type === 'required' && <small className="form-text text-danger">A price is required</small>}
                {/* {errors.word?.type === 'pattern' && <small className="form-text text-danger">Must be a single word with no special characters or numbers</small>} */}
              </Form.Group>
            </Form>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

const mapStateToProps = (state) => ({
  contract: state.root.contract,
  totalWords: state.root.totalWords,
  paused: state.root.paused,
  defaultPrice: state.root.defaultPrice,
  discountPercentage: state.root.discountPercentage,
  balance: state.root.balance,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setBalance: bindActionCreators(setBalance, dispatch),
    setPaused: bindActionCreators(setPaused, dispatch),
    setDefaultPrice: bindActionCreators(setDefaultPrice, dispatch),
    setDiscountPercentage: bindActionCreators(setDiscountPercentage, dispatch),
    addToast: bindActionCreators(addToast, dispatch),
    addAlert: bindActionCreators(addAlert, dispatch),
    removeToast: bindActionCreators(removeToast, dispatch),
    removeAlert: bindActionCreators(removeAlert, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminNavbar);