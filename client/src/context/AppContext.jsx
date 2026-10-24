import { createContext, useContext, useEffect, useState } from "react";
import api from '../Api/api'
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true)
    const navigate = useNavigate()

    const checkSession = async () => {
        try {
            const { data } = await api.get("/api/auth/me")
            setUser(data.user)
        } catch (error) {
            setUser(null)
        } finally {
            setLoadingUser(false)
        }
    }
    useEffect(() => {
        checkSession();

    }, [checkSession])

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/api/auth/login', { email, password });
            setUser(data.user)
            toast.success("welcome back!")
            navigate("/")
        } catch (err) {
            console.log("Login Failed", err)
            const errMsge = err?.response?.data?.error || "Invalid Email OR Password"
            toast.error(errMsge)
            throw new Error(errMsge);
        }
    }

    const Register = async (name, email, password) => {
        try {
            const { data } = await api.post('/api/auth/register', { name, email, password });
            setUser(data.user)
            toast.success("Account Created SuccessFully!")
            navigate("/")
        } catch (err) {
            console.log("Registration Failed", err)
            const errMsge = serr?.response?.data?.error || "Registration Failed"
            toast.error(errMsge)
            throw new Error(errMsge);
        }
    }
    return (
        <AppContext.Provider value={{
            user,
            loadingUser,
            login,
            Register
        }}>
            {children}
        </AppContext.Provider>
    )
}


export function useAppContext() {
    const context = useContext(AppContext);
    if (context == undefined) {
        throw new Error("useAppContext must be used within an AppContextProvider")
    }
    return context

}



