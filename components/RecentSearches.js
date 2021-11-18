import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Slider from 'react-slick';
import CardSearch from '../components/CardSearch';
import {
  removeSearch,
} from '../store/root/reducer';
import { Next, Prev } from './SliderArrows';

const RECENT_SEARCHES_SLIDER_SETTINGS = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 1,
  nextArrow: <Next />,
  prevArrow: <Prev />,
  responsive: [
    {
      breakpoint: 1400,
      settings: {}
    },
    {
      breakpoint: 1200,
      settings: {}
    },
    {
      breakpoint: 992,
      settings: {}
    },
    {
      breakpoint: 768,
      settings: {}
    },
    {
      breakpoint: 576,
      settings: {}
    },
    {
      breakpoint: 480,
      settings: {}
    }
  ]
};

const RecentSearches = (props) => {
  const { searches, removeSearch } = props;

  return (
    <div className="d-none d-lg-block mt-5">
      <h6>Your Recent Searches</h6>
      <div className="mb-3 mb-md-4">
        <Slider {...RECENT_SEARCHES_SLIDER_SETTINGS}> 
          {searches.filter((rs, index) => index > 0).map((search, index) => (
            <div key={index} className="px-1">
              <CardSearch search={search} onCloseClick={removeSearch} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
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