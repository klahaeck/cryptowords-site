import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  removeToast,
} from '../store/root/reducer';
import {
  ToastContainer,
  Toast,
} from 'react-bootstrap';

const Toasts = ({ toasts, removeToast }) => {
  return (
    <ToastContainer className="p-3 mt-5" position="top-end">
      {toasts.map((toast, index) => (
        <Toast key={index} bg={toast.bg} onClose={() => removeToast(index)} delay={5000} autohide>
          <Toast.Header>
            <strong className="me-auto">{toast.header}</strong>
            {/* <small className="text-muted">just now</small> */}
          </Toast.Header>
          <Toast.Body>{toast.body}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

const mapStateToProps = (state) => ({
  toasts: state.root.toasts,
});
const mapDispatchToProps = (dispatch) => ({
  removeToast: bindActionCreators(removeToast, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Toasts);