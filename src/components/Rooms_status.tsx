import { Box, Container, Heading, Text } from "@chakra-ui/react";
import { supabase } from "../supabase.Client";
import { useEffect, useState } from "react";
import { BackButton } from "./atoms/backButton";
import { useNavigate } from "react-router-dom";

type Room = {
  id: string;
  room_number: number;
  is_active: boolean;
  note: string;
};


export const Rooms_status = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.log(error);
        setErrorMessage("Error fetching rooms");
        return;
      }
      setRooms(data);
    };
    fetchRooms();
  }, []);

  const onClickBack = () => {
    navigate("/home");
  };

  return (
    <>
      <Heading pt="100px" mb="50px">
        Rooms_status
      </Heading>
      <Container pb="100px">
        <Box>
          <Text>{errorMessage}</Text>
          {rooms.map((room) => (
            <div key={room.id}>
              <Text>{room.room_number}</Text>
            </div>
          ))}
        </Box>
        <BackButton onClickBack={onClickBack}>Back</BackButton>
      </Container>
    </>
  );
};
