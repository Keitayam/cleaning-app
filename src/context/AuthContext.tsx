import { createContext, useContext, useState, type ReactNode } from "react";

type User ={
    name: string;
    login_id :string;
    role: string;
}

type AuthContextType ={
    user: User | null;
    login:(user:User)=> void;
    logout: ()=>void;
}


const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const STORAGE_KEY = "auth_user";

const saveUser = (user:User)=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(user));
}
const loadUser =(): User | null =>{
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
}

export const AuthProvider = ({children}:{children:ReactNode})=>{
    const [user, setUser]=useState<User | null>(loadUser);
    const login =(user:User)=>{
        setUser(user);
        saveUser(user)
    }
    const logout =()=>{
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    }

    return(
        <AuthContext.Provider  value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext);
