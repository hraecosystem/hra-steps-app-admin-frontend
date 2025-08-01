import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { isAuth } from "stores/authStore";

const GuestGuard = ({ children }) => {
        const navigate = useNavigate();
        const auth = useSelector((state) => state.auth)
        const dispatch = useDispatch()

        const checkAuth = async () => {
                await dispatch(isAuth());
                
                if (auth.isAuth) {
                        navigate("/", { replace: true });
                }
        }

        useEffect(() => {
                checkAuth()
        }, [])

        if (auth.isAuth) {
                return null;
        }

        return children
}

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestGuard;