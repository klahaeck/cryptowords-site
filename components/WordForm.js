import { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  addSearch,
} from '../store/root/reducer';
import { useForm, Controller } from 'react-hook-form';
import {
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';

const WordForm = (props) => {
  const { addSearch } = props;
  const { handleSubmit, control, formState: { isSubmitSuccessful, errors }, reset } = useForm();

  const onSubmitSearch = data => {
    addSearch({ name: data.word.trim().toLowerCase() });
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ word: '' });
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <p className="text-center">There is only one instance of each word.<br />Once a word is purchased, it is no longer available.</p>
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
            <Button color="primary" type="submit" disabled={false}>Find Your Word</Button>
          </InputGroup>
          {errors.word?.type === 'required' && <small className="form-text text-danger">A word is required</small>}
          {/* {errors.word?.type === 'pattern' && <small className="form-text text-danger">Must be a single word with no special characters or numbers</small>} */}
        </Form.Group>
      </Form>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  addSearch: bindActionCreators(addSearch, dispatch),
});

export default connect(null, mapDispatchToProps)(WordForm);