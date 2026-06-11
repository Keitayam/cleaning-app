import { render, screen } from "@testing-library/react"
import { MemoryRouter} from "react-router-dom"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { RoomResister } from "../components/organisms/Room_resister"
import userEvent from "@testing-library/user-event";


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

describe("RoomResisterページ", ()=>{
    beforeEach(()=>{
        mockNavigate.mockClear();
        render(
            <ChakraProvider value={defaultSystem}>
        <MemoryRouter>
          <RoomResister />
        </MemoryRouter>
      </ChakraProvider>
        )
    })

    test("Homeタイトルがある",()=>{
        expect(screen.getByTestId("title")).toHaveTextContent("Room Resister Page")
    })

    test("戻るボタンが機能する",async()=>{
        const user = userEvent.setup();
        await user.click(screen.getByText("Back"))
        expect(mockNavigate).toHaveBeenCalledWith("/home")
    })

    
})