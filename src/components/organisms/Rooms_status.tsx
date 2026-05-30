import { Box, Container, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { supabase } from "../../supabase.Client";
import { useEffect, useState } from "react";
import { BackButton } from "../atoms/backButton";
import { useNavigate } from "react-router-dom";

type Room = {
  id: string;
  room_number: number;
  is_active: boolean;
  note: string;
};


export const Rooms_status = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true);

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
      <Heading pt="100px" mb="50px">
        Rooms_status
      </Heading>
      <Container pb="100px">
        {loading ? <Spinner /> : (
          <Flex gap="10px" justifyContent="center" maxWidth="400px" mx="auto" flexWrap="wrap">
            <Text>{errorMessage}</Text>
            {rooms.map((room) => (
              <Box key={room.id} border="1px solid #fff" p="10px" cursor="pointer" onClick={()=> navigate(`/rooms/${room.id}`)}>
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
