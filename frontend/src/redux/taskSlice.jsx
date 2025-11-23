import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { getState }) => {
    console.log("fetchTasks called");
    const { auth } = getState();
    const userId = auth.user?._id;
    console.log("userId", userId);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { data } = await axios.get(`${`https://task-manager-be-seven.vercel.app`}/api/tasks/fetchall?userId=${userId}`, {
      headers: { Authorization: `Bearer ${auth.token || ""}` },
    });
    console.log(data);
    if (!data || data.length === 0) {
      console.log("No data");
    }
    return data;
  }
);

export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { data } = await axios.post(
      `${`https://task-manager-be-seven.vercel.app`}/api/tasks/create?userId=${userId}`,
      { ...taskData, userId },
      {
        headers: { Authorization: `Bearer ${auth.token || ""}` },
      }
    );
    return data;
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async (taskData, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { data } = await axios.put(
      `${`https://task-manager-be-seven.vercel.app`}/api/tasks/update/${taskData._id}`,
      taskData,
      {
        headers: { Authorization: `Bearer ${auth.token || ""}` },
      }
    );
    return data;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?._id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    await axios.delete(`${`https://task-manager-be-seven.vercel.app`}/api/tasks/delete/${taskId}`, {
      headers: { Authorization: `Bearer ${auth.token || ""}` },
    });
    return taskId;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: { list: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        console.error(action.error.message);
      })
      
      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.push(action.payload);
        state.loading = false;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        console.error(action.error.message);
      })

      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        const index = state.list.findIndex((task) => task._id === updatedTask._id);
        if (index !== -1) {
          state.list[index] = updatedTask;
        }
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        console.error(action.error.message);
      })

      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload;
        state.list = state.list.filter((task) => task._id !== taskId);
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        console.error(action.error.message);
      });
  },
});

export default taskSlice.reducer;