import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../lib/wallet/connectors';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setContract,
  setIsAdmin,
  removeRecentSearch,
} from '../store/root/reducer';

import CryptoWordsV1 from '../contracts/CryptoWordsV1.json';
import {
  Container,
  Row,
  Col,
  Alert,
  Button,
  CloseButton
} from 'react-bootstrap';
import AdminNavbar from '../components/AdminNavbar';
import Header from '../components/Header';
import Toasts from '../components/Toasts';
import WordForm from '../components/WordForm';
import CardWord from '../components/CardWord';
import CardLoading from '../components/CardLoading';
import Alerts from '../components/Alerts';
import {
  WRONG_NETWORK,
} from '../data/text';

const Home = (props) => {
  const { contract, isAdmin, currentSearch, recentSearches } = props;
  const { setContract, setIsAdmin, removeRecentSearch } = props;

  const { active, account, library, chainId, activate } = useWeb3React();

  useEffect(() => {
    const init = () => {
      const c = new library.eth.Contract(CryptoWordsV1.abi, process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
      setContract(c);
    }
    active && library && setContract ? init() : null;
  }, [active, library, setContract]);
  
  useEffect(() => {
    const init = async () => {
      const defaultAdminRole = await contract.methods.DEFAULT_ADMIN_ROLE().call();
      const checkAdmin = await contract.methods.hasRole(defaultAdminRole, account).call();
      setIsAdmin(checkAdmin)
    };
    account && contract && setIsAdmin ? init() : null;
  }, [account, contract, setIsAdmin]);
  
  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch(error) {
      console.error(error);
    }
  };

  return (
    <>
      {isAdmin && <AdminNavbar />}
      <Container className="my-3 my-md-5">
        {active && chainId !== 4 && <Alert variant="danger"><div className="content" dangerouslySetInnerHTML={{__html: WRONG_NETWORK}}></div></Alert>}
        <Toasts />
        <Alerts position="global" />
        <Header />

        {!active && <Row>
          <Col className="text-center">
            <Button onClick={connectWallet}>Connect to MetaMask</Button>
          </Col>
        </Row>}
        
        {active && <>
          <Row className="justify-content-center mt-3 mb-5">
            <Col md="8" lg="6">
              <Alerts position="word-form" />
              <WordForm />
            </Col>
          </Row>

          {currentSearch && <Row className="justify-content-center mb-5">
            <Col sm="12" md="8" lg="6">
              {currentSearch.loading ? <CardLoading word={currentSearch} /> : <CardWord word={currentSearch} />}
            </Col>
          </Row>}
          
          {recentSearches.filter((rw, index) => !rw.loading).length > 0 && <>
            <Row className="justify-content-center">
              <Col>
                <p className="h4 text-center">Your recently searched words</p>
              </Col>
            </Row>
            <Row className="justify-content-center">
              {recentSearches.filter((rw) => !rw.loading).map((word, idx) => (
                <Col key={idx} sm="6" md="4" lg="3" className="mb-3 mb-md-4">
                  <div className="d-flex justify-content-end">
                    <CloseButton className="outline-none" onClick={() => removeRecentSearch(word)} />
                  </div>
                  <CardWord word={word} />
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
        </>}
      </Container>
    </>
  );
};

const mapStateToProps = (state) => ({
  contract: state.root.contract,
  isAdmin: state.root.isAdmin,
  currentSearch: state.root.currentSearch,
  recentSearches: state.root.recentSearches,
});
const mapDispatchToProps = (dispatch) => ({
  setContract: bindActionCreators(setContract, dispatch),
  setIsAdmin: bindActionCreators(setIsAdmin, dispatch),
  removeRecentSearch: bindActionCreators(removeRecentSearch, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);