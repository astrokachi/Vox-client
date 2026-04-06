import { useEffect, useState } from "react";
import { redirect, data } from "react-router";
import { useNavigate } from "react-router";
import Button from "~/components/button";
import "~/styles/login.scss";
import type { Route } from "./+types";
import { commitSession, getSession } from "~/sessions.server";
import axios from "axios";
import { routes } from "~/api/routes";
const logo = "/vox.png";

// check if user already logged in
export async function loader({
  request,
}: Route.LoaderArgs) {
  const session = await getSession(
    request.headers.get("Cookie")
  );


  if (session.has("jwtoken")) {
    return redirect('/');
  }

  return data({ error: session.get("error") }, {
    headers: {
      "Set-Cookie": await commitSession(session),
    }
  })
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // open a popup window that hits the server's authorize endpoint
  const handleLogin = () => {
    setIsLoading(true);
    const popup = window.open(
      routes.auth.authorize,
      "_blank",
      "popup=true"
    );

    // listen for when closed, update loading state`
    if (popup) {
      const checkPopup = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkPopup);
            setIsLoading(false);
          }
        } catch (e) {
          clearInterval(checkPopup);
          console.error(e);
        }
      }, 500);
    }
  };

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.status === "success") {
        console.log(event.data.token);
        // TODO: set the session data;
        await axios.post(routes.auth.session, { token: event.data.token });
        setIsLoading(false);
        navigate('/');
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  return (
    <div className="container">
      <div className="logo">
        <img src={logo} alt="logo" />
        <h1 className="header">Vox</h1>
      </div>

      <div className="login-card">
        <h2 className="login-card-title">Sign in to continue</h2>
        <div className="btn-wrapper">
          <Button isLoading={isLoading} onClick={handleLogin} withIcon>
            Continue with X
          </Button>
        </div>

        <div className="login-divider">
          <div className="login-divider-line"></div>
          <div className="login-divider-line"></div>
        </div>

        <div className="login-info">
          <p className="login-info-text">
            By signing in, you authorize this app to access your X account and generate tweets based on your preferences.
          </p>
        </div>
      </div>

      <div className="login-footer">
        <p className="login-footer-text">
          New to Vox? Your account will be created automatically.
        </p>
      </div>
    </div>
  );
};

export default Login;
