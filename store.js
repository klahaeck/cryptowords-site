import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

const initialState = {
  menuCategories: [],
  nearestLocation: null,
  selectedCategorySlug: null,
  buildAMealCategories: [],
  buildAMealItems: []
};

export const actionTypes = {
  SET_MENU_CATEGORIES: 'SET_MENU_CATEGORIES',
  SET_NEAREST_LOCATION: 'SET_NEAREST_LOCATION',
  SET_SELECTED_CATEGORY_SLUG: 'SET_SELECTED_CATEGORY_SLUG',
  ADD_BUILD_A_MEAL_CATEGORY: 'ADD_BUILD_A_MEAL_CATEGORY',
  ADD_BUILD_A_MEAL_ITEM: 'ADD_BUILD_A_MEAL_ITEM',
  REMOVE_BUILD_A_MEAL_ITEM: 'REMOVE_BUILD_A_MEAL_ITEM'
};

// REDUCERS
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MENU_CATEGORIES:
      return Object.assign({}, state, {
        menuCategories: action.menuCategories
      });
    case actionTypes.SET_NEAREST_LOCATION:
      return Object.assign({}, state, {
        nearestLocation: action.nearestLocation
      });
    case actionTypes.SET_SELECTED_CATEGORY_SLUG:
      return Object.assign({}, state, {
        selectedCategorySlug: action.selectedCategorySlug
      });
    case actionTypes.ADD_BUILD_A_MEAL_CATEGORY:
      return Object.assign({}, state, {
        buildAMealCategories: [...state.buildAMealCategories, action.newBuildAMealCategory]
      });
    case actionTypes.ADD_BUILD_A_MEAL_ITEM:
      return Object.assign({}, state, {
        buildAMealItems: [...state.buildAMealItems, action.newBuildAMealItem]
      });
    case actionTypes.REMOVE_BUILD_A_MEAL_ITEM:
      return Object.assign({}, state, {
        buildAMealItems: state.buildAMealItems.filter(item => item !== action.buildAMealItem)
      });
    default:
      return state
  }
};

// ACTIONS
export const setMenuCategories = menuCategories => {
  return { type: actionTypes.SET_MENU_CATEGORIES, menuCategories }
};
export const setNearestLocation = nearestLocation => {
  return { type: actionTypes.SET_NEAREST_LOCATION, nearestLocation }
};
export const setSelectedCategorySlug = selectedCategorySlug => {
  return { type: actionTypes.SET_SELECTED_CATEGORY_SLUG, selectedCategorySlug }
};
export const addBuildAMealCategory = newBuildAMealCategory => {
  return { type: actionTypes.ADD_BUILD_A_MEAL_CATEGORY, newBuildAMealCategory }
};
export const addBuildAMealItem = newBuildAMealItem => {
  return { type: actionTypes.ADD_BUILD_A_MEAL_ITEM, newBuildAMealItem }
};
export const removeBuildAMealItem = buildAMealItem => {
  return { type: actionTypes.REMOVE_BUILD_A_MEAL_ITEM, buildAMealItem }
};

export function initializeStore (_initialState = initialState) {
  return createStore(reducer, _initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
}