import { useEffect, useState } from 'react';
import Web3 from 'web3';
import NiftyWords from '../contracts/NiftyWords.json';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Alert,
  Modal
} from 'react-bootstrap';
import CardWord from '../components/CardWord';
import {
  WRONG_NETWORK,
  WORD_NOT_FOUND,
  WORD_EXISTS,
  PURCHASE_SUCCESS,
  // NOT_ENOUGH_FUNDS
} from '../data/text';

const Home = () => {
  const [ web3, setWeb3 ] = useState(null);
  const [ address, setAddress ] = useState(null);
  const [ contract, setContract ] = useState(null);
  
  const [ sending, setSending ] = useState(false);
  const [ currentWord, setCurrentWord ] = useState();
  const [ price, setPrice ] = useState();
  const [ alerts, setAlerts ] = useState([]);
  const { handleSubmit, control, formState: { errors }, reset } = useForm();
  const [ isMinting, setIsMinting ] = useState(false);
  const [ modalOpen, setModalOpen ] = useState(false);

  // const MIN_FUNDS = 0.035 // in ETH
  // const MAX_INIT_NFTS = 4;

  useEffect(() => {
    if (window.ethereum) {
      ethereum.request({ method: 'eth_requestAccounts' }).then(async (accounts) => {
        setAddress(accounts[0])
        const w3 = new Web3(ethereum);
        setWeb3(w3);
        const c = new w3.eth.Contract(NiftyWords.abi, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
        setContract(c);
      }).catch((err) => console.log(err));

      window.ethereum.on('accountsChanged', (accounts) => setAddress(accounts[0]));
    } else {
      console.log('Please install MetaMask');
    }    

    // return () => {
    //   if (window.ethereum) {
    //     window.ethereum.off('accountsChanged', (accounts) => setAddress(accounts[0]));
    //   }
    // }
  }, []);

  useEffect(() => {
    async function  init() {
      const thisPrice = await contract.methods.getPrice(address).call();
      const thisPriceEther = web3.utils.fromWei(thisPrice, 'ether');
      setPrice(thisPriceEther);
    }
    web3 && contract ? init() : null;
  }, [web3, contract, address]);

  useEffect(() => {
    setModalOpen(isMinting);
  }, [isMinting]);

  const correctNetwork = async () => {
    const network = await web3.eth.net.getNetworkType();
    const isCorrect = network === process.env.NEXT_PUBLIC_ETH_NETWORK;
    if (!isCorrect) {
      setAlerts([...alerts, {
        color: 'danger',
        msg: WRONG_NETWORK
      }]);
    }
    return isCorrect;
  }

  const onSubmit = async data => {
    // const thisWord = data.word;
    setSending(true);
    setCurrentWord(null);
    
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
        
        setCurrentWord(data);
        setSending(false);
      })
      .catch(error => {
        console.error(error);
        setSending(false);
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
            setIsMinting(true);
          })
          .on('receipt', (receipt) => {
            console.log(receipt);

            // const tempURI = process.env.NODE_ENV === 'production' ? tokenURI : tokenURI.replace('https://niftywords.art', 'http://localhost:3000');
            // setMyWordURIs([tempURI, ...myWordURIs]);
            reset();
            setCurrentWord(null);
            setIsMinting(false);
            setAlerts([...alerts, {
              color: 'success',
              msg: PURCHASE_SUCCESS
            }]);
          })
          .catch(error => {
            console.error(error);
            setIsMinting(false);
            setAlerts([...alerts, { color: 'danger', msg: error.message}]);
          });
      }
    }
  };

  const onDismissAlert = (alert) => {
    const newAlerts = alerts.filter(a => a.msg !== alert.msg);
    setAlerts(newAlerts);
  };

  return (
    <Container className="my-3 my-md-5">
      {alerts.map((alert, index) => <Alert key={index} variant={alert.color} onClose={() => onDismissAlert(alert)} dismissible>{alert.msg}</Alert>)}

      <h1 className="text-center">Choose a word to create an NFT</h1>

      <Row className="justify-content-center my-5">
        <Col md="8" lg="6">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group>
              <Form.Label htmlFor="word" className="sr-only">Your Word</Form.Label>
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
                <Button color="primary" type="submit" disabled={sending}>Find</Button>
              </InputGroup>
              {errors.word?.type === 'required' && <small className="form-text text-danger">A word is required</small>}
              {/* {errors.word?.type === 'pattern' && <small className="form-text text-danger">Must be a single word with no special characters or numbers</small>} */}
            </Form.Group>
          </Form>
        </Col>
      </Row>

      {currentWord && <Row className="justify-content-center mb-5">
        <Col sm="12" md="8" lg="6">
          <CardWord word={currentWord} purchaseWord={purchaseWord} price={price} status={true} />
        </Col>
      </Row>}

      {/* {myWordURIs.length > 0 && <>
        <Row className="justify-content-center">
          <Col>
            <h2 className="text-center">Your minted words</h2>
          </Col>
        </Row>
        <Row>
          {myWordURIs.map((uri, index) => (
            <Col key={index} sm="6" lg="3" className="mb-3 mb-md-4">
              <CardWord uri={uri} />
            </Col>
          ))}
        </Row>
      </>}
      
      {recentWordURIs.length > 0 && <>
        <Row className="justify-content-center">
          <Col>
            <h2 className="text-center">Recently minted words</h2>
          </Col>
        </Row>
        <Row>
          {recentWordURIs.map((uri, index) => {
            if (index < 4) {
              return (
                <Col key={index} sm="6" lg="3" className="mb-3 mb-md-4">
                  <CardWord uri={uri} />
                </Col>
              );
            }
          })}
        </Row>
      </>} */}

      <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
        <Modal.Body className="text-center">Your NFT is minting. It will be available shortly.</Modal.Body>
      </Modal>
    </Container>
  );
};

export default Home;