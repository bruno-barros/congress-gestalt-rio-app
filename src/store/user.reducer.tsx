import {USER_ACTYPE} from './user.actions'
const init = {};
const userReducer = (state = init, action) => {

  if (action.type === USER_ACTYPE.LOGIN || action.type === USER_ACTYPE.UPDATED) {
    return {
      ...state,
      ...action.payload
    }
  }
  else if (action.type === USER_ACTYPE.CART_UPDATED) {
    return {
      ...state,
      cart: action.payload
    }
  }

  return state;
}

export default userReducer
