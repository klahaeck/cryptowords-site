import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  setSearching,
  addAlert,
  setCurrentSearch
} from '../store/root/reducer';
import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';
import {
  WORD_NOT_FOUND,
} from '../data/text';

const WordForm = (props) => {
  const { searching } = props;
  const { setSearching, addAlert, setCurrentSearch } = props;
  
  const { handleSubmit, control, formState: { errors }, reset } = useForm();

  const onSubmitSearch = async data => {
    setSearching(true);

    const tempWord = {
      name: data.word.toLowerCase(),
      loading: true
    };
    setCurrentSearch(tempWord);

    fetch(`/api/token/${data.word}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(WORD_NOT_FOUND);
          } else {
            throw new Error(res.statusText);
          }
        }
        return res;
      })
      .then(res => res.json())
      .then(async data => {
        reset({ word: '' });
        setCurrentSearch(data);
        setSearching(false);
      })
      .catch(error => {
        console.error(error);
        setSearching(false);
        setCurrentSearch(null);
        addAlert({ color: 'danger', msg: error.message, position: 'word-form'});
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmitSearch)}>
      <Form.Group>
        <Form.Label htmlFor="word" className="visually-hidden">
          <i className="bi bi-arrow-clockwise"></i>
          Find Your Word
        </Form.Label>
        <InputGroup>
          <Controller
            name="word"
            control={control}
            defaultValue={''}
            rules={{
              required: true
              // pattern: /^[A-Za-z]+$/
            }}
            render={({ field }) => <Form.Control {...field} />}
          />
          <Button color="primary" type="submit" disabled={searching}>Find Your Word</Button>
        </InputGroup>
        {errors.word?.type === 'required' && <small className="form-text text-danger">A word is required</small>}
        {/* {errors.word?.type === 'pattern' && <small className="form-text text-danger">Must be a single word with no special characters or numbers</small>} */}
      </Form.Group>
    </Form>
  );
};

const mapStateToProps = (state) => ({
  searching: state.root.searching,
});
const mapDispatchToProps = (dispatch) => {
  return {
    setSearching: bindActionCreators(setSearching, dispatch),
    setCurrentSearch: bindActionCreators(setCurrentSearch, dispatch),
    addAlert: bindActionCreators(addAlert, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordForm);