import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export type Task = {
  id: number;
  name: string;
  priority: string;
  completion: boolean;
};

const reducer = createSlice({
  name: "tackManager",
  initialState: { tasks: [] as Task[] },
  reducers: {
    changeCompletion: (state, action: PayloadAction<{ id: number; value: boolean }>) => {
      axios.patch(`http://localhost:3000/tasks/${action.payload.id}`, {
        completion: action.payload.value,
      });
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.completion = action.payload.value;
      }
    },
    deleteTask: (state, action: PayloadAction<number>) => {
      axios.delete(`http://localhost:3000/tasks/${action.payload}`);
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    editTask: (state, action: PayloadAction<Task>) => {
      axios.patch(`http://localhost:3000/tasks/${action.payload.id}`, {
        name: action.payload.name,
        priority: action.payload.priority,
        completion: action.payload.completion,
      });
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
  },
});

export const { changeCompletion, deleteTask, editTask } = reducer.actions;
export default reducer;