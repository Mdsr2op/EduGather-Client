import { useLocation, Navigate, Outlet } from "react-router-dom"
import { useAppSelector } from "@/redux/hook"
import { selectCurrentToken } from "../slices/authSlice"

const AuthLayout = () => {
    const token = useAppSelector(selectCurrentToken)
    const location = useLocation()

    return (
        token
            ? <Outlet />
            : <Navigate to="/sign-in" state={{ from: location }} replace />
    )
}
export default AuthLayout