import {
  Box,
  CloseButton,
  Container,
  Dialog,
  Flex,
  Heading,
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
  hide: boolean;
};

export const Room_details = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [activeUpdate, setActiveUpdate] = useState<boolean>(
    room?.is_active || false,
  );
  const [noteUpdate, setNoteUpdate] = useState<string>(room?.note || "");
  const [hideUpdate, setHideUpdate] = useState<boolean>(room?.hide || false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

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
      setActiveUpdate(data.is_active);
      setNoteUpdate(data.note);
      setHideUpdate(data.hide);
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
        is_active: activeUpdate,
        note: noteUpdate,
        hide: hideUpdate,
      })
      .eq("id", id)
      .single();

    if (error) {
      setErrorMessage("Error updating room");
      return;
    }

    setRoom({
      id: room!.id,
      room_number: room!.room_number,
      is_active: activeUpdate,
      note: noteUpdate,
      hide: hideUpdate,
    });
    setErrorMessage("");
    alert("Room updated successfully");
    setIsEditOpen(false);
  };

  const onClickDelete = async () => {
    const { error } = await supabase.from("rooms").delete().eq("id", id);

    if (error) {
      setErrorMessage("Error deleting room. Please try again.");
      return;
    }
    setErrorMessage("");
    alert("Room deleted successfully");
    navigate("/rooms_status");
  };

  return (
    <>
      <Heading pt="100px" mb="50px" data-testId="title">
        Room Details
      </Heading>
      <Container w="40%" mx="auto" pb="100px">
        <Text>{errorMessage}</Text>
        {room ? (
          <>
            <Text display="block" fontSize="2rem" mb="10" data-testid="roomNumber">
              Room Number: {room.room_number}
            </Text>
            <Flex gap="10px" flexDirection="column">
              <Box p="2" border="1px solid #fff">
                <Text data-testid="status" color={room.is_active ? "red.400" : "blue.400"}>
                  Status: {room.is_active ? "Occupied" : "Vacant"}
                </Text>
              </Box>
              {room.note && (
                <Box p="2" border="1px solid #fff">
                  <Text data-testid="note">Note: {room.note}</Text>
                </Box>
              )}
              {user?.role === "admin" && (
                <Dialog.Root
                motionPreset="slide-in-bottom"
                open={isEditOpen}
                onOpenChange={(e) => setIsEditOpen(e.open)}
                >
                  <Dialog.Trigger asChild>
                    <ButtonGroup
                      onClick={() => {
                        setActiveUpdate(room.is_active);
                        setNoteUpdate(room.note);
                        setIsEditOpen(true);
                      }}
                    >
                      Edit{" "}
                    </ButtonGroup>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content bg="gray.700">
                        <Dialog.Header>
                          <Dialog.Title>Room Edit</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          <Heading color="white" mb="10px" textAlign="left">
                            Room Number : {room.room_number}
                          </Heading>
                          <Box width="100%" mx="auto" mb="30px">
                            <Text color="white" mb="10px" textAlign="left">
                              Status (After clearing the room, please update the
                              status for vacant)
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
                            mb="10px"
                          />

                          <Switch.Root
                            checked={hideUpdate}
                            onCheckedChange={(e) => setHideUpdate(e.checked)}
                            width="100%"
                            justifyContent="center"
                          >
                            <Switch.HiddenInput />
                            <Switch.Control>
                              <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Label>Hide</Switch.Label>
                          </Switch.Root>

                          <Dialog.Root role="alertdialog">
                            <Dialog.Trigger asChild>
                              <ButtonGroup bg="#FF0000" hoverBg="#FA6781">
                                Delete
                              </ButtonGroup>
                            </Dialog.Trigger>
                            <Portal>
                              <Dialog.Backdrop />
                              <Dialog.Positioner>
                                <Dialog.Content>
                                  <Dialog.Header>
                                    <Dialog.Title>Are you sure?</Dialog.Title>
                                  </Dialog.Header>
                                  <Dialog.Body>
                                    <p>
                                      This action cannot be undone. This will
                                      permanently delete your account and remove
                                      your data from our systems.
                                    </p>
                                  </Dialog.Body>
                                  <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                      <ButtonGroup>Cancel</ButtonGroup>
                                    </Dialog.ActionTrigger>
                                    <ButtonGroup
                                      bg="#FF0000"
                                      hoverBg="#FA6781"
                                      onClick={onClickDelete}
                                    >
                                      Delete
                                    </ButtonGroup>
                                  </Dialog.Footer>
                                  <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                  </Dialog.CloseTrigger>
                                </Dialog.Content>
                              </Dialog.Positioner>
                            </Portal>
                          </Dialog.Root>
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
