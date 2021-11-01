import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setTotalWords,
  addToast,
  addAlert
} from '../store/root/reducer';
import {
  Button,
  Card,
} from 'react-bootstrap';
import {
  WORD_EXISTS,
  WORD_MINTING,
  PURCHASE_SUCCESS
} from '../data/text';

const CardWord = (props) => {
  const { word, contract, isAdmin } = props;
  const { setTotalWords, addToast, addAlert } = props;

  const { account, library } = useWeb3React();

  const [ status, setStatus ] = useState(false);
  const [ price, setPrice ] = useState();
  const [ available, setAvailable ] = useState();

  useEffect(() => {
    const init = async () => {
      const p = library.utils.fromWei(await contract.methods.getPrice(account, word).call(), 'ether');
      setPrice(p);
      const e = await contract.methods.wordExists(word.slug).call();
      setAvailable(!e);
      setStatus(!e);
    }
    library && contract && account && word ? init() : null;
  }, [library, contract, account, word, isAdmin]);
  
  const purchaseWord = async (word) => {
    const wordExists = await contract.methods.wordExists(word.slug).call();
    const thisPrice = library.utils.fromWei(await contract.methods.getPrice(account, word).call(), 'ether');
    if (wordExists) {
      setAvailable(false);
      addAlert({
        color: 'danger',
        msg: WORD_EXISTS
      });
    } else {
      contract.methods.purchaseWord(account, word.slug)
        .send({ from: account, value: library.utils.toWei(thisPrice, 'ether') })
        .on('transactionHash', function(hash) {
          setStatus(false);
          addToast({
            bg: 'light',
            header: 'Crypto Words',
            body: WORD_MINTING
          });
        })
        .on('receipt', async (receipt) => {
          const thisExists = await contract.methods.wordExists(word.slug).call();
          setAvailable(!thisExists);

          addToast({
            bg: 'success',
            header: 'Crypto Words',
            body: PURCHASE_SUCCESS
          });

          if (isAdmin) {
            setTotalWords(await contract.methods.totalSupply().call());
          }
        })
        .catch(error => {
          console.error(error);
          setStatus(true);
          addAlert({ color: 'danger', msg: error.message});
        });
    }
  };

  return (
    <Card bg="dark" text="light" className="rounded-0">
      <div className="ratio ratio-1x1">
        <Card.Img variant="top" width="100%" src={word.image} alt={word.name} className="rounded-0" />
      </div>
      <Card.Body>
        {/* <Card.Title tag="h5">{word.word}</Card.Title> */}
        {/* <Card.Subtitle tag="h6" className="mb-2 text-muted">Card subtitle</Card.Subtitle> */}
        {/* <Card.Text>{word.description}</Card.Text> */}
        <Card.Text>
          {available &&<small>Price {price} ETH</small>}
          {!available && <small>{WORD_EXISTS}</small>}
          <br />
          {available && <Button className="float-right" size="sm" disabled={!status || word.loading} onClick={() => purchaseWord(word)}>Purchase</Button>}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  contract: state.root.contract,
  isAdmin: state.root.isAdmin,
});
const mapDispatchToProps = (dispatch) => ({
  setTotalWords: bindActionCreators(setTotalWords, dispatch),
  addToast: bindActionCreators(addToast, dispatch),
  addAlert: bindActionCreators(addAlert, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CardWord);