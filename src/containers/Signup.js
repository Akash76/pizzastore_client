import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import SnackBar from "../components/SnackBar"
import config from "../config"
import "./Signup.css";

export default function Signup() {
  const [fields, handleFieldChange, reset] = useFormFields({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.username.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  
  async function handleSubmit(event) {
    event.preventDefault();
  
    setIsLoading(true);
  
    try {
      console.log('Signup Fields: ', fields)

      var response = await fetch(`${config.BASE_URL}/signUp`, {
        mode: 'cors',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            "username": fields.username,
            "password": fields.password
        })
      })

      var json = await response.json()
      console.log(json)
      if(json.status === 'SUCCESS') {
        setMessage('User registered successfully! Please Login.')
        setSeverity('success')
      } else if(json.status === 'USER_EXIST') {
        setMessage('User exists with given username')
        setSeverity('error')
      }
      setOpen(true)
      reset()
      setIsLoading(false)
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderForm() {
    return (
      <>
      <Form onSubmit={handleSubmit}>
        <h4>Fields with <text style={{color: "red"}}>*</text> are mandatory</h4>  
        <Form.Group controlId="username" size="lg">
          <Form.Label className="required">Username</Form.Label>
          <Form.Control
            type="text"
            value={fields.username}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label className="required">Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label className="required">Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Form>
      <SnackBar open={open} message={message} severity={severity} handleClose={handleClose} />
      </>
    );
  }

  return (
    <div className="Signup">
      {renderForm()}
    </div>
  );
}