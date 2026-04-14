import "./App.css";
import { Provider } from "./components/ui/provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { Rooms_status } from "./components/Rooms_status";
import { UserResister } from "./components/User_resister";
import { RoomResister } from "./components/Room_resister";
import { AuthProvider } from "./context/AuthContext";

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
              <Route path="/rooms_status" element={<Rooms_status />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </>
  );
};
