import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { setUserDetails } from "../../store/slices/userDetails/userDetailsSlice";
import {
    StyledAuthPage,
    FormItem,
    StyledLabel,
    StyledInput,
    StyledForm,
    StyledButton,
    StyledH1,
    SignupCTA,
} from "./styles";
import { GrHide, BiHide, BiShow } from "react-icons/all";
import AuthService from "../../services/AuthService"

function Login() {
    const { isAuthenticated } = useSelector((state) => state.userDetails);
    let dispatch = useDispatch();
    const toast = useToast();
    let history = useHistory();
    const loginUser = (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        AuthService.loginUser({
            username: fd.get("username"),
            password: fd.get("password"),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                // alert(data.message);
                if (data.success === true) {
                    toast({
                        title: data.message,
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                    dispatch(
                        setUserDetails({
                            isAuthenticated: true,
                            name: data.data.name,
                            email: data.data.email,
                            userId: data.data.userId,
                            profile_pic_uri: data.data.profile_pic_uri,
                            status: data.data.status,
                            username: data.data.username,
                        })
                    );
                } else {
                    toast({
                        title: data.message,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            })
            .catch((err) => {
                console.log("Login error : ", err);
                // Show toast
                toast({
                    duration: 5000,
                    description: `Failed to login ${err}`,
                    status: "error",
                    isClosable: true,
                })
            });

    };
    const goToPage = (path) => {
        history.push(path);
    };
    console.log("Login component isAuthenticated : ", isAuthenticated);
    const [isPasswordHidden, setPasswordHidden] = useState(true);
    const togglePasswordHide = () => {
        setPasswordHidden((curr) => !curr);
    };
    return (
        <StyledAuthPage>
            <StyledForm onSubmit={loginUser}>
                <StyledH1>login</StyledH1>
                <FormItem>
                    <StyledLabel htmlFor="username">Username</StyledLabel>
                    <StyledInput type="text" name="username" id="username" required={true} />
                </FormItem>
                <FormItem>
                    <StyledLabel htmlFor="password">Password</StyledLabel>
                    <div className="flex relative">
                        <StyledInput
                            type={isPasswordHidden ? "password" : "text"}
                            name="password"
                            id="password"
                            required={true}
                        />
                        {isPasswordHidden ? (
                            <BiShow size={"22px"} onClick={togglePasswordHide} className="absolute right-2 top-1.5" />
                        ) : (
                            <BiHide size={"22px"} onClick={togglePasswordHide} className="absolute right-2 top-1.5" />
                        )}
                    </div>
                </FormItem>
                <SignupCTA>
                    Don't have an account? <span onClick={() => goToPage("/signup")}>Signup</span> now
                </SignupCTA>
                <StyledButton type="submit">Login</StyledButton>
            </StyledForm>
        </StyledAuthPage>
    );
}

export default Login;
