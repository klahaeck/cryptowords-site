import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Stack
} from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="pt-5">
      <Container>
        <p className="h4 mb-3 pb-2 border-bottom border-5 border-primary">CryptoWords</p>
        <Row>
          <Col>
            <Stack gap={0}>
              {/* <div>
                <Link href="/about"><a className="text-dark text-decoration-none">about</a></Link>
              </div> */}
              <div>
                <Link href="/faqs"><a className="text-dark text-decoration-none">faqs</a></Link>
              </div>
              <div>
                <Link href="/contact"><a className="text-dark text-decoration-none">contact</a></Link>
              </div>
              {/* <div>
                <Link href="/terms"><a className="text-dark text-decoration-none">terms of use</a></Link>
              </div>
              <div>
                <Link href="/privacy"><a className="text-dark text-decoration-none">privacy policy</a></Link>
              </div> */}
            </Stack>
          </Col>
          <Col>
            <Stack gap={0} className="text-end">
              <div>
                <a href="https://www.facebook.com/realcryptowords" target="_blank" rel="noreferrer" className="text-dark text-decoration-none">Facebook</a>
              </div>
              <div>
                <a href="https://twitter.com/RealCryptoWords" target="_blank" rel="noreferrer" className="text-dark text-decoration-none">Twitter</a>
              </div>
            </Stack>
          </Col>
        </Row>
        <p className="mt-5 text-center text-secondary"><small>&copy; 2021 CryptoWords</small></p>
      </Container>
    </footer>
  );
};

export default Footer;