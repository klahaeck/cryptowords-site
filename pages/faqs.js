import {
  Container,
  // Row,
  // Col,
  ListGroup
} from 'react-bootstrap';
import Layout from '../layouts/Main';

const Faqs = () => {
  return (
    <Layout>
      <Container className="my-5">
        <h1 className="mb-5">FAQs</h1>

        <ListGroup variant="flush">
          <ListGroup.Item className="ps-0">
            <h3 className="h5">What is an NFT?</h3>
            <p>We'll leave this answer to the wizards at <a href="https://en.wikipedia.org/wiki/Non-fungible_token" target="_blank" rel="noreferrer">Wikipedia</a> but the easiest definition we can give is that it stands for "Non-fungible token". This "Non-fungible token" can be used to prove ownership of a piece of digital art which is the use-case for CryptoWords.</p>
          </ListGroup.Item>
          <ListGroup.Item className="ps-0">
            <h3 className="h5">The word I want is not available. What gives?</h3>
            <p>There is only one NFT instance of each word in the dictionary. Once it is purchased, it is no longer available to anybody else through this site. Though you may make an offer to purchase the word from the owner at any secondary NFT marketplace such as <a href="https://rarible.com/" target="_blank" rel="noreferrer">Rarible</a> or <a href="https://opensea.io/" target="_blank" rel="noreferrer">OpenSea</a>. The price on any other secondary marketplace is entirely up to the owner of the word.</p>
          </ListGroup.Item>
          <ListGroup.Item className="ps-0">
            <h3 className="h5">The definition of my word doesn't seem correct. Where did you source it?</h3>
            <p>The definitions for all of words on this site come from the <a href="https://www.merriam-webster.com/" target="_blank" rel="noreferrer">Mirriam-Webster collegiate dictionary</a>. Double-cehck on their site if you think it may be incorrect.</p>
          </ListGroup.Item>
          <ListGroup.Item className="ps-0">
            <h3 className="h5">The word I want cannot be found but I know it is in the dictionary.</h3>
            <p>Check the spelling of the word and make sure there aren't any wierd characters in it. Also check that it is a single word. Double check that it exists the Mirriam Webster dictionary which is where we pull our definitions.</p>
          </ListGroup.Item>
          <ListGroup.Item className="ps-0">
            <h3 className="h5">Can I add my own word that is not in the dictionary?</h3>
            <p>Maybe. Send us an email at <a href="mailto:support@cryptowords.art">support@cryptowords.art</a> with the word, definition, and an example usage and we'll see if we can get it added, for funsies.</p>
          </ListGroup.Item>
          <ListGroup.Item className="ps-0">
            <h3 className="h5">I accidentally purchased the wrong word, can I get a refund?</h3>
            <p>Accidents happen, just email <a href="mailto:support@cryptowords.art">support@cryptowords.art</a> and describe your situation and we will do our best to accomodate.</p>
          </ListGroup.Item>
          <ListGroup.Item className="ps-0">
            <h3 className="h5">Will there ever be any foreign language words available?</h3>
            <p>Perhaps, though not at the moment. This project is for fun and has been fun so far. We'll see how much fun is left as time goes on.</p>
          </ListGroup.Item>
        </ListGroup>
      </Container>
    </Layout>
  );
};

export default Faqs;