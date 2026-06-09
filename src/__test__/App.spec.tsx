import { render, screen } from "@testing-library/react";
import { App } from "../App";
import { Login } from "../components/pages/Login";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import React from "react";

test("タイトルあるか", () => {
  render(<App />);
  expect(screen.getByTestId("title")).toHaveTextContent(
    "Cleaning App for Motel",
  );
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
//ログイン情報の保存用モック
const mockLogin = vi.fn();
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
  AuthProvider:({children}:{children: React.ReactNode}) => children,
}));

vi.mock("../supabase.Client", () => ({
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({
            eq: () => ({
              single: async () => ({
                data: { name: "test", login_id: "test", role: "admin" },
                error: null,
              }),
            }),
          }),
        }),
      }),
    },
  }));

test("ログインが正常に可能か", async () => {
    const user = userEvent.setup(); 
  render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </ChakraProvider>,
  );

  await user.type(screen.getByTestId("username"), "test");
  await user.type(screen.getByTestId("password"), "Testsite7!");

  await user.click(screen.getByText("Login"));
  expect(mockNavigate).toHaveBeenCalledWith("/home");
});
