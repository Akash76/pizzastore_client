import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import "./App.css";
import config from './config'
import { AppContext } from "./libs/contextLib";
import { useHistory, Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import axios from 'axios'

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [navClass, setNavClass] = useState("Navbar")
  const history = useHistory()
  const cookies = new Cookies()

  useEffect(() => {
    onLoad();

    window.addEventListener('scroll', () => {
      if(window.pageYOffset > 20) {
        setNavClass("Navbar box-shadow")
      } else {
        setNavClass("Navbar")
      }
    }, { passive: true });
  }, []);
  
  async function onLoad() {
    try {
      

      userHasAuthenticated(true)
    } catch(e) {
      console.log(e)
      handleLogout()
    }
  
    setIsAuthenticating(false);
  }

  const handleLogout = async () => {
    try {
      var response = await fetch(`${config.BASE_URL}/logout`, {
        mode: 'cors',
        method: 'GET',
        credentials: 'include',
      })

      console.log(response)
      userHasAuthenticated(false);
      history.push("/login")
    } catch (error) {
      console.log('Error with Logout')
    }
  }
  
  return (
    !isAuthenticating && (
      <div className="App">
        <Navbar collapseOnSelect fixed="top" expand="lg" className={navClass}>
          <Link to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              {config.APP_NAME}
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <Nav.Link onClick={() => history.push("/home")}>Home</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="routes px-1">
          <AppContext.Provider value={{
            isAuthenticated,
            userHasAuthenticated,
            isAuthenticating,
            handleLogout
          }}>
            <Routes />
          </AppContext.Provider>
        </div>
      </div>
    )
  );
}

export default App;
