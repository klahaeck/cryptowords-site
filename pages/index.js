import { useEffect } from 'react';
import { ChainId, useEthers } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useRouter } from 'next/router';
import {
  addSearch,
  removeSearch,
} from '../store/root/reducer';

import {
  Container,
  Row,
  Col,
  Alert,
} from 'react-bootstrap';
import Layout from '../layouts/Main';
import useRecentWords from '../hooks/useRecentWords';
import useOwnedWords from '../hooks/useOwnedWords';
import Menubar from '../components/Menubar';
import Header from '../components/Header';
import Toasts from '../components/Toasts';
import WordForm from '../components/WordForm';
import CardSearch from '../components/CardSearch';
import Alerts from '../components/Alerts';
import WordCarousel from '../components/WordCarousel';
import SiteModal from '../components/SiteModal';

const Home = (props) => {
  const { searches, addSearch, removeSearch } = props;
  const { query } = useRouter();

  const { account, chainId } = useEthers();

  const ownedWords = useOwnedWords(account);
  const recentWords = useRecentWords(10);

  useEffect(() => {
    if (query?.word) addSearch({ name: query.word.trim().toLowerCase() });
  }, [query.word]);

  return (
    <Layout>
      <Menubar />

      <Container className="pt-4 my-3 my-md-5">
        {account && chainId !== ChainId.Rinkeby && <Alert variant="danger"><h1>Stop!</h1><p>This is a test Web3 app that uses the Rinkeby network! Please switch to rinkeby before minting NFTs.</p></Alert>}
        
        <Toasts />
        <Alerts position="global" />
        
        <Header />

        <Row className="justify-content-center mt-3 mb-5">
          <Col md="16" lg="12">
            <Alerts position="word-form" />
            <WordForm />
          </Col>
        </Row>

        {searches && searches.length > 0 && <Row className="justify-content-center mb-5">
          <Col sm="24" md="16" lg="12">
            <CardSearch search={searches[0]} />
          </Col>
        </Row>}

        {searches && searches.length > 1 && <WordCarousel title="Your recent searches" visibleSlides={2} words={searches.filter((rw, index) => index > 0)} onCloseClick={removeSearch} isSearch={true} />}

        {account && ownedWords && ownedWords.length > 0 && <WordCarousel title="Your Words" words={ownedWords.map(w => (w))} />}

        {recentWords && recentWords.length > 0 && <WordCarousel title="Recently Minted Words" words={recentWords.map(w => (w))} />}
      </Container>

      <SiteModal />
    </Layout>
  );
};

const mapStateToProps = (state) => {
  const { searches } = state.root;
  return { searches };
};
const mapDispatchToProps = (dispatch) => ({
  addSearch: bindActionCreators(addSearch, dispatch),
  removeSearch: bindActionCreators(removeSearch, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);