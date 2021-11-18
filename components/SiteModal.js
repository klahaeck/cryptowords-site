import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideModal } from '../store/root/reducer';
import {
  Modal
} from 'react-bootstrap';

const SiteModal = (props) => {
  const { modal, hideModal, className } = props;
  return (
    <Modal show={modal.body} onHide={hideModal} size={modal.size || 'md'} className={modal.className || className}>
      {modal.header && <Modal.Header closeButton>
        <Modal.Title>{modal.header}</Modal.Title>
      </Modal.Header>}
      <Modal.Body className={modal.className}>{modal.body}</Modal.Body>
      {modal.footer && <Modal.Footer>{modal.footer}</Modal.Footer>}
    </Modal>
  );
};

const mapStateToProps = (state) => {
  const { modal } = state.root;
  return { modal };
};
const mapDispatchToProps = (dispatch) => ({
  hideModal: bindActionCreators(hideModal, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SiteModal);