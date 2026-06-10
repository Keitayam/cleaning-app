import { render, screen } from "@testing-library/react"
import { Home } from "../components/pages/Home"
import { MemoryRouter} from "react-router-dom"
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import userEvent from "@testing-library/user-event"


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

describe("Homeページ", ()=>{
    beforeEach(()=>{
        mockNavigate.mockClear();
        render(
            <ChakraProvider value={defaultSystem}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </ChakraProvider>
        )
    })

    test("Homeタイトルがある",()=>{
        expect(screen.getByTestId("title")).toHaveTextContent("Cleaning App Home")
    })

    test("ログイン名が出ている",()=>{
        expect(screen.getByTestId("username")).toHaveTextContent("Login name: test")
    })

    test("Rooms Statusページへの遷移",async()=>{
        const user = userEvent.setup();
        await user.click(screen.getByText("Rooms Status"))
        expect(mockNavigate).toHaveBeenCalledWith("/rooms_status")
    })
    test("UserResisterページへの遷移",async()=>{
        const user = userEvent.setup();
        await user.click(screen.getByText("New User Registration"))
        expect(mockNavigate).toHaveBeenCalledWith("/user_resister")
    })
    test("RoomResisterページへの遷移",async()=>{
        const user = userEvent.setup();
        await user.click(screen.getByText("New Room Registration"))
        expect(mockNavigate).toHaveBeenCalledWith("/room_resister")
    })
    test("サインアウトできる",async()=>{
        const user = userEvent.setup();
        await user.click(screen.getByText("Sign out"))
        expect(mockNavigate).toHaveBeenCalledWith("/")
    })
})