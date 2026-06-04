import {
  Box,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Heading,
  Input,
  Portal,
  Spinner,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { supabase } from "../../supabase.Client";
import { useEffect, useState } from "react";
import { BackButton } from "../atoms/backButton";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ButtonGroup } from "../atoms/button";

type Room = {
  id: string;
  room_number: number;
  is_active: boolean;
  note: string;
};

export const Rooms_details = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [roomUpdateNumber, setRoomUpdateNumber] = useState<number>(
    room?.room_number || 0,
  );
  const [activeUpdate, setActiveUpdate] = useState<boolean>(
    room?.is_active || false,
  );
  const [noteUpdate, setNoteUpdate] = useState<string>(room?.note || "");

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
        setErrorMessage("Error fetching rooms");
        return;
      }
      setRoom(data);
      setRoomUpdateNumber(data.room_number);
      setActiveUpdate(data.is_active);
      setNoteUpdate(data.note);
    };
    fetchRooms();
  }, [id]);

  const onClickBack = () => {
    navigate(-1);
  };

  const onClickSave = async () => {
    const { error } = await supabase
      .from("rooms")
      .update({
        room_number: roomUpdateNumber,
        is_active: activeUpdate,
        note: noteUpdate,
      })
      .eq("id", id)
      .single();

    if (error) {
      setErrorMessage("Error updating room");
      return;
    }

    setRoom({
      id: room!.id,
      room_number: roomUpdateNumber,
      is_active: activeUpdate,
      note: noteUpdate,
    });
    setErrorMessage("");
    alert("Room updated successfully");
  };

  return (
    <>
      <Heading pt="100px" mb="50px">
        Rooms Status
      </Heading>
      <Container w="40%" mx="auto" pb="100px">
        <Text>{errorMessage}</Text>
        {room ? (
          <>
            <Text display="block" fontSize="2rem" mb="10">
              Room Number: {room.room_number}
            </Text>
            <Flex gap="10px" flexDirection="column">
              <Box p="2" border="1px solid #fff">
                <Text color={room.is_active ? "red.400" : "blue.400"}>
                  Status: {room.is_active ? "Occupied" : "Vacant"}
                </Text>
              </Box>
              {room.note && (
                <Box p="2" border="1px solid #fff">
                  <Text>Note: {room.note}</Text>
                </Box>
              )}
              {user?.role === "admin" && (
                <Dialog.Root motionPreset="slide-in-bottom">
                  <Dialog.Trigger asChild>
                    <ButtonGroup
                      onClick={() => {
                        setRoomUpdateNumber(room.room_number);
                        setActiveUpdate(room.is_active);
                        setNoteUpdate(room.note);
                      }}
                    >
                      Edit{" "}
                    </ButtonGroup>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>Room Edit</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          <Text color="white" mb="10px" textAlign="left">
                            Room Number
                          </Text>
                          <Input
                            display="block"
                            fontSize="2rem"
                            mb="10"
                            value={roomUpdateNumber}
                            onChange={(e) =>
                              setRoomUpdateNumber(
                                Number(e.target.value) || 0,
                              )
                            }
                          />
                          <Box width="100%" mx="auto" mb="30px">
                            <Text color="white" mb="10px" textAlign="left">
                              Status
                            </Text>
                            <Switch.Root
                              checked={activeUpdate}
                              onCheckedChange={(e) =>
                                setActiveUpdate(e.checked)
                              }
                              width="100%"
                              justifyContent="center"
                            >
                              <Switch.HiddenInput />
                              <Switch.Control>
                                <Switch.Thumb />
                              </Switch.Control>
                              <Switch.Label>Occupied</Switch.Label>
                            </Switch.Root>
                          </Box>
                          <Text color="white" mb="10px" textAlign="left">
                            Note
                          </Text>
                          <Textarea
                            border="1px solid #fff"
                            value={noteUpdate}
                            onChange={(e) => setNoteUpdate(e.target.value)}
                          />
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <ButtonGroup>Cancel</ButtonGroup>
                          </Dialog.ActionTrigger>
                          <ButtonGroup onClick={onClickSave}>Save</ButtonGroup>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
              )}
            </Flex>
          </>
        ) : (
          <Spinner />
        )}
        <BackButton onClickBack={onClickBack}>Back</BackButton>
      </Container>
    </>
  );
};
