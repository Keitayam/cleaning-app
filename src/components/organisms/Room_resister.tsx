import {
  Box,
  Container,
  Heading,
  Input,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";

import { useState } from "react";
import { supabase } from "../../supabase.Client";
import { ButtonGroup } from "../atoms/button";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../atoms/backButton";

export const RoomResister = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [active, setActive] = useState<boolean>(false);
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onClickResister = async () => {
    if (!roomNumber) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    const { error } = await supabase
      .from("rooms")
      .insert([{ room_number: roomNumber, is_active: active, note: note }]);

    if (error) {
      setErrorMessage("Registration failed. Please try again.");
      return;
    }

    setErrorMessage("");
    alert("Registration Complete");
    setRoomNumber("");
    setActive(false);
    setNote("");
  };

  const onClickBack = async () => {
    navigate("/home");
  };

  return (
    <>
      <Heading pt="100px" mb="50px">
        RoomResister
      </Heading>
      <Container pb="100px">
        <Heading fontSize="md" mb="50px">
          Please fill in the room details
        </Heading>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">
            Room Number
          </Text>
          <Input
            border="1px solid #fff"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">
            Status
          </Text>
          <Switch.Root checked={active}
            onCheckedChange={(e) => setActive(e.checked)}>
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>
              Active
            </Switch.Label>
          </Switch.Root>
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">
            Note
          </Text>
          <Textarea
            border="1px solid #fff"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Box>
        <Text color="white" mb="10px">
          {errorMessage}
        </Text>
        <ButtonGroup onClick={onClickResister}>Resister New Room</ButtonGroup>
        <BackButton onClickBack={onClickBack}>Back</BackButton>
      </Container>
    </>
  );
};
