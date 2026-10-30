import { redirect, useLoaderData } from "react-router";

import Button from "~/components/button";
import { authApi } from "~/api/endpoints";
import { isTokenSet, setAccessToken } from "~/lib/auth";
import { describeOAuthError } from "~/lib/errorHandler";
import "~/styles/login.scss";

import type { Route } from "./+types/login";

const logo = "/vox.png";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const accessToken = url.searchParams.get("accessToken");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  if (accessToken) {
    setAccessToken(accessToken);
    return redirect("/posts/new");
  }

  if (isTokenSet()) {
    return redirect("/posts/new");
  }

  if (error) {
    return { error: describeOAuthError(error, errorDescription ?? undefined) };
  }

  return { error: null };
}

const Login = () => {
  const loaderData = useLoaderData<typeof clientLoader>();
  const authError = loaderData?.error ?? null;

  const handleLogin = () => {
    window.location.href = authApi.authorize();
  };

  return (
    <main className="signin">
      {/* What Vox is, on its own colour. */}
      <section className="signin-field" aria-labelledby="signin-promise">
        <div className="signin-brand">
          <span className="signin-mark">
            <img src={logo} alt="" width={36} height={36} />
          </span>
          <span className="signin-wordmark">Vox</span>
        </div>
        <div className="signin-pitch">
          <h1 id="signin-promise" className="signin-promise">
            Write X posts with AI
          </h1>
          <p className="signin-explain">
            Describe a topic, pick from three drafts, refine it, and publish to X
            from here.
          </p>
        </div>
      </section>

      {/* The one thing to do here. */}
      <section className="signin-panel" aria-labelledby="signin-title">
        <div className="signin-column">
          <h2 id="signin-title" className="signin-title">Sign in to Vox</h2>

          {authError && (
            <p className="signin-error" role="alert">
              {authError}
            </p>
          )}

          <Button onClick={handleLogin} withIcon>
            Continue with X
          </Button>

          <p className="signin-note">
            Signing in lets Vox publish the posts you choose to your X account.
            New to Vox? Your account will be created automatically.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
