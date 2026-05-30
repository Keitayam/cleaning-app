import { Box, Container, Heading, Input, Text } from "@chakra-ui/react";
import { supabase } from "../../supabase.Client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonGroup } from "../atoms/button";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

  const [isRevealPassword, setIsRevealPassword] = useState(false);

  const togglePassword = () => {
    setIsRevealPassword(!isRevealPassword);
  };

  const onClickLogin = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("login_id", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      setErrorMessage("Invalid userid or password");
      setLoading(false);
      return;
    }
    login({ name: data.name, login_id: data.login_id, role: data.role });
    navigate("/home");
  };

  return (
    <>
      <Container
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Heading mb="20px" data-testid="title">Cleaning App for Motel</Heading>
        <Box display="flex" flexDirection="column" gap="10px">
          <Heading>Login from here</Heading>
          <Input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <Box position="relative">
            <Input
              type={isRevealPassword ? "text" : "password"}
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={togglePassword}
              role="presentation"
              style={{
                cursor: "pointer",
                left: "auto",
                position: "absolute",
                right: "10px",
                top: "10px",
              }}
            >
              {isRevealPassword ? (
                <FontAwesomeIcon icon={faEye} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} />
              )}
            </span>
          </Box>
          <Text color="red">{errorMessage}</Text>
          <ButtonGroup onClick={onClickLogin} loading={loading}>
            Login
          </ButtonGroup>
        </Box>
      </Container>
    </>
  );
};
