import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

const Login = lazy(() => import("./containers/Login"))
const Signup = lazy(() => import("./containers/Signup"))
const LandingPage = lazy(() => import("./containers/LandingPage"))
const NotFound = lazy(() => import("./containers/NotFound"))

export default function Routes() {
    return (
      <Suspense fallback={<div>Loading... </div>}>  
        <Switch>
          <UnauthenticatedRoute exact path="/">
            <LandingPage />
          </UnauthenticatedRoute>
          <UnauthenticatedRoute exact path="/login">
            <Login />
          </UnauthenticatedRoute>
          <UnauthenticatedRoute exact path="/signup">
            <Signup />
          </UnauthenticatedRoute>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Suspense>
    );
  }
  