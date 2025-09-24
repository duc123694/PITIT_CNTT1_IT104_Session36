import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { State } from "../actions/task.action";
import axios from "axios";

const reducer = createSlice({
    name: "reducer",
    initialState: {name: "", priority: "", completion: false},
    reducers: {
        getInputValue: (state, action: PayloadAction<{field: keyof State, value: string | boolean}>) => {
            state[action.payload.field] = action.payload.value;
        },
        addTask: (state, action) => {
            axios.post("http://localhost:3000/tasks", action.payload);
        },
    }

})
export const {getInputValue, addTask} = reducer.actions;
export default reducer;