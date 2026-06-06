import { Button, type ButtonProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

type Props = {
  children:ReactNode;
  onClick?: () => void;
  loading?: boolean;
  bg?: ButtonProps["bg"]
  hoverBg?: string;
};

export const ButtonGroup = ({ children, onClick, loading, bg="#2973B2", hoverBg="#48A6A7" }: Props) => {
  return (
    <Button
      bg={bg}
      color="white"
      _hover={{ bg: hoverBg }}
      onClick={onClick}
      loading={loading}
    >
      {children}
    </Button>
  );
};
