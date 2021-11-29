import { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Head from 'next/head';
import Link from 'next/link';
import startCase from 'lodash/startCase';
import getWord from '../../lib/get-word';
import {
  addSearch,
} from '../../store/root/reducer';
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import Layout from '../../layouts/Main';
import CardSearch from '../../components/CardSearch';
import { meta } from '../../data';

const PageWord = (props) => {
  const { word, addSearch } = props;

  useEffect(() => {
    addSearch({ name: word.slug.trim().toLowerCase() });
  }, []);

  return (
    <Layout>
      <Head>
        <title>CryptoWords - {startCase(word.name)}</title>
        <meta property="og:url"             content={`${meta.url}/word/${word.slug}`} key="og:url" />
        <meta property="og:title"           content={`CryptoWords - ${startCase(word.name)}`} key="title" />
        <meta property="og:image"           content={word.imageShare} key="og:image" />
        <meta property="og:image:width"     content="1200" key="og:image:width" />
        <meta property="og:image:height"    content="628" key="og:image:height" />
        <meta name="twitter:title"          content={`CryptoWords - ${startCase(word.name)}`} key="twitter:title" />
        <meta name="twitter:image"          content={word.imageShare} key="twitter:image" />
      </Head>

      <Container className="pt-4 my-3 my-md-5">
        {/* <Header /> */}

        <Row className="justify-content-center mb-5">
          <Col sm="24" md="16" lg="12">
            {word && <CardSearch search={word} />}
          </Col>
        </Row>

        <Row className="justify-content-center mb-5">
          <Col sm="24" md="16" lg="12" className="text-center">
            <Link href="/" passHref>
              <Button variant="outline-dark" size="lg" className="h3 text-center">Search for more words!</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { params } = context;
  const word = await getWord(params.slug);

  if (typeof word !== 'object') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      word: JSON.parse(JSON.stringify(word))
    },
  }
}

const mapDispatchToProps = (dispatch) => ({
  addSearch: bindActionCreators(addSearch, dispatch),
});

export default connect(null, mapDispatchToProps)(PageWord);