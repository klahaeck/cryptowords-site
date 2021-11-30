import Link from 'next/link';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import Layout from '../layouts/Main';

const Contact = () => {
  return (
    <Layout>
      <Container className="my-5">
        <h1 className="mb-5">Contact</h1>
        <Row>
          <Col md="12">
            <p>For any questions or support requests, email <a href="mailto:support@cryptowords.art">support@cryptowords.art</a> Or checkout our Discord server <a href="https://discord.com/channels/915347191781031957/915347287297896498" target="_blank" rel="noreferrer">here</a>.</p>
            <p>We wil do our best to accomodate whatever requests you may have. In the meantime, check out our <Link href="/faqs">FAQs</Link> page for any info that may be relevant to your concern.</p>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Contact;