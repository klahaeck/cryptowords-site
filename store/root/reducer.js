export const rootActionTypes = {
  SET_WALLET_CAPABLE: 'SET_WALLET_CAPABLE',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  ADD_ALERT: 'ADD_ALERT',
  REMOVE_ALERT: 'REMOVE_ALERT',
  ADD_SEARCH: 'ADD_SEARCH',
  REMOVE_SEARCH: 'REMOVE_SEARCH',
  SET_SEARCHES: 'SET_SEARCHES',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL'
};

const rootInitialState = {
  walletCapable: false,
  toasts: [],
  alerts: [],
  searches: [],
  modal: {}
};

// ACTIONS
export const setWalletCapable = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_WALLET_CAPABLE, payload });
};
export const addToast = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.ADD_TOAST, payload });
};
export const removeToast = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.REMOVE_TOAST, payload });
};
export const addAlert = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.ADD_ALERT, payload });
};
export const removeAlert = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.REMOVE_ALERT, payload });
};
export const addSearch = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.ADD_SEARCH, payload });
};
export const removeSearch = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.REMOVE_SEARCH, payload });
};
export const setSearches = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_SEARCHES, payload });
};
export const showModal = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SHOW_MODAL, payload });
};
export const hideModal = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.HIDE_MODAL, payload });
};

export default function reducer(state = rootInitialState, action) {
  switch (action.type) {
    case rootActionTypes.SET_WALLET_CAPABLE:
      return { ...state, walletCapable: action.payload };
    case rootActionTypes.ADD_TOAST:
      return {...state, toasts: [action.payload, ...state.toasts]};
    case rootActionTypes.ADD_ALERT:
      return {...state, alerts: [action.payload, ...state.alerts]};
    case rootActionTypes.REMOVE_TOAST:
      return {...state, toasts: state.toasts.filter((item, index) => index !== action.payload)};
    case rootActionTypes.REMOVE_ALERT:
      return {...state, alerts: state.alerts.filter((item, index) => index !== action.payload)};
    case rootActionTypes.ADD_SEARCH:
      const existingSearch = state.searches.filter((item) => item.name == action.payload.name);
      if (existingSearch.length) {
        return {...state, searches: [existingSearch[0], ...state.searches.filter(item => item.name !== action.payload.name)]};
      } else {
        return {...state, searches: [action.payload, ...state.searches]};
      }
    case rootActionTypes.REMOVE_SEARCH:
      return {...state, searches: state.searches.filter(item => item.name !== action.payload)};
    case rootActionTypes.SET_SEARCHES:
      return {...state, searches: action.payload};
    case rootActionTypes.SHOW_MODAL:
      return {...state, modal: action.payload};
    case rootActionTypes.HIDE_MODAL:
      return {...state, modal: {}};
    default:
      return state;
  }
}