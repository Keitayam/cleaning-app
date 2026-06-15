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
  const [hide, setHide] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onClickResister = async () => {
    if (!roomNumber) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    const { error } = await supabase
      .from("rooms")
      .insert([{ room_number: roomNumber, is_active: active, note: note, hide: hide }]);

    if (error) {
      if (error.code === "23505") {
        // ユニーク制約違反（23505） → 重複エラー
        setErrorMessage("This room number is already registered");
        return;
      }
      setErrorMessage("Registration failed. Please try again.");
      return;
    }

    setErrorMessage("");
    alert("Registration Complete");
    setRoomNumber("");
    setActive(false);
    setNote("");
    setHide(false);
  };

  const onClickBack = async () => {
    navigate("/home");
  };

  return (
    <>
      <Heading pt="100px" mb="50px" data-testId="title">
        Room Resister Page
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
            data-testId="roomNumber"
          />
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">
            Status
          </Text>
          <Box width="50%" mx="auto" mb="30px">

          <Switch.Root checked={active}
            onCheckedChange={(e) => setActive(e.checked)}>
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>
              Occupied
            </Switch.Label>
          </Switch.Root>
          </Box>
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">
            Note
          </Text>
          <Textarea
            border="1px solid #fff"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            data-testId="note"
          />
        </Box>
        <Box width="50%" mx="auto" mb="30px">
          <Text color="white" mb="10px" textAlign="left">
            Hide
          </Text>
          <Switch.Root checked={hide}
            onCheckedChange={(e) => setHide(e.checked)}>
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label>
             Hide
            </Switch.Label>
          </Switch.Root>
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
