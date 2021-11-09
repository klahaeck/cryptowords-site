import {
  Row,
  Col,
} from 'react-bootstrap';
import Slider from 'react-slick';
import CardWord from './CardWord';
import CardSearch from './CardSearch';

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
            <div key={index} className="px-2">
              {isSearch ? <CardSearch search={word} onCloseClick={onCloseClick} /> : <CardWord word={word} />}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default WordCarousel;
