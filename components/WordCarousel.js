import {
  Row,
  Col,
  CloseButton
} from 'react-bootstrap';
// import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import Slider from 'react-slick';
import CardWord from './CardWord';
import CardSearch from './CardSearch';
// import 'pure-react-carousel/dist/react-carousel.es.css';

const WordCarousel = (props) => {
  const { words, title, onCloseClick, isSearch } = props;

  const SLIDER_SETTINGS = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="mb-5">
      <Row className="justify-content-center">
        <Col>
          <p className="h4 text-center">{title}</p>
        </Col>
      </Row>
      <div className="mb-3 mb-md-4">
        <Slider {...SLIDER_SETTINGS}> 
          {words.map((word, index) => (
            // <Col key={index} xs={isSearch ? 24 : 12} sm={isSearch ? 12 : 8} md={isSearch ? 8 : 6} lg={isSearch ? 6 : 5}>
            <div key={index} className="px-1">
              {onCloseClick && <div className="d-flex justify-content-end">
                <CloseButton className="outline-none" onClick={() => onCloseClick(word.name)} />
              </div>}
              {isSearch ? <CardSearch search={word} /> : <CardWord word={word} />}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default WordCarousel;
