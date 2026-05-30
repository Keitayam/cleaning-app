import { Container, Heading, Spinner, Text } from "@chakra-ui/react";
import { supabase } from "../../supabase.Client";
import { useEffect, useState } from "react";
import { BackButton } from "../atoms/backButton";
import { useNavigate, useParams } from "react-router-dom";

type Room = {
  id: string;
  room_number: number;
  is_active: boolean;
  note: string;
};


export const Rooms_details = () => {
  const {id} = useParams();
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
    navigate("/home");
  };

  return (
    <>
      <Heading pt="100px" mb="50px">
        Rooms_status
      </Heading>
      <Container pb="100px">
      {room ? (
      <>
        <Text>部屋番号: {room.room_number}</Text>
        <Text>状態: {room.is_active ? "使用中" : "空室"}</Text>
        <Text>メモ: {room.note}</Text>
      </>
    ) : (
      <Spinner />
    )}
        <BackButton onClickBack={onClickBack}>Back</BackButton>
      </Container>
    </>
  );
};
