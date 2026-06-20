import { Box, Container, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { supabase } from "../../supabase.Client";
import { useEffect, useState } from "react";
import { BackButton } from "../atoms/backButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Room = {
  id: string;
  room_number: number;
  is_active: boolean;
  note: string;
  hide: boolean;
};


export const Rooms_status = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);

      const query = supabase
      .from("rooms")
      .select("*")
      .order("room_number",{ascending: true});

      if(user?.role !== "admin"){
        query.eq("hide", false);
      }

      const { data, error } = await query

      if (error) {
        console.log(error);
        setErrorMessage("Error fetching rooms");
        setLoading(false);
        return;
      }
      setRooms(data);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const onClickBack = () => {
    navigate("/home");
  };

  return (
    <>
      <Heading pt="100px" mb="50px" data-testid="title">
        Rooms Status
      </Heading>
      <Container pb="100px">
        {loading ? <Spinner /> : (
          <Flex gap="10px" justifyContent="center" maxWidth="400px" mx="auto" flexWrap="wrap">
            <Text>{errorMessage}</Text>
            {rooms.map((room) => (
              <Box key={room.id} border="1px solid #fff" p="10px" data-testid={`room_number_${room.is_active ? "active" : "inactive"}`} cursor="pointer" onClick={()=> navigate(`/rooms/${room.id}`)}
              backgroundColor={room.hide ? "gray.400" : room.is_active ? "red.400" : "blue.400"}>
                <Text color="white">{room.room_number}</Text>
              </Box>
            ))}
          </Flex>
        )}
        <BackButton onClickBack={onClickBack}>Back</BackButton>
      </Container>
    </>
  );
};
