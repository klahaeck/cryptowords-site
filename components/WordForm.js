import { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import slugify from 'slugify';
import {
  addSearch,
} from '../store/root/reducer';
import { useForm, Controller } from 'react-hook-form';
// import useAdminData from '../hooks/useAdminData';
import {
  Form,
  InputGroup,
  Button,
} from 'react-bootstrap';

const WordForm = (props) => {
  const { addSearch } = props;
  const { handleSubmit, control, formState: { isSubmitSuccessful, errors }, reset } = useForm();

  // const { maxInstances } = useAdminData();

  const onSubmitSearch = data => addSearch({ name: data.word.trim().toLowerCase(), slug: slugify(data.word), nonce: null, status: null });

  useEffect(() => {
    if (isSubmitSuccessful) reset({ word: '' });
  }, [isSubmitSuccessful, reset]);

  return (
    <>
      <h3 className="text-uppercase fw-light form-header">Choose a word to create an <span className="fw-bold">NFT</span></h3>
      <p className="explainer">There are only ten instances of each word.<br />After that, it is no longer available.</p>
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
              render={({ field }) => <Form.Control {...field} size="lg" className="border-dark" />}
            />
            <Button size="lg" variant="outline-dark" type="submit" disabled={false} className="text-uppercase">Find</Button>
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