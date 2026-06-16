import {
  Box,
  Container,
  Heading,
  Input,
  Portal,
  Select,
  Text,
} from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "../../supabase.Client";
import { ButtonGroup } from "../atoms/button";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../atoms/backButton";

const roles = createListCollection({
  items: [
    { label: "Admin", value: "admin" },
    { label: "Staff", value: "staff" },
  ],
});

export const UserResister = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  
  const [password, setPassword] = useState({
    lengthCheck: false,
    patternCheck: false,
    input: "",
  });

  const checkPassword = (e:React.ChangeEvent<HTMLInputElement>)=> {
    const value = e.target.value;

    const lengthCheck = value.length >= 8;
    const patternCheck = /[A-Z]/.test(value) && /[0-9]/.test(value);
  
    setPassword({lengthCheck,patternCheck,input:value });
    
  }

  const onClickResister = async () => {
    if (!userName || !password.input || !role) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (!password.lengthCheck || !password.patternCheck) {
      setErrorMessage("Please follow the password requirements.");
      return;
    }

    const { error } = await supabase
      .from("users")
      .insert([
        { name: name, login_id: userName, password: password.input, role: role },
      ]);

    if (error) {
      setErrorMessage("Registration failed. Please try again.");
      return;
    }

    setErrorMessage("");
    alert("Registration Complete");
    navigate("/")
  };
  
  const onClickBack = async () => {
    navigate("/home")
  };

  return (
    <>
      <Heading pt="100px" mb="50px" data-testId="title">User Resister Page</Heading>
      <Container pb="100px">
        <Heading fontSize="md" mb="50px">Resister details</Heading>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">Name</Text>
          <Input border="1px solid #fff" data-testId="name" value={name} onChange={(e) => setName(e.target.value)} />
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">Username</Text>
          <Input border="1px solid #fff"
          data-testId="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">Password</Text>
          <Input border="1px solid #fff"
          data-testId="password"
            value={password.input}
            onChange={checkPassword}
            />
            {!password.patternCheck && <p>※Please include uppercase letters and numbers.</p>}
            {!password.lengthCheck && <p>※Please use at least 8 characters.</p>}
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">Role</Text>
          <Select.Root
            collection={roles}
            size="sm"
            mx="auto"
            onValueChange={(e) => setRole(e.value[0])}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger border="1px solid #fff"  data-testId="role-trigger">
                <Select.ValueText placeholder="Select role" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  {roles.items.map((role) => (
                    <Select.Item item={role} key={role.value}>
                      {role.label}
                      <Select.ItemIndicator />
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
        </Box>
        <Text color="white" mb="10px">{errorMessage}</Text>
        <ButtonGroup onClick={onClickResister}>Resister New User</ButtonGroup>
        <BackButton onClickBack={onClickBack}>Back</BackButton>
      </Container>
    </>
  );
};
