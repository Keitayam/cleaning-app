import { render, screen } from "@testing-library/react"
import { MemoryRouter} from "react-router-dom"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import userEvent from "@testing-library/user-event";
import { Room_details } from "../components/organisms/Room_details";


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
              single: async () => ({
                data: { room_number: "101", is_active: "true", note: null, hide: "false" },
                error: null,
              }),
            }),
        }),
      }),
    },
  }));

describe("Room detailsページ", ()=>{
    beforeEach(()=>{
        mockNavigate.mockClear();
        render(
            <ChakraProvider value={defaultSystem}>
        <MemoryRouter>
          <Room_details />
        </MemoryRouter>
      </ChakraProvider>
        )
    })

    test("Room detailsタイトルがある",()=>{
        expect(screen.getByTestId("title")).toHaveTextContent("Rooms Details")
    })

    test("戻るボタンが機能する",async()=>{
        const user = userEvent.setup();
        await user.click(screen.getByText("Back"))
        console.log(mockNavigate.mock.calls);

        expect(mockNavigate).toHaveBeenCalledWith(-1)
    })

    
})