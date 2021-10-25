import { useEffect, useState } from 'react';
import Web3 from 'web3';
import CryptoWords from '../contracts/CryptoWords.json';
import { useForm, Controller } from 'react-hook-form';
import {
  Navbar,
  Nav,
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
  // const [ currentWord, setCurrentWord ] = useState();
  const [ price, setPrice ] = useState();
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
        
        const c = new w3.eth.Contract(CryptoWords.abi, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
        setContract(c);

        const thisNetwork = await w3.eth.net.getNetworkType();
        setNetwork(thisNetwork);

        const thisBalance = w3.utils.fromWei(await w3.eth.getBalance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS), 'ether');
        setBalance(thisBalance);

        const totalWords = await c.methods.totalSupply().call();
        setTotalWords(totalWords);

        const thisPaused = await c.methods.paused().call();
        setPaused(thisPaused);
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

  useEffect(() => {
    async function  init() {
      const defaultAdminRole = await contract.methods.DEFAULT_ADMIN_ROLE().call();
      const thisIsAdmin = await contract.methods.hasRole(defaultAdminRole, address).call();
      setIsAdmin(thisIsAdmin)

      const thisPrice = await contract.methods.getPrice(address).call();
      const thisPriceEther = web3.utils.fromWei(thisPrice, 'ether');
      setPrice(thisPriceEther);
    }
    web3 && contract ? init() : null;
  }, [web3, contract, address]);

  // const getUserTokens = async () => {
  //   const thisBalance = await contract.methods.balanceOf(address).call();
  //   // console.log(thisBalance);
  // }

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

  // const getBalance = async () => web3.utils.fromWei(await web3.eth.getBalance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS), 'ether');
  // const getTotalWords = async () => await web3.contract.totalSupply().call();

  const onSubmit = async data => {
    setSearching(true);

    const existingRecentSearch = recentSearches.filter(rs => rs.name === data.word.toLowerCase())[0];
    if (existingRecentSearch) {
      setRecentSearches([existingRecentSearch, ...recentSearches.filter(rs => rs.name !== existingRecentSearch.name)]);
      existingRecentSearch.exists = await contract.methods.wordExists(existingRecentSearch.slug).call();
    } else {
      setRecentSearches([{name: data.word}, ...recentSearches]);
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
        try {
          data.exists = await contract.methods.wordExists(data.name).call();
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
            // reset();
            try {
              word.exists = await contract.methods.wordExists(word.slug).call();
            } catch(error) {
              console.error(error);
            }

            setToasts([...toasts, {
              bg: 'success',
              header: 'Crypto Words',
              body: PURCHASE_SUCCESS
            }]);
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
      .then(async () => setBalance(await getBalance()))
      .catch(error => console.error(error));
  };

  return (
    <>
      {isAdmin && <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Admin</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Item>
                <Nav.Link onClick={handleTogglePause}>Paused: {`${paused}`}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link disabled>total Words: {totalWords}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link disabled>Current Balance: {balance}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Button onClick={() => payoutHandler()} disabled={balance <= 0}>Payout</Button>
              </Nav.Item>
              {/* <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link> */}
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
          </Navbar.Collapse>
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
        <h2 className="text-center">Own the english language, one word at a time.</h2>

        <p className="text-center">There is only one instance of each word. Once a word is purchased, it is no longer available. Use the field below to search for your word.</p>

        <Row className="justify-content-center my-5">
          <Col md="8" lg="6">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group>
                <Form.Label htmlFor="word" className="visually-hidden">Find Your Word</Form.Label>
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
            {recentSearches.length > 0 && <CardWord word={recentSearches[0]} purchaseWord={purchaseWord} price={price} status={true} />}
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
                <CardWord word={word} purchaseWord={purchaseWord} price={price} status={true} />
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