import { useEthers } from '@usedapp/core';
import useOwnedWords from '../hooks/useOwnedWords';
import {
  Row,
  Col,
} from 'react-bootstrap';
import Slider from 'react-slick';
import { Next, Prev } from './SliderArrows';
import CardWord from './CardWord';

const OWNED_WORDS_SLIDER_SETTINGS = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  nextArrow: <Next />,
  prevArrow: <Prev />,
  responsive: [
    {
      breakpoint: 1400,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
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

const OwnedWords = ({ className }) => {
  const { account } = useEthers();
  const ownedWords = useOwnedWords(account);

  return (
    <div className={className}>
      <Row className="">
        <Col>
          <h5 className="text-center">Your Words</h5>
        </Col>
      </Row>
      <div className="px-4 mb-3 mb-md-4">
        <Slider {...OWNED_WORDS_SLIDER_SETTINGS}> 
          {ownedWords.map((word, index) => (
            <div key={index} className="px-2">
              <CardWord word={word} />
            </div>
          ))}
        </Slider>
      </div>
    </div>    
  );
};

export default OwnedWords;