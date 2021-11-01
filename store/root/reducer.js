export const rootActionTypes = {
  SET_CONTRACT: 'SET_CONTRACT',
  SET_IS_ADMIN: 'SET_IS_ADMIN',
  SET_SEARCHING: 'SET_SEARCHING',
  SET_TOTAL_WORDS: 'SET_TOTAL_WORDS',
  SET_PAUSED: 'SET_PAUSED',
  SET_DEFAULT_PRICE: 'SET_DEFAULT_PRICE',
  SET_DISCOUNT_PERCENTAGE: 'SET_DISCOUNT_PERCENTAGE',
  SET_BALANCE: 'SET_BALANCE',
  ADD_TOAST: 'ADD_TOAST',
  ADD_ALERT: 'ADD_ALERT',
  ADD_RECENT_SEARCH: 'ADD_RECENT_SEARCH',
  REMOVE_TOAST: 'REMOVE_TOAST',
  REMOVE_ALERT: 'REMOVE_ALERT',
  REMOVE_RECENT_SEARCH: 'REMOVE_RECENT_SEARCH',
  SET_RECENT_SEARCHES: 'REMOVE_RECENT_SEARCHES',
  SET_CURRENT_SEARCH: 'SET_CURRENT_SEARCH',
  SET_RECENT_WORDS: 'SET_RECENT_WORDS',
  SET_OWNED_WORDS: 'SET_OWNED_WORDS'
};

const rootInitialState = {
  contract: undefined,
  isAdmin: false,
  searching: false,
  totalWords: 0,
  paused: false,
  defaultPrice: 0.2,
  discountPercentage: 50,
  balance: 0,
  toasts: [],
  alerts: [],
  currentSearch: null,
  recentSearches: [],
  recentWords: [],
  ownedWords: []
};

// ACTIONS
export const setContract = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_CONTRACT, payload });
};
export const setIsAdmin = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_IS_ADMIN, payload });
};
export const setSearching = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_SEARCHING, payload });
};
export const setTotalWords = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_TOTAL_WORDS, payload });
};
export const setPaused = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_PAUSED, payload });
};
export const setDefaultPrice = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_DEFAULT_PRICE, payload });
};
export const setDiscountPercentage = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_DISCOUNT_PERCENTAGE, payload });
};
export const setBalance = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_BALANCE, payload });
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
export const addRecentSearch = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.ADD_RECENT_SEARCH, payload });
};
export const removeRecentSearch = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.REMOVE_RECENT_SEARCH, payload });
};
export const setRecentSearches = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_RECENT_SEARCHES, payload });
};
export const setCurrentSearch = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_CURRENT_SEARCH, payload });
};
export const setRecentWords = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_RECENT_WORDS, payload });
};
export const setOwnedWords = (payload) => (dispatch) => {
  return dispatch({ type: rootActionTypes.SET_OWNED_WORDS, payload });
};

export default function reducer(state = rootInitialState, action) {
  let existingRecentSearch;

  switch (action.type) {
    case rootActionTypes.SET_CONTRACT:
      return {...state, contract: action.payload};
    case rootActionTypes.SET_IS_ADMIN:
      return {...state, isAdmin: action.payload};
    case rootActionTypes.SET_SEARCHING:
      return {...state, searching: action.payload};
    case rootActionTypes.SET_TOTAL_WORDS:
      return {...state, totalWords: action.payload};
    case rootActionTypes.SET_PAUSED:
      return {...state, paused: action.payload};
    case rootActionTypes.SET_DEFAULT_PRICE:
      return {...state, defaultPrice: action.payload};
    case rootActionTypes.SET_DISCOUNT_PERCENTAGE:
      return {...state, discountPercentage: action.payload};
    case rootActionTypes.SET_BALANCE:
      return {...state, balance: action.payload};
    case rootActionTypes.ADD_TOAST:
      return {...state, toasts: [action.payload, ...state.toasts]};
    case rootActionTypes.ADD_ALERT:
      return {...state, alerts: [action.payload, ...state.alerts]};
    case rootActionTypes.ADD_RECENT_SEARCH:
      return {...state, recentSearches: [action.payload, ...state.recentSearches]};
    case rootActionTypes.REMOVE_TOAST:
      return {...state, toasts: state.toasts.filter((item, index) => index !== action.payload)};
    case rootActionTypes.REMOVE_ALERT:
      return {...state, alerts: state.alerts.filter((item, index) => index !== action.payload)};
    case rootActionTypes.REMOVE_RECENT_SEARCH:
      return {...state, recentSearches: state.recentSearches.filter((item) => item.name !== action.payload.name)};
    case rootActionTypes.SET_RECENT_SEARCHES:
      return {...state, recentSearches: action.payload};
    case rootActionTypes.SET_CURRENT_SEARCH:
      if (action.payload) {
        let newRecentSearches = state.recentSearches;
        if (state.currentSearch && state.currentSearch.name !== action.payload?.name.toLowerCase()) {
          newRecentSearches = [state.currentSearch, ...newRecentSearches]
        }

        existingRecentSearch = newRecentSearches.filter(rs => rs.name === action.payload?.name.toLowerCase());
        if (existingRecentSearch.length) {
          return {...state, currentSearch: existingRecentSearch[0], recentSearches: [...newRecentSearches.filter(rs => rs.name !== existingRecentSearch[0].name)]};
        } else {
          return {...state, currentSearch: action.payload, recentSearches: newRecentSearches};
        }
      } else {
        return {...state, currentSearch: action.payload};
      }
    case rootActionTypes.SET_RECENT_WORDS:
      return {...state, recentWords: action.payload};
    case rootActionTypes.SET_OWNED_WORDS:
      return {...state, ownedWords: action.payload};
    default:
      return state
  }
}