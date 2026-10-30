import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from '../Api/api'
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const AppContext = createContext(undefined);

export function AppContextProvider({ children }) {
    //auth state
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false)

    // other state
    const [projects, setProjects] = useState([])
    const [loadingProjects, setLoadingProjects] = useState(true)
    const [activeProject, setActiveProject] = useState(null)
    const [loadingActiveProject, setLoadingActiveProject] = useState(true)
    const [chatLoading, setChatLoading] = useState(false)
    const [generatingProjects, setGeneratingProjects] = useState(false)
    const [activeFile, setActiveFile] = useState('/App.js')
    const [showCode, setShowCode] = useState(true)

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
            const errMsge = err?.response?.data?.error || "Registration Failed"
            toast.error(errMsge)
            throw new Error(errMsge);
        }
    }

    const logout = async () => {
        try {
            await api.post("/api/auth/logout");
            setUser(null)
            setProjects([])
            setActiveProject(null)
            toast.success("Logged out Successfully")
            navigate("/login")
        } catch (err) {
            console.error("Login Failed", err)
            toast.error("Logout Failed")
        }
    }


    //this function is created to get all the list of projects;
    const loadProjects = async () => {
        if (!user) return
        try {
            const { data } = await api.get("/api/projects")
            setProjects(data)
        } catch (err) {
            console.error("Failed to list Projects", err)
            toast.error("failed to load Projects lists")
        } finally {
            setLoadingProjects(false)
        }
    }

    // this function is created to get the specific project using id;
    const loadProject = async (id, silent = false) => {
        if (!user) return
        if (!silent) setLoadingActiveProject(true)
        try {
            const { data } = await api.get(`/api/projects/${id}`)
            setActiveProject(data)

            //default file selection-means convert object into array than making 3 condition and adding it in activeFile state
            const files = Object.keys(data.files)
            if (files.length > 0) {
                setActiveFile((prev) => {
                    if (files.includes(prev)) return prev;
                    if (files.includes("/App.js")) return '/App.js'
                    return files[0]
                })
            }
        } catch (err) {
            console.error("Failed to list Projects", err)
            if (!silent) {
                toast.error("failed to load Projects details")
                navigate("/")
            }
        } finally {
            if (!silent) {
                setLoadingActiveProject(false)
            }

        }
    }


    //automatically poll active project status if generating or pending or revising:it means repeatedly check the active project's status to see whether it is generating, pending, or being revised.
    useEffect(() => {
        if (!activeProject?._id || !user) return;

        const isOngoing = activeProject.status === "generating" || activeProject.status === "pending"
            || activeProject.status === "revising"

        if (isOngoing) {
            setChatLoading(true);
            const interval = setInterval(() => {
                loadProject(activeProject.id, true)
            }, 2000);
            return clearInterval(interval)
        } else {
            setChatLoading(false)
        }
    }, [activeProject?._id, activeProject?.status, loadProject, user])


    const handleGenerate = useCallback(
        async (prompt) => {
            console.log(prompt,"prompt")
            if (!user) return;
            setGeneratingProjects(true)
            try {
                const { data } = await api.post("/api/projects", { prompt })
                console.log(data)
                toast.success("AI agent is planning struture....")
                navigate(`/builder/${data._id}`);
            } catch (err) {
                console.error("failed to generate project:", err);
                toast.error(err?.response?.data?.error || "failed to generate project")
            } finally {
                setGeneratingProjects(false);
            }

        }, [navigate, user]

    )

    const handleDelete = useCallback(
        async (id) => {
            if (!user) return;
            try {
                await api.delete(`/api/projects/${id}`)
                setProjects((prev) => prev.filter((p) => p._id !== id))
                toast.success("project is deleted successFully")

            } catch (err) {
                console.error("failed to delete project:", err);
                toast.error("failed to delete project")
            }
        }, [user]
    )

    return (
        <AppContext.Provider value={{
            user,
            loadingUser,
            login,
            Register,
            logout,
            projects,
            loadingProjects,
            activeProject,
            loadingActiveProject,
            chatLoading,
            generatingProjects,
            activeFile,
            showCode,
            setActiveFile,
            setShowCode,
            loadProject,
            loadProjects,
            handleGenerate,
            handleDelete
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



