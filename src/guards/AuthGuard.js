import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { isAuth } from "stores/authStore";

const AuthGuard = ({ children }) => {
        const navigate = useNavigate();
        const auth = useSelector((state) => state.auth)
        const dispatch = useDispatch()
        
        const checkAuth = async () => {
                const result =  await dispatch(isAuth());
                if (!auth.isAuth) {
                        navigate("/authentication/sign-in", { replace: true });
                }
        }

        useEffect(() => {
                checkAuth()
        }, [])

        if (!auth.isAuth) {
                return null;
        }

        return children
}

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthGuard;