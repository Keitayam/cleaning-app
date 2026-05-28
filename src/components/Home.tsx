import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { ButtonGroup } from "./atoms/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const {user,logout} = useAuth();
  const navigate = useNavigate();

  const onClickCleaningStatus = () => {
    navigate("/rooms_status")
  };

  const onClickUserRegistration = () => {
    navigate("/user_resister");
  };

  const onClickRoomRegistration = () => {
    navigate("/room_resister");
  };

  const onClickSignout = () => {
    logout();
    navigate("/")
  };
  return (
    <>
      <Container h="100vh">
        <Heading pt="100px" mb="50px">Cleaning App Home</Heading>
        <Text mb="100px" textAlign="right">Login name: {user?.name}</Text>
        <Box display="flex" flexDirection="column" width="25%" mx={"auto"} gap={10}>
          <ButtonGroup onClick={onClickCleaningStatus}>Rooms Status</ButtonGroup>
          {user?.role ==="admin" &&(
            <ButtonGroup onClick={onClickUserRegistration}>New User Registration</ButtonGroup>
          )}
          {user?.role ==="admin" &&(
            <ButtonGroup onClick={onClickRoomRegistration}>New Room Registration</ButtonGroup>
          )}
          <ButtonGroup onClick={onClickSignout}>Sign out</ButtonGroup>       
        </Box>
      </Container>
    </>
  );
};
