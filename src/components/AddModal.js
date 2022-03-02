import React, {useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";


const AddModal = ({handleAdd, show, onHide}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userRole, setUserRole] = useState('');
    const item = {
        "firstName": firstName,
        "lastName": lastName,
        "role": userRole
    }
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Add new item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="addModal">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" onInput={(event => {
                            setFirstName(event.target.value)
                        })} placeholder="Bob"/>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" onInput={(event => {
                            setLastName(event.target.value)
                        })} placeholder="Mason"/>
                        <Form.Label>User's role</Form.Label>
                        <Form.Control type="text" onInput={(event => {
                            setUserRole(event.target.value)
                        })} placeholder="Admin"/>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => {
                    handleAdd(item)
                    onHide()
                }}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );

};
export default AddModal;
