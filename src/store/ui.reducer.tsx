import {UI_ACTYPE} from "./ui.actions";

const init = {
  blockui: false
}

const UiReducer = (state = init, action) => {
  if(action.type === UI_ACTYPE.BLOCKUI){
    return {
      ...state,
      blockui: action.payload
    }
  }
  return state;
}

export default UiReducer
