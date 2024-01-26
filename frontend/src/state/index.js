import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
};
export const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
    },
  },
});

export const { setLogin, setLogout } = globalSlice.actions;

export default globalSlice.reducer;
