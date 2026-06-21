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
          eq:()=>({
            single:() =>({
              data: 
                { id: 1, room_number: "101", is_active: true, note: "This is test", hide: false },
              error:null,
            })
          })
        }),
      }),
    },
  }));

describe("RoomsDetailsページ", ()=>{
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

    test("RoomsDetailsタイトルがある",()=>{
        expect(screen.getByTestId("title")).toHaveTextContent("Room Details")
    })

    test("部屋番号が正常に表示されている",async()=>{
      expect(await screen.findByTestId("roomNumber")).toHaveTextContent("101")
    })

    test("ステータスが正常に表示されている",async()=>{
      expect(await screen.findByTestId("status")).toHaveTextContent("Status: Occupied")
    })

    test("noteが正常に表示されている",async()=>{
      expect(await screen.findByTestId("note")).toHaveTextContent("This is test")
    })

    test("管理者の場合は編集ボタンが表示されている",async()=>{
      expect(await screen.findByText("Edit")).toBeInTheDocument()
    })


    test("戻るボタンが機能する",async()=>{
        const user = userEvent.setup();
        await user.click(screen.getByText("Back"))
        expect(mockNavigate).toHaveBeenCalledWith(-1)
    })

    
})