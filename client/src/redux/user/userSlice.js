import { createSlice } from "@reduxjs/toolkit";

// Initial state for the user slice
const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

// Create a Redux slice for user-related actions and state
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action for starting the sign-in process
    signInStart: (state) => {
      state.loading = true;
    },
    // Action for successful sign-in
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Action for sign-in failure
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Action for starting the user update process
    updateUserStart: (state) => {
      state.loading = true;
    },
    // Action for successful user update
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Action for user update failure
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Action for starting the user deletion process
    deleteUserStart: (state) => {
      state.loading = true;
    },
    // Action for successful user deletion
    deleteUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    // Action for user deletion failure
    deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    // Action for starting the user sign-out process
    signOutUserStart: (state) => {
      state.loading = true;
    },
    // Action for successful user sign-out
    signOutUserSuccess: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    // Action for user sign-out failure
    signOutUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} = userSlice.actions;
// Reducer
export default userSlice.reducer;
