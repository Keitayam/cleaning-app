import { Box, Container, Heading, Spinner, Text } from "@chakra-ui/react";
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
  const {id} = useParams();
  const {user} = useAuth();
  // const [loading, setLoading] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);

  
  useEffect(() => {
    const fetchRooms = async () => {
      // setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
        // setErrorMessage("Error fetching rooms");
        // setLoading(false);
        return;
      }
      setRoom(data);
      // setLoading(false);
    };
    fetchRooms();
  }, [id]);

  const onClickBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Heading pt="100px" mb="50px">
        Rooms Status
      </Heading>
      <Container w="40%" mx="auto" pb="100px">
      {room ? (
        <>
        <Text display="block" fontSize="2rem" mb="10">Room Number: {room.room_number}</Text>
        <Box  p="2" border="1px solid #fff">
        <Text color ={room.is_active ? "red.400" : "blue.400"}
        >Status: {room.is_active ? "Occupied" : "Vacant"}</Text>
    </Box>
      {room.note && (
    <Box  p="2" border="1px solid #fff">
        <Text>Note: {room.note}</Text>
    </Box>
      )}
      {user?.role === "admin" && (
         <Box mt="10">
           <ButtonGroup onClick={()=> navigate(`/rooms/${id}/edit`)}>Edit</ButtonGroup>
         </Box>
      )}
      </>
    ) : (
      <Spinner />
    )}
        <BackButton onClickBack={onClickBack}>Back</BackButton>
      </Container>
    </>
  );
};
