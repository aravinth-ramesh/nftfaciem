import React, { useContext, useEffect, useRef, useState } from "react";
import { createBrowserHistory as createHistory } from "history";
import { Routes, Route, Navigate } from "react-router-dom";
import { authContext } from "../authprovider/AuthProvider";
import LandingPageIndex from "../Landingpage/LandingPageIndex";

const history = createHistory();
const $ = window.$;

const AppRoute = ({
  component: Component,
  layout: Layout,
  screenProps: ScreenProps,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (
      <Layout screenProps={ScreenProps} {...props} {...rest}>
        <Component {...props} />
      </Layout>
    )}
    isAuthed
  />
);

const PrivateRoute = ({
  component: Component,
  layout: Layout,
  screenProps: ScreenProps,
  authentication,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      authentication === true ? (
        <Layout screenProps={ScreenProps} {...props} {...rest}>
          <Component {...props} authRoute={true} />
        </Layout>
      ) : (
        <Navigate to={{ pathname: "/", state: { from: props.location } }} />
      )
    }
  />
);

const App = () => {

  const { auth } = useContext(authContext);

  const [authentication, setAuthntication] = useState(false);

  useEffect(() => {
    setAuthntication(auth.authStatus);
  }, [auth.authStatus]);

  return (
    <>
      <Routes>
        {/* <Route
          path={"/"}
          element={LandingPageIndex}
        /> */}
        <Route path={"/"} element={<LandingPageIndex />} exact />
      </Routes>
    </>
  );
};

export default App;
