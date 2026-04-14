import { Box, Container, Heading, Input, Text } from "@chakra-ui/react";
import { supabase } from "../supabase.Client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ButtonGroup } from "./atoms/button";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const {login} = useAuth();

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
    login({name: data.name, login_id:data.login_id, role:data.role});
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
        <Heading mb="20px">Cleaning App for Motel</Heading>
        <Box display="flex" flexDirection="column" gap="10px">
          <Heading>Login from here</Heading>
          <Input
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Text color="red">{errorMessage}</Text>
          <ButtonGroup onClick={onClickLogin} loading={loading}>
            Login
          </ButtonGroup>
        </Box>
      </Container>
    </>
  );
};
