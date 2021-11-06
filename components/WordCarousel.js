import {
  Row,
  Col,
  CloseButton
} from 'react-bootstrap';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import CardWord from './CardWord';
import CardSearch from './CardSearch';
import 'pure-react-carousel/dist/react-carousel.es.css';

const WordCarousel = (props) => {
  const { words, title, onCloseClick, isSearch } = props;
  return (
    <>
      <Row className="justify-content-center">
        <Col>
          <p className="h4">{title}</p>
        </Col>
      </Row>
      <Row>
        {/* <CarouselProvider
          naturalSlideWidth={200}
          naturalSlideHeight={200}
          visibleSlides={visibleSlides || 5}
          infinite={true}
          isIntrinsicHeight={true}
          totalSlides={words.length}
        >
          <Slider> */}
            {words.map((word, index) => (
              // <Slide key={index} index={index} className="p-2">
              <Col key={index} xs={isSearch ? 24 : 12} sm={isSearch ? 12 : 8} md={isSearch ? 8 : 6} lg={isSearch ? 6 : 5} className="mb-3 mb-md-4">
                {onCloseClick && <div className="d-flex justify-content-end">
                  <CloseButton className="outline-none" onClick={() => onCloseClick(word.name)} />
                </div>}
                {isSearch ? <CardSearch search={word} /> : <CardWord word={word} />}
              </Col>
              // </Slide>
            ))}
          {/* </Slider>
          <ButtonBack>Back</ButtonBack>
          <ButtonNext>Next</ButtonNext>
        </CarouselProvider> */}
      </Row>
    </>
  );
};

export default WordCarousel;
