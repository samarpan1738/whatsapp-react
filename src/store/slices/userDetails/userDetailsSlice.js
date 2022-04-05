import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import UserService from "../../../services/UserService";

export const persistUserDetails = createAsyncThunk("userDetails/persistUserDetails", async ({ username, status }, thunkApi) => {
    try {
        const res = await UserService.updateUserStatus(username, {
            status,
        });
        const data = await res.json();
        console.log("data : ", data);
        if (data.success) {
            return data.data;
        } else {
            thunkApi.rejectWithValue("Unable to update user details");
        }
    } catch (error) {
        thunkApi.rejectWithValue("Error updating user details");
    }
});
export const userDetailsSlice = createSlice({
    name: "userDetails",
    initialState: {
        isAuthenticated: false,
        tokenExpired: false,
    },
    reducers: {
        setUserDetails: (state, action) => {
            state = { ...state, ...action.payload };
            return state;
        },
    },
    extraReducers: (builder) => {
        //* For addConversation thunk
        builder.addCase(persistUserDetails.pending, (state, action) => {
            console.log("userDetails/persistUserDetails");
        });
        builder.addCase(persistUserDetails.fulfilled, (state, action) => {
            console.log("userDetails/persistUserDetails");
            console.log(action.payload);
            state = { ...state, ...action.payload };
            return state;
        });
        builder.addCase(persistUserDetails.rejected, (state, action) => {
            console.log("userDetails/persistUserDetails");
            // Rejected with thunkAPI.rejectWithValue
            console.log(action.payload);
        });
    },
});

// Action creators are generated for each case reducer function
export const { setUserDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;
