import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "@/redux/hook"
import { selectCurrentToken } from "../slices/authSlice"

const AuthLayout = () => {
    const token = useAppSelector(selectCurrentToken)
    const location = useLocation()

    return (
        token
            ? <Navigate to="/" state={{ from: location }} replace />
            : (
            <section className="flex flex-1 justify-center items-center flex-col py-6 px-4 overflow-hidden">
                <Navigate to="/sign-in" state={{ from: location }} replace />
            </section>)
    )
}
export default AuthLayout