import { useEffect } from 'react';
import { ChainId, useEthers } from '@usedapp/core';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import useSWR from 'swr';
import fetcher from '../../lib/fetcher';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import startCase from 'lodash/startCase';
import {
  addSearch,
} from '../../store/root/reducer';
import {
  Container,
  Row,
  Col,
  Alert,
  Button
} from 'react-bootstrap';
import Layout from '../../layouts/Main';
import Menubar from '../../components/Menubar';
import Header from '../../components/Header';
import Toasts from '../../components/Toasts';
import CardSearch from '../../components/CardSearch';
import Alerts from '../../components/Alerts';

const PageWord = (props) => {
  const { addSearch } = props;
  const { query } = useRouter();
  const { account, chainId } = useEthers();

  useEffect(() => {
    if (query.slug) addSearch({ name: query.slug.trim().toLowerCase() });
  }, [query.slug]);

  const { data, error } = useSWR(query.slug ? `/api/token/${query.slug}` : null, fetcher);

  return (
    <Layout>
      <Head>
        <title>CryptoWords - {startCase(query.slug)}</title>
        <meta property="og:image"           content={data?.image} key="og:image" />
        <meta property="og:image:width"     content="1200" key="og:image:width" />
        <meta property="og:image:height"    content="1200" key="og:image:height" />

        <meta name="twitter:card"           content="summary_large_image" key="twitter:card" />
        <meta name="twitter:site"           content="@RealCryptoWords" key="twitter:site" />
        <meta name="twitter:creator"        content="@RealCryptoWords" key="twitter:creator" />
        <meta name="twitter:title"          content={`CryptoWords - ${startCase(data?.name)}`} key="twitter:title" />
        <meta name="twitter:image"          content={data?.image} key="twitter:image" />
      </Head>

      <Menubar />

      <Container className="pt-4 my-3 my-md-5">
        {account && chainId !== ChainId.Rinkeby && <Alert variant="danger"><h1>Stop!</h1><p>This is a test Web3 app that uses the Rinkeby network! Please switch to rinkeby before minting NFTs.</p></Alert>}
        
        <Toasts />
        <Alerts position="global" />
        
        <Header />

        <Row className="justify-content-center mb-5">
          <Col sm="24" md="16" lg="12">
            {data?.name && <CardSearch search={{name: data.name}} />}
          </Col>
        </Row>

        <Row className="justify-content-center mb-5">
          <Col sm="24" md="16" lg="12" className="text-center">
            <Link href="/" passHref>
              <Button variant="outline-primary" size="lg" className="h3 text-center">Search for more words!</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

// const mapStateToProps = (state) => {
//   const { searches } = state.root;
//   return { searches };
// };
const mapDispatchToProps = (dispatch) => ({
  addSearch: bindActionCreators(addSearch, dispatch),
});

export default connect(null, mapDispatchToProps)(PageWord);