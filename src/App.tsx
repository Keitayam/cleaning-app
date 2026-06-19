import "./App.css";
import { Provider } from "./components/ui/provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./components/pages/Login";
import { Home } from "./components/pages/Home";
import { UserResister } from "./components/organisms/User_resister";
import { RoomResister } from "./components/organisms/Room_resister";
import { AuthProvider } from "./context/AuthContext";
import { Room_status } from "./components/organisms/Room_status";
import { Room_details } from "./components/organisms/Room_details";

export const App = () => {
  return (
    <>
      <Provider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
              <Route path="/user_resister" element={<UserResister />} />
              <Route path="/room_resister" element={<RoomResister />} />
              <Route path="/rooms_status" element={<Room_status/>} />
              <Route path="/rooms/:id" element={<Room_details />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </>
  );
};
