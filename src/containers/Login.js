import React, { useState } from "react";
import Form from "react-bootstrap/Form";
// import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import axios from 'axios';
import config from '../config'
import "./Login.css";

export default function Login() {
  // const history = useHistory();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [fields, handleFieldChange] = useFormFields({
    username: "",
    password: ""
  });

  function validateForm() {
    return fields.username.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);
    console.log(config.API_URL)
    console.log(fields)
    try {
      var response = await axios.post(`${config.API_URL}/users/login`, {
        "Username": fields.username,
        "Password": fields.password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      console.log(response.data)
      localStorage.setItem("TOKEN", response.data.token)
      setIsLoading(false)
      userHasAuthenticated(true);
    } catch (e) {
      console.log(e.toString())
      // onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            value={fields.username}
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
