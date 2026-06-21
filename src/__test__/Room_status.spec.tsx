import { render, screen } from "@testing-library/react"
import { MemoryRouter} from "react-router-dom"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import userEvent from "@testing-library/user-event";
import { Room_status } from "../components/organisms/Room_status";


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
          order:()=>({
            data: [
              { id: 1, room_number: "101", is_active: true, hide: false },
              { id: 2, room_number: "102", is_active: false, hide: false },
            ],
            error:null,
          })
        }),
      }),
    },
  }));

describe("RoomsStatusページ", ()=>{
    beforeEach(()=>{
        mockNavigate.mockClear();
        render(
            <ChakraProvider value={defaultSystem}>
        <MemoryRouter>
          <Room_status />
        </MemoryRouter>
      </ChakraProvider>
        )
    })

    test("RoomsStatusタイトルがある",()=>{
        expect(screen.getByTestId("title")).toHaveTextContent("Rooms Status")
    })

    test("部屋番号と色が認識できる", async()=>{
      const rooms = await screen.findAllByTestId(/room_number/)
        expect(rooms).toHaveLength(2);
        expect(screen.getByTestId("room_number_active")).toHaveTextContent("101")
        expect(screen.getByTestId("room_number_inactive")).toHaveTextContent("102")
    })

    test("クリックすると部屋詳細が表示される",async()=>{
      const user = userEvent.setup()
      const room = await screen.findByTestId("room_number_active")
      await user.click(room)
      expect(mockNavigate).toHaveBeenCalledWith("/rooms/1")
    })

    test("戻るボタンが機能する",async()=>{
        const user = userEvent.setup();
        await user.click(screen.getByText("Back"))
        expect(mockNavigate).toHaveBeenCalledWith("/home")
    })

    
})