import {createStore} from "redux"

import reducers from "../reducer/Reducers";

const store =createStore(reducers);

export default store;