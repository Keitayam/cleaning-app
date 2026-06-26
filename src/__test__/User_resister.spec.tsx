import { render, screen, waitFor, within } from "@testing-library/react"
import { MemoryRouter} from "react-router-dom"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import userEvent from "@testing-library/user-event";
import { UserResister } from "../components/organisms/User_resister";


const mockLogout =vi.fn();
const mockNavigate = vi.fn();

vi.mock("../context/AuthContext",()=>({
    useAuth:()=>({
        user: {name: "test", login_id: "test" , role :"admin"},
        logout: mockLogout,
    })
}))

vi.mock("react-router-dom",async()=>{
    const actual = await vi.importActual("react-router-dom");
    return{
        ...actual,
        useNavigate: () => mockNavigate,
    }
})


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
        insert:async()=>({
          error: null,
        })
      }),
    },
  }));

describe("UserResisterページ", ()=>{
    beforeEach(()=>{
        mockNavigate.mockClear();
        render(
            <ChakraProvider value={defaultSystem}>
        <MemoryRouter>
          <UserResister />
        </MemoryRouter>
      </ChakraProvider>
        )
    })

    test("UserResisterタイトルがある",()=>{
        expect(screen.getByTestId("title")).toHaveTextContent("User Resister Page")
    })

    test("名前の入力ができる",async()=>{
        const user = userEvent.setup();
        await user.type(screen.getByTestId("name"),"Zhang")
        expect(screen.getByTestId("name")).toHaveValue("Zhang");
    })

    test("Usernameの入力ができる",async()=>{
      const user = userEvent.setup();
      await user.type(screen.getByTestId("userName"),"Zhangs")
      expect(screen.getByTestId("userName")).toHaveValue("Zhangs");
    })

    test("Passwordの入力ができる",async()=>{
      const user = userEvent.setup();
      await user.type(screen.getByTestId("password"),"Testsite7!")
      expect(screen.getByTestId("password")).toHaveValue("Testsite7!");
    })

    test("Roleの登録ができる", async () => {
      const user = userEvent.setup();
      const trigger = screen.getByTestId("role-trigger");
      await user.click(trigger);
  
      const listbox = screen.getByRole("listbox");
      await user.click(within(listbox).getByText("Admin"));
  
      expect(screen.getByTestId("role-trigger")).toHaveTextContent("Admin");
  });


    test("Userの登録ができる",async()=>{
        const user = userEvent.setup();
        const alertMock = vi.spyOn(window,"alert").mockImplementation(()=>{}) //アラートモック
        await user.type(screen.getByTestId("name"),"Zhang")
        await user.type(screen.getByTestId("userName"),"Zhangs")
        await user.type(screen.getByTestId("password"),"Testsite7!")
        const trigger = screen.getByTestId("role-trigger")
        await user.click(trigger);
        const listbox = screen.getByRole("listbox");
        await user.click(within(listbox).getByText("Admin"));

        await user.click(screen.getByText("Resister New User"))
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith("Registration Complete");
          });
        alertMock.mockRestore();
    })

    test("戻るボタンが機能する",async()=>{
        const user = userEvent.setup();
        await user.click(screen.getByText("Back"))
        expect(mockNavigate).toHaveBeenCalledWith("/home")
    })

    
})