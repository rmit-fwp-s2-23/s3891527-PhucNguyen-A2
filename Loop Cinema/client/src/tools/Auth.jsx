import { Navigate } from "react-router-dom"

const Auth = ({children}) => {
    if(localStorage.getItem("user")) {
        return children
    }
    return <Navigate to='/login'/>
}

export default Auth