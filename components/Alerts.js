import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  removeAlert,
} from '../store/root/reducer';
import {
  Alert,
} from 'react-bootstrap';

const Alerts = (props) => {
  const { alerts, removeAlert, position, dismissible = true } = props;

  return (
    <>
      {alerts.filter(alert => alert.position === position).map((alert, index) => <Alert key={index} variant={alert.color} onClose={() => removeAlert(index)} dismissible={dismissible}>{alert.msg}</Alert>)}
    </>
  );
};

const mapStateToProps = (state) => ({
  alerts: state.root.alerts,
});
const mapDispatchToProps = (dispatch) => ({
  removeAlert: bindActionCreators(removeAlert, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);