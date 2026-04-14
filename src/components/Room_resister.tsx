import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Portal,
  Select,
  Text,
} from "@chakra-ui/react";
import { createListCollection } from "@chakra-ui/react";
import { useState } from "react";
import { supabase } from "../supabase.Client";
import { ButtonGroup } from "./atoms/button";
import { useNavigate } from "react-router-dom";

const roles = createListCollection({
  items: [
    { label: "Admin", value: "admin" },
    { label: "Staff", value: "staff" },
  ],
});

export const RoomResister = () => {
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onClickResister = async () => {
    if (!userName || !password || !role) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    const { error } = await supabase
      .from("users")
      .insert([
        { name: name, login_id: userName, password: password, role: role },
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
      <Heading pt="100px" mb="50px">RoomResister</Heading>
      <Container pb="100px">
        <Heading fontSize="md" mb="50px">Resister details</Heading>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">Name</Text>
          <Input border="1px solid #fff" value={name} onChange={(e) => setName(e.target.value)} />
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">Username</Text>
          <Input border="1px solid #fff"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">Password</Text>
          <Input border="1px solid #fff"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
              <Select.Trigger border="1px solid #fff">
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
        <Button color="white" bg="transparent" mb="20px" onClick={onClickBack}>Back</Button>
        <Text color="white" mb="10px">{errorMessage}</Text>
        <ButtonGroup onClick={onClickResister}>Resister New Room</ButtonGroup>
      </Container>
    </>
  );
};
