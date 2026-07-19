import { useAuth } from "react-oidc-context";
import { appWidth } from "~/shared/components/layout/styles";
import { Link } from "react-router";
import { buttonSharedStyles, normalButtonColor } from "~/shared/components/button/styles";

export default function Header() {
  const auth = useAuth();

  return (
    <header
      className={`sticky top-0 w-full bg-white mb-4 border-b-4 border-black z-1`}
    >
      <div className={`mx-auto flex items-center ${appWidth}`}>
        <Link className={`text-3xl py-8 cursor-pointer`} to={"/"}>
          Aegis
        </Link>
        <div className={"ml-auto flex gap-4"}>
          {auth.isAuthenticated ? (
            <button
              onClick={() => auth.signoutRedirect()}
              className={`${buttonSharedStyles} ${normalButtonColor}`}
            >
              Log Out
            </button>
          ) : (
            <>
              <button
                onClick={() => auth.signinRedirect()}
                className={`${buttonSharedStyles} ${normalButtonColor}`}
              >
                Log In
              </button>
              <button
                onClick={() =>
                  auth.signinRedirect({
                    extraQueryParams: {
                      prompt: "create",
                    },
                  })
                }
                className={`${buttonSharedStyles} ${normalButtonColor}`}
              >
                Sign Up
              </button>
            </>
          )}
          {auth.isAuthenticated && (
            <div className={"max-sm:hidden"}>
              <p>{auth.user?.profile.name}</p>
              <p>{auth.user?.profile.email}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
