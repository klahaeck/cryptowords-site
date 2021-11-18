import { useEthers } from '@usedapp/core';
import useOwnedWords from '../hooks/useOwnedWords';
import {
  Row,
  Col,
} from 'react-bootstrap';
// import Slider from 'react-slick';
// import { Next, Prev } from './SliderArrows';
import CardWord from './CardWord';

// const OWNED_WORDS_SLIDER_SETTINGS = {
//   dots: false,
//   arrows: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 5,
//   slidesToScroll: 1,
//   nextArrow: <Next />,
//   prevArrow: <Prev />,
//   responsive: [
//     {
//       breakpoint: 1400,
//       settings: {
//         slidesToShow: 4,
//         slidesToScroll: 1,
//       }
//     },
//     {
//       breakpoint: 1200,
//       settings: {
//         slidesToShow: 4,
//         slidesToScroll: 1,
//       }
//     },
//     {
//       breakpoint: 992,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 1,
//       }
//     },
//     {
//       breakpoint: 768,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 1,
//       }
//     },
//     {
//       breakpoint: 576,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1,
//       }
//     },
//     {
//       breakpoint: 480,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1
//       }
//     }
//   ]
// };

const OwnedWords = ({ className }) => {
  const { account } = useEthers();
  const ownedWords = useOwnedWords(account);

  return (
    <div className={className}>
      <Row className="">
        <Col>
          <h5 className="text-uppercase">Your Words</h5>
        </Col>
      </Row>
      <Row className="g-1">
        {ownedWords.map((word, index) => (
          <Col key={index} xs="12" sm="8" md="6" lg="4" xl="3">
            <CardWord word={word} />
          </Col>
        ))}
      </Row>
    </div>    
  );
};

export default OwnedWords;