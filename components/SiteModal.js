import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { hideModal } from '../store/root/reducer';
import {
  Modal
} from 'react-bootstrap';

const SiteModal = (props) => {
  const { modal, hideModal } = props;
  return (
    <Modal show={modal.body} onHide={hideModal} size="lg" centered>
      {modal.header && <Modal.Header closeButton>
        <Modal.Title>{modal.header}</Modal.Title>
      </Modal.Header>}
      <Modal.Body>{modal.body}</Modal.Body>
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