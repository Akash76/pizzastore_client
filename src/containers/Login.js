import React, { useState } from "react";
import Form from "react-bootstrap/Form";
// import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { Link } from "react-router-dom";
import config from '../config'
import { onError } from "../libs/errorLib";
import "./Login.css";

export default function Login() {
  // const history = useHistory();
  const { userHasAuthenticated, setRolePath, setRole } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: ""
  });

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    console.log(config.BASE_URL)
    try {
      var response = await fetch(`${config.BASE_URL}/signIn`, {
          mode: 'cors',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
              "username" : fields.email,
              "password" : fields.password
          })
      })

      var json = await response.json()
      console.log(json)
      if (json.role === 'ANALYST') {
        setRolePath('/analystDashboard')
        setRole('ANALYST')
      } else if(json.role === 'ADMIN') {
        setRolePath('/adminDashboard')
        setRole('ADMIN')
      } else if(json.role === 'REQUESTOR') {
        setRolePath('/requestorDashboard')
        setRole('REQUESTOR')
      }
      
      userHasAuthenticated(true);
      // history.push("/");
    } catch (e) {
      console.log(e.toString())
      // onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Link to="/login/reset">Forgot password?</Link>
        <LoaderButton
          block
          size="lg"
          type="submit"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Login
        </LoaderButton>
      </Form>
    </div>
  );
}
