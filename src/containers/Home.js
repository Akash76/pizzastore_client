import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Dropdown from 'react-bootstrap/Dropdown'
import LoaderButton from '../components/LoaderButton'
import { useFormFields } from "../libs/hooksLib"
import axios from 'axios'
import config from '../config'
import './Home.css'

function Home() {
    const [formIsOpen, setFormOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [pizza, setPizza] = useState("")
    const [toppings, setToppings] = useState("")
    const [pizzaType, setPizzaType] = useState("")
    const [orders, setOrders] = useState(null)
    const [cost, setCost] = useState(0)

    useEffect(() => {
        load()
    }, [])

    useEffect(() => {
        (async () => {
            if(pizza.length !== 0 && toppings.length !== 0 && pizzaType !== 0) {
                const response = await axios.post(`${config.API_URL}/order/estimateCost`, {
                    MainPizzaName: pizza,
                    Toppings: toppings,
                    PizzaType: pizzaType
                })
    
                console.log(response.data)
                setCost(response.data.cost)
            }
        })()
    }, [pizza, toppings, pizzaType])

    const load = async () => {
        try {
            const token = localStorage.getItem("TOKEN")
            const response = await axios.get(`${config.API_URL}/order/getOrdersByUser`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            setOrders(response.data.response)
        } catch (error) {
            console.log(error)
        }
    }

    const hide = () => {
        setPizza("")
        setToppings("")
        setPizzaType("")
        setCost(0)
        setFormOpen(false)
    }

    const showModal = () => {
        setFormOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const token = localStorage.getItem("TOKEN")

            const response = await axios.post(`${config.API_URL}/order/placeOrder`, {
                MainPizzaName: pizza,
                Toppings: toppings,
                PizzaType: pizzaType
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response)
            load()
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
        hide()
    }

    const cancelOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("TOKEN")
            const response = await axios.put(`${config.API_URL}/order/cancelOrder/${orderId}`, {} ,{
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response.data)
            load()
        } catch (error) {
            console.log(error)
        }
    }

    const Orders = () => {
        return (
            <div>
                {
                    orders.map(({id, orderId, name, orderStatus, cost, orderDate}) => (
                        <Card key={id} className="m-3 card">
                            <Card.Body>
                                <Card.Header>
                                    <b>Name: </b>{name}
                                </Card.Header>
                                <Card.Text as="div" className="pt-2">
                                    <b>Cost: </b>{cost} <br />
                                    <b>Status: </b>{orderStatus} <br />
                                    <b>OrderDate: </b>{orderDate} <br />
                                    {orderStatus === 'COMPLETE' && <b>Delivered</b>}
                                    <div className="pt-3">
                                        <Button variant="danger" disabled={orderStatus === 'CANCELED' || orderStatus === 'COMPLETE' ? true : false} onClick={() => cancelOrder(orderId)}>Cancel</Button>

                                        {/* <Button variant="danger" className="ml-3" onClick={() => deleteTodo(id)}>Delete</Button> */}
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))
                }
            </div>
        )
    }

    return (
        <div className="Home">
            <div className="ml-3">
                <Button variant="primary" onClick={showModal}>Order Pizza</Button>
            </div>
            {
                orders && <Orders />
            }
            <Modal show={formIsOpen} backdrop="static" centered onHide={hide}>
                <Modal.Header closeButton>
                    <Modal.Title>Place Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Dropdown varient="primary" onSelect={(e) => setPizza(e)}>
                                <Dropdown.Toggle>
                                    {!pizza ? 'Select Pizza' : pizza}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="SIMPLE">Simple Pizza</Dropdown.Item>
                                    <Dropdown.Item eventKey="MARGHARITA">Margharita</Dropdown.Item>
                                    <Dropdown.Item eventKey="FARM_HOUSE">Farm House</Dropdown.Item>
                                    <Dropdown.Item eventKey="CHICKEN_FIESTA">Chicken Fiesta</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                        <Form.Group>
                            <Dropdown varient="primary" onSelect={(e) => setToppings(e)}>
                                <Dropdown.Toggle>
                                    {!toppings ? 'Select Toppings' : toppings}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="PANEER">Paneer</Dropdown.Item>
                                    <Dropdown.Item eventKey="FRESH_TOMATO">Fresh Tomato</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                        <Form.Group>
                            <Dropdown varient="primary" onSelect={(e) => setPizzaType(e)}>
                                <Dropdown.Toggle>
                                    {!pizzaType ? 'Select Pizza Type' : pizzaType}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="THIN_CRUST">Thin Crust</Dropdown.Item>
                                    <Dropdown.Item eventKey="PAN_CRUST">Pan Crust</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                        <LoaderButton
                            block
                            type="submit"
                            size="lg"
                            variant="success"
                            isLoading={isLoading}
                            disabled={false}
                        >
                        { cost ? `Buy for Rs.${cost}` : 'Buy'}
                        </LoaderButton>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Home
