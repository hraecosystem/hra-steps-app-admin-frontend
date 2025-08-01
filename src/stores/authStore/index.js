import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosIns from "plugins/axios";

const initialState = {
        isAuth: false,
        accessToken: null,
        refreshToken: null,
        user: null,
};

export const login = createAsyncThunk("auth/loginAdmin", async ({ email, password }, thunkAPI) => {
        try {
                const res = await axiosIns.post("auth/loginAdmin", { email, password });
                return res.data;
        } catch (err) {
                return thunkAPI.rejectWithValue(err.response?.data || "Login failed");
        }
});



export const isAuth = createAsyncThunk("auth/isAuth", async (_, thunkAPI) => {
        const state = thunkAPI.getState().auth;
        if (state.isAuth && state.accessToken && state.refreshToken) {
                return {
                        user: state.user,
                        accessToken: state.accessToken,
                        refreshToken: state.refreshToken
                };
        }

        const storageRefresh = localStorage.getItem("refreshToken")
        const storageAccess = localStorage.getItem("accessToken")

        if ((state.refreshToken || storageRefresh) && storageAccess) {
                try {
                        const { data } = await axiosIns.post("auth/refresh", {
                                refreshToken: state.refreshToken ?? storageRefresh,
                        }, {
                                headers: {
                                        Authorization: `Bearer ${storageAccess}`
                                }
                        });
                        return data
                } catch (error) {
                        return thunkAPI.rejectWithValue(false)
                }
        }

        return thunkAPI.rejectWithValue(false)
});


const authStore = createSlice({
        name: "auth",
        initialState,
        reducers: {
                setAuth: (state, action) => {
                        const data = action.payload;
                        if (data) {
                                state.isAuth = true;
                                state.user = data.user;
                                state.accessToken = data.accessToken;
                                state.refreshToken = data.refreshToken;
                                localStorage.setItem("user", JSON.stringify(data.user))
                                localStorage.setItem("accessToken", data.accessToken)
                                localStorage.setItem("refreshToken", data.refreshToken)
                        } else {
                                state.isAuth = false;
                                state.user = null;
                                state.accessToken = null;
                                state.refreshToken = null;
                                axiosIns.defaults.headers.common['Authorization'] = ``;
                                localStorage.removeItem("user")
                                localStorage.removeItem("accessToken")
                                localStorage.removeItem("refreshToken")
                        }
                },
                logout: (state) => {
                        state.isAuth = false;
                        state.user = null;
                        state.accessToken = null;
                        state.refreshToken = null;
                        axiosIns.defaults.headers.common['Authorization'] = ``;
                        localStorage.removeItem("user")
                        localStorage.removeItem("accessToken")
                        localStorage.removeItem("refreshToken")
                },
        },
        extraReducers: (builder) => {
                builder
                        .addCase(login.pending, (state) => {
                                // state.loading = true;
                                // state.error = null;
                        })
                        .addCase(login.fulfilled, (state, action) => {
                                authStore.caseReducers.setAuth(state, action)
                        })
                        .addCase(login.rejected, (state, action) => {
                                authStore.caseReducers.setAuth(state, { payload: null })
                        });

                builder
                        .addCase(isAuth.pending, (state) => {
                                // state.loading = true;
                        })
                        .addCase(isAuth.fulfilled, (state, action) => {
                                authStore.caseReducers.setAuth(state, action)
                        })
                        .addCase(isAuth.rejected, (state, action) => {
                                authStore.caseReducers.setAuth(state, { payload: null })
                        });
        }
});

export const { setAuth, logout } = authStore.actions;
export default authStore.reducer;
