import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { AuthProvider, useAuth } from "react-oidc-context";
import { onSigninCallback, userManager } from "./auth-config.client";
import {
  buttonSharedStyles,
  normalButtonColor,
} from "~/shared/components/button/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { appWidth } from "~/shared/components/layout/styles";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const queryClient = new QueryClient();

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <AuthProvider
          userManager={userManager}
          onSigninCallback={onSigninCallback}
        >
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const auth = useAuth();

  return (
    <div className={"min-h-screen flex flex-col"}>
      <header
        className={`sticky top-0 w-full bg-white mb-4 border-b-4 border-black z-1`}
      >
        <div className={`mx-auto flex items-center ${appWidth}`}>
          <Link className={`text-3xl py-8 cursor-pointer`} to={"/"}>
            Aegis
          </Link>
          <div className={"ml-auto flex gap-2"}>
            {auth.isAuthenticated && (
              <div>
                <p>{auth.user?.profile.name}</p>
                <p>{auth.user?.profile.email}</p>
              </div>
            )}
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
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
