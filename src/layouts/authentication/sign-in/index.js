import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";

import { login } from "../../../stores/authStore";

function Basic() {
  const [loginData, setLoginData] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await dispatch(
        login({
          email: loginData,
          password: password,
        })
      );

      if (result?.meta?.requestStatus === "fulfilled") {
        navigate("/", { replace: true });
      } else {
        // adapt based on how your thunk returns errors
        const payload = result.payload;
        let message = "Login failed. Please check your credentials.";
        if (payload) {
          if (typeof payload === "string") message = payload;
          else if (payload.message) message = payload.message;
          else if (payload.error) message = payload.error;
        }
        setError(message);
      }
    } catch (e) {
      setError(
        (e && e.message) || "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              {error && (
                <Alert severity="error" sx={{ mb: 1 }}>
                  {error}
                </Alert>
              )}
              <MDInput
                value={loginData}
                onChange={(e) => setLoginData(e.target.value)}
                type="email"
                label="Email"
                fullWidth
                disabled={loading}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                label="Password"
                fullWidth
                disabled={loading}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <MDBox display="flex" alignItems="center" justifyContent="center" gap={1}>
                    <CircularProgress size={18} />
                    <MDTypography variant="button">Signing in...</MDTypography>
                  </MDBox>
                ) : (
                  "sign in"
                )}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
