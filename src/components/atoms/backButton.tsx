import { Button } from "@chakra-ui/react";
import type { ReactNode } from "react";

type Props = {
  children:ReactNode;
  onClickBack?: () => void;
};

export const BackButton = ({ children, onClickBack }: Props) => {
  return (
    <Button
    display="block" 
    color="white"
     bg="transparent" 
     mx="auto" 
     mt="20px" 
     onClick={onClickBack}
    >
      {children}
    </Button>
  );
};
