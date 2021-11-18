import { useEffect } from 'react';
import { ChainId, useEthers } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useRouter } from 'next/router';
import {
  addSearch,
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
import RandomWord from '../components/RandomWord';
import RecentSearches from '../components/RecentSearches';
import SiteModal from '../components/SiteModal';
import RecentMinted from '../components/RecentMinted';
import OwnedWords from '../components/OwnedWords';
import BgParticles from '../components/BgParticles';

const Home = (props) => {
  const { searches, addSearch } = props;
  const { query } = useRouter();

  const { account, chainId } = useEthers();

  const ownedWords = useOwnedWords(account);
  const recentWords = useRecentWords(10);

  useEffect(() => {
    if (query?.word) addSearch({ name: query.word.trim().toLowerCase() });
  }, [query.word]);

  return (
    <Layout>
      <BgParticles />

      <Menubar />

      <Container className="pt-2 my-3 my-md-5">
        {account && chainId !== ChainId.Rinkeby && <Alert variant="danger"><h1>Stop!</h1><p>This is a test Web3 app that uses the Rinkeby network! Please switch to rinkeby before minting NFTs.</p></Alert>}
        
        <Toasts />
        <Alerts position="global" />
        
        <Header />

        <Row className="mt-3 mb-5 justify-content-between">
          <Col xs="24" md={{ span: 14, order: 'last' }} lg={{ span: 13 }} className="mb-4 mb-md-0">
            <Alerts position="word-form" />
            <WordForm />

            {searches && searches.length > 1 && <div className="d-none d-md-block mt-4"><RecentSearches /></div>}
          </Col>
          {searches && searches.length > 0 && <Col xs="24" md={{ span: 10, order: 'first' }} lg="10">
            <CardSearch search={searches[0]} />
          </Col>}
          {(!searches || !searches.length) && <Col xs="24" md={{ span: 10, order: 'first' }} lg="10">
            <RandomWord />
          </Col>}
          {searches && searches.length > 1 && <Col className="d-md-none mt-4"><RecentSearches /></Col>}
        </Row>
      </Container>

        <div className="bg-dark">
          <Container>
            {recentWords && recentWords.length > 0 && <RecentMinted />}
          </Container>
        </div>

        <Container className="mt-5">
          {account && ownedWords && ownedWords.length > 0 && <OwnedWords />}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);