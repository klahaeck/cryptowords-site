import { useEffect } from 'react';
import { useEthers } from '@usedapp/core';
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
} from 'react-bootstrap';
import Layout from '../layouts/Main';
import useRecentWords from '../hooks/useRecentWords';
import useOwnedWords from '../hooks/useOwnedWords';
import Header from '../components/Header';
import WordForm from '../components/WordForm';
import CardSearch from '../components/CardSearch';
import Alerts from '../components/Alerts';
import RandomWord from '../components/RandomWord';
import RecentSearches from '../components/RecentSearches';
import RecentMinted from '../components/RecentMinted';
import OwnedWords from '../components/OwnedWords';


const Home = (props) => {
  const { searches, addSearch } = props;
  const { query } = useRouter();

  const { account } = useEthers();

  const ownedWords = useOwnedWords(account);
  const recentWords = useRecentWords(10);

  useEffect(() => {
    if (query?.word) addSearch({ name: query.word.trim().toLowerCase() });
  }, [query.word]);

  return (
    <Layout>
      <Container className="pt-2 my-3 my-md-5">
        <Header />

        <div className="my-md-1 my-lg-4" style={{height:1}}></div>

        <Row className="mt-3 mb-5 justify-content-between">
          <Col xs="24" md={{ span: 13, order: 'last' }} lg={{ span: 13 }} className="mb-4 mb-md-0">
            <Alerts position="word-form" />
            <WordForm />

            {searches && searches.length > 1 && <div className="d-none d-md-block mt-4"><RecentSearches /></div>}
          </Col>
          <Col xs="24" md={{ span: 10, order: 'first' }} lg="9" className="mb-lg-5">
            <div className="position-relative p-3 m-2 m-md-n1 m-lg-n3 search-featured">
              <div className="position-absolute w-100 h-100 border border-dark border-3 search-outline-0"></div>
              <div className="position-absolute w-100 h-100 border border-dark border-3 search-outline-1"></div>
              <div className="position-absolute w-100 h-100 border border-dark border-3 search-outline-2"></div>
              {searches && searches.length > 0 ? <CardSearch search={searches[0]} className="card-primary" /> : <RandomWord className="card-primary" />}
            </div>
          </Col>
          {searches && searches.length > 1 && <Col className="d-md-none mt-4"><RecentSearches /></Col>}
        </Row>
      </Container>

      <div className="bg-dark mt-5">
        <Container>
          {recentWords && recentWords.length > 0 && <RecentMinted />}
        </Container>
      </div>

      <Container className="mt-5 mb-5">
        {account && ownedWords && ownedWords.length > 0 && <OwnedWords />}
      </Container>
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