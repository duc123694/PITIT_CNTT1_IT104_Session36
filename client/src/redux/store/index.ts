import { configureStore } from "@reduxjs/toolkit";
import reducer from "../slice/taskManager.slice";
import tackManager from "../slice/tackManagerArray.slice"

const store = configureStore({
  reducer: {
    task: reducer.reducer,
    tackManager: tackManager.reducer,
  },
});
export default store;