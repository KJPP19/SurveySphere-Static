import useAuth from "../../hooks/useAuth";

const RefreshTokenError = (error) => {
    const { deauthenticateUser } = useAuth();
    if (error.satus === 401 && error.error === "your session has expired, please login again") {
        deauthenticateUser();
    }
    return (
        <div>the session has expired</div>
    )
};

export default RefreshTokenError;