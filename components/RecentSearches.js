import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import Slider from 'react-slick';
import CardSearch from '../components/CardSearch';
import {
  removeSearch,
} from '../store/root/reducer';
// import { Next, Prev } from './SliderArrows';
import {
  Row,
  Col,
} from 'react-bootstrap';

// const RECENT_SEARCHES_SLIDER_SETTINGS = {
//   dots: false,
//   arrows: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 2,
//   slidesToScroll: 1,
//   nextArrow: <Next />,
//   prevArrow: <Prev />,
//   responsive: [
//     {
//       breakpoint: 1400,
//       settings: {}
//     },
//     {
//       breakpoint: 1200,
//       settings: {}
//     },
//     {
//       breakpoint: 992,
//       settings: {}
//     },
//     {
//       breakpoint: 768,
//       settings: {}
//     },
//     {
//       breakpoint: 576,
//       settings: {}
//     },
//     {
//       breakpoint: 480,
//       settings: {}
//     }
//   ]
// };

const RecentSearches = (props) => {
  const { searches, removeSearch } = props;

  return (
    <>
      <h6 className="text-uppercase">Your Recent Searches</h6>
      <Row className="g-1">
        {searches.filter((rs, index) => index > 0).map((search, index) => (
          <Col key={index} xs sm="12">
            <CardSearch slim={true} search={search} onCloseClick={removeSearch} />
          </Col>
        ))}
      </Row>
    </>
  );
};

const mapStateToProps = (state) => {
  const { searches } = state.root;
  return { searches };
};
const mapDispatchToProps = (dispatch) => ({
  removeSearch: bindActionCreators(removeSearch, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RecentSearches);