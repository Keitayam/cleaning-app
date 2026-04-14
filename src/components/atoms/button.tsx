import { Button } from "@chakra-ui/react";
import type { ReactNode } from "react";

type Props = {
  children:ReactNode;
  onClick?: () => void;
  loading?: boolean;
};

export const ButtonGroup = ({ children, onClick, loading }: Props) => {
  return (
    <Button
      bg="#2973B2"
      color="white"
      _hover={{ bg: "#48A6A7" }}
      onClick={onClick}
      loading={loading}
    >
      {children}
    </Button>
  );
};
