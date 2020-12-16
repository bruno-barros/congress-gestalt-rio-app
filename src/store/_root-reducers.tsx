import {reducer as reducerForm} from "redux-form";
import {combineReducers} from 'redux'
import {formPluginReducer} from "./form.reducer";
import userReducer from "./user.reducer";
import uiReducer from "./ui.reducer";


const rootReducers = combineReducers({
  user: userReducer,
  ui: uiReducer,
  form: reducerForm.plugin(formPluginReducer),

})

export default rootReducers;
