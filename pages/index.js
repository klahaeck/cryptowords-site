import { useEffect, useState } from 'react';
import Web3 from 'web3';
import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import { useForm, Controller } from 'react-hook-form';
import {
  Navbar,
  Nav,
  Offcanvas,
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Alert,
  ToastContainer,
  Toast,
  CloseButton
} from 'react-bootstrap';
import CardWord from '../components/CardWord';
import {
  WRONG_NETWORK,
  WORD_NOT_FOUND,
  WORD_EXISTS,
  WORD_MINTING,
  PURCHASE_SUCCESS
} from '../data/text';

const Home = () => {
  const [ web3, setWeb3 ] = useState(null);
  const [ address, setAddress ] = useState(null);
  const [ contract, setContract ] = useState(null);
  
  const [ metaMaskInstalled, setMetaMaskInstalled ] = useState(true);
  const [ network, setNetwork ] = useState('rinkeby');
  const [ isAdmin, setIsAdmin ] = useState(false);
  const [ searching, setSearching ] = useState(false);
  const [ totalWords, setTotalWords ] = useState(0);
  const [ paused, setPaused ] = useState(false);
  const [ defaultPrice, setDefaultPrice ] = useState();
  const [ discountPercentage, setDiscountPercentage ] = useState();
  const [ balance, setBalance ] = useState(0);
  const [ toasts, setToasts ] = useState([]);
  const [ alerts, setAlerts ] = useState([]);
  // const [ ownedWords, setOwnedWords ] = useState([]);
  const [ recentSearches, setRecentSearches ] = useState([]);
  const { handleSubmit, control, formState: { errors }, reset } = useForm();

  const handleAccountChange = (accounts) => setAddress(accounts[0]);
  const handleChainChanged = (_chainId) => window.location.reload();

  useEffect(() => {
    if (window.ethereum) {
      ethereum.request({ method: 'eth_requestAccounts' }).then(async (accounts) => {
        setAddress(accounts[0])

        const w3 = new Web3(ethereum);
        setWeb3(w3);
        
        const c = new w3.eth.Contract(CryptoWordsV1.abi, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
        setContract(c);
      }).catch((err) => console.log(err));

      ethereum.on('accountsChanged', handleAccountChange);
      ethereum.on('chainChanged', handleChainChanged);
    } else {
      console.error('Please install MetaMask');
      setMetaMaskInstalled(false);
    }    

    // return () => {
    //   if (window.ethereum) {
    //     ethereum.off('accountsChanged', handleAccountChange);
    //     ethereum.off('chainChanged', handleChainChanged);
    //   }
    // }
  }, []);

  const getPrice = async (word) => {
    return web3.utils.fromWei(await contract.methods.getPrice(address, word).call(), 'ether');
  }

  useEffect(() => {
    async function init() {
      const defaultAdminRole = await contract.methods.DEFAULT_ADMIN_ROLE().call();
      setIsAdmin(await contract.methods.hasRole(defaultAdminRole, address).call());
      setNetwork(await web3.eth.net.getNetworkType());
      setBalance(web3.utils.fromWei(await web3.eth.getBalance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS), 'ether'));
      setDefaultPrice(web3.utils.fromWei(await contract.methods.defaultPrice().call(), 'ether'));
      setDiscountPercentage(await contract.methods.discountPercentage().call());
      setTotalWords(await contract.methods.totalSupply().call());
      setPaused( await contract.methods.paused().call());
      const newRecentSearches = recentSearches.map(async search => ({ ...search, price: web3.utils.fromWei(await contract.methods.getPrice(address, search.name).call(), 'ether') }));
      Promise.all(newRecentSearches).then(completed => setRecentSearches(completed));
    }
    web3 && contract && address ? init() : null;
  }, [web3, contract, address]);

  const correctNetwork = async () => {
    const isCorrect = network === process.env.NEXT_PUBLIC_ETH_NETWORK;
    if (!isCorrect) {
      setAlerts([...alerts, {
        color: 'danger',
        msg: WRONG_NETWORK
      }]);
    }
    return isCorrect;
  }

  const onSubmitSearch = async data => {
    setSearching(true);

    const existingRecentSearch = recentSearches.filter(rs => rs.name === data.word.toLowerCase())[0];
    if (existingRecentSearch) {
      setRecentSearches([existingRecentSearch, ...recentSearches.filter(rs => rs.name !== existingRecentSearch.name)]);
      existingRecentSearch.exists = await contract.methods.wordExists(existingRecentSearch.slug).call();
    } else {
      setRecentSearches([{ name: data.word, status: false }, ...recentSearches]);
    }
    
    fetch(`/api/word/${data.word}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(WORD_NOT_FOUND);
          } else {
            throw new Error(res.statusText);
          }          
        }
        return res;
      })
      .then(res => res.json())
      .then(async data => {
        reset({ word: '' });
        data.status = true;
        try {
          data.exists = await contract.methods.wordExists(data.name).call();
          data.price = web3.utils.fromWei(await contract.methods.getPrice(address, data.name).call(), 'ether');
        } catch(error) {
          console.error(error);
        }
        
        setRecentSearches([data, ...recentSearches.filter(rs => rs.name !== data.name)]);
        setSearching(false);
      })
      .catch(error => {
        console.error(error);
        setSearching(false);
        setAlerts([...alerts, { color: 'danger', msg: error.message}]);
      });
  };

  const purchaseWord = async (word) => {
    const isCorrectNetwork = correctNetwork();
    if (isCorrectNetwork) {
      const wordExists = await contract.methods.wordExists(word.slug).call();
      const price = web3.utils.fromWei(await contract.methods.getPrice(address, word).call(), 'ether');
      if (wordExists) {
        setAlerts([...alerts, {
          color: 'danger',
          msg: WORD_EXISTS
        }]);
      } else {
        contract.methods.purchaseWord(address, word.slug)
          .send({ from: address, value: web3.utils.toWei(price, 'ether') })
          .on('transactionHash', function(hash) {
            setToasts([...toasts, {
              bg: 'light',
              header: 'Crypto Words',
              body: WORD_MINTING
            }]);
          })
          .on('receipt', async (receipt) => {
            const recentSearch = recentSearches.filter(rw => rw.name === word.name)[0];
            if (recentSearch) {
              try {
                recentSearch.exists = await contract.methods.wordExists(recentSearch.slug).call();
              } catch(error) {
                console.error(error);
              }
            }

            setToasts([...toasts, {
              bg: 'success',
              header: 'Crypto Words',
              body: PURCHASE_SUCCESS
            }]);

            if (isAdmin) {
              setTotalWords(await contract.methods.totalSupply().call());
            }
          })
          .catch(error => {
            console.error(error);
            setAlerts([...alerts, { color: 'danger', msg: error.message}]);
          });
      }
    }
  };

  const handleOnAlertClose = (index) => setAlerts(alerts.filter((a, i) => i !== index));
  const handleOnToastClose = (index) => setToasts(toasts.filter((t, i) => i !== index));

  const handleTogglePause = () => {
    const thisPausedMethod = paused ? contract.methods.unpause() : contract.methods.pause();
    thisPausedMethod.send({from:address})
      .on('receipt', (receipt) => {
        setPaused(!paused);
        setToasts([...toasts, {
          bg: 'success',
          header: 'Crypto Words',
          body: 'The pause state has been set'
        }]);
      })
      .catch(error => {
        console.error(error);
        setAlerts([...alerts, { color: 'danger', msg: error.message}]);
      });
  };

  const payoutHandler = () => {
    contract.methods.release(address).send({from:address})
      .then(async () => setBalance(web3.utils.fromWei(await web3.eth.getBalance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS), 'ether')))
      .catch(error => console.error(error));
  };

  const onSubmitSetPrice = async data => {
    console.log(data);
    contract.methods.setDefaultPrice(data.defaultPrice).send({from:address})
      .then(async () => {
        const thisPrice = w3.utils.fromWei(await c.methods.defaultPrice().call(), 'ether');
        setDefaultPrice(thisPrice);
      })
      .catch(error => console.error(error));
  };

  const grantDiscountedRoleHandler = async thisAddress => {
    const discountedRole = await contract.methods.DISCOUNTED_ROLE().call();
    // await contract.methods.grantRole(discountedRole, thisAddress).send({ from: address });
    const count = await contract.methods.getRoleMemberCount(discountedRole).call();
    // const member = await contract.methods.getRoleMember(discountedRole, 0).call();
    const members = [...Array(count)].map(async (item, index) => await contract.methods.getRoleMember(discountedRole, index).call());

    Promise.all(members).then(completed => console.log(completed));    
  }

  return (
    <>
      {isAdmin && <Navbar bg="light" expand={false}>
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
      </Navbar>}
      <Container className="my-3 my-md-5">
        {!metaMaskInstalled && <Alert variant="danger">Please install <Alert.Link href="metamask.io">MetaMask</Alert.Link> to use this site.</Alert>}
        {network !== 'rinkeby' && <Alert variant="danger"><div className="content" dangerouslySetInnerHTML={{__html: WRONG_NETWORK}}></div></Alert>}

        <ToastContainer className="p-3" position="top-end">
          {toasts.map((toast, index) => (
            <Toast key={index} bg={toast.bg} onClose={() => handleOnToastClose(index)}>
              <Toast.Header>
                <strong className="me-auto">{toast.header}</strong>
                {/* <small className="text-muted">just now</small> */}
              </Toast.Header>
              <Toast.Body>{toast.body}</Toast.Body>
            </Toast>
          ))}
        </ToastContainer>

        {alerts.map((alert, index) => <Alert key={index} variant={alert.color} onClose={() => handleOnAlertClose(index)} dismissible>{alert.msg}</Alert>)}

        <h1 className="text-center">Crypto Words</h1>
        <h2 className="text-center mb-5">Own the english language, one word at a time.</h2>
        
        <Row className="justify-content-center">
          <Col md="8" lg="6">
            <p className="text-center">There is only one instance of each word. Once a word is purchased, it is no longer available.</p>
            <p className="text-center">Use the field below to search for your word.</p>
          </Col>
        </Row>

        <Row className="justify-content-center mt-3 mb-5">
          <Col md="8" lg="6">
            <Form onSubmit={handleSubmit(onSubmitSearch)}>
              <Form.Group>
                <Form.Label htmlFor="word" className="visually-hidden">
                  <i className="bi bi-arrow-clockwise"></i>
                  Find Your Word
                </Form.Label>
                <InputGroup>
                  <Controller
                    name="word"
                    control={control}
                    defaultValue={''}
                    rules={{
                      required: true
                      // pattern: /^[A-Za-z]+$/
                    }}
                    render={({ field }) => <Form.Control {...field} />}
                  />
                  <Button color="primary" type="submit" disabled={searching}>Find Your Word</Button>
                </InputGroup>
                {errors.word?.type === 'required' && <small className="form-text text-danger">A word is required</small>}
                {/* {errors.word?.type === 'pattern' && <small className="form-text text-danger">Must be a single word with no special characters or numbers</small>} */}
              </Form.Group>
            </Form>
          </Col>
        </Row>

        <Row className="justify-content-center mb-5">
          <Col sm="12" md="8" lg="6">
            {recentSearches.length > 0 && <CardWord word={recentSearches[0]} purchaseWord={purchaseWord} status={recentSearches[0].status} />}
          </Col>
        </Row>
        
        {recentSearches.length > 1 && <>
          <Row className="justify-content-center">
            <Col>
              <p className="h4 text-center">Your recently searched words</p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            {recentSearches.filter((rw, index) => index > 0).map((word, idx) => (
              <Col key={idx} sm="6" md="4" lg="3" className="mb-3 mb-md-4">
                <div className="d-flex justify-content-end">
                  <CloseButton className="outline-none" onClick={() => setRecentSearches([...recentSearches.filter(rs => rs.name !== word.name)])} />
                </div>
                <CardWord word={word} purchaseWord={purchaseWord} status={word.status} />
              </Col>
            ))}
          </Row>
        </>}

        {/* {ownedWords.length > 0 && <>
          <Row className="justify-content-center">
            <Col>
              <h2 className="text-center">Your minted words</h2>
            </Col>
          </Row>
          <Row>
            {ownedWords.map((word, index) => (
              <Col key={index} sm="6" lg="3" className="mb-3 mb-md-4">
                <CardWord word={word} />
              </Col>
            ))}
          </Row>
        </>} */}
        
        {/* {recentWords.length > 0 && <>
          <Row className="justify-content-center">
            <Col>
              <h2 className="text-center">Recently minted words</h2>
            </Col>
          </Row>
          <Row>
            {recentWords.map((word, index) => {
              if (index < 4) {
                return (
                  <Col key={index} sm="6" lg="3" className="mb-3 mb-md-4">
                    <CardWord word={word} />
                  </Col>
                );
              }
            })}
          </Row>
        </>} */}
      </Container>
    </>
  );
};

export default Home;