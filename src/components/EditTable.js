import React, {useEffect, useState} from 'react';
import {Form, Table} from "react-bootstrap";
import {PencilFill, Save, Trash, XSquare} from 'react-bootstrap-icons';
import AddModal from "./AddModal";
import "../styles/EditTable.css";

const EditableTable = ({columns, rows, actions}) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [rowIDToEdit, setRowIDToEdit] = useState(undefined);
    const [rowsState, setRowsState] = useState(rows);
    const [editedRow, setEditedRow] = useState();
    const [notification, setNotification] = useState('');
    const [modalShow, setModalShow] = useState(false);

    useEffect(() => {
        const pressEsc = e => {
            if (e.code === "Escape") {
                handleCancelEditing()
            }
        }
        document.addEventListener('keydown', pressEsc);

        return () => {
            document.removeEventListener('keydown', pressEsc)
        }
    }, []);
    const handleEdit = (rowID) => {
        setIsEditMode(true);
        setEditedRow(undefined);
        setRowIDToEdit(rowID);
    }
    const handleRemoveRow = (rowID) => {
        const newData = rowsState.filter(row => {
            return row.id !== rowID ? row : null
        });
        fetch(`http://localhost:8080/tableData/${rowID}`, {
            method: "DELETE"
        })
            .then(() => {
                setRowsState(newData)
            })
    }
    const handleOnChangeField = (e, rowID) => {
        const {name: fieldName, value} = e.target;
        setEditedRow({
            id: rowID,
            [fieldName]: value
        })
    }
    const handleCancelEditing = () => {
        setIsEditMode(false);
        setEditedRow(undefined);
    }
    const handleSaveRowChanges = () => {
        setTimeout(() => {
            setIsEditMode(false);
            const newData = rowsState.map(row => {
                if (row.id === editedRow.id) {
                    if (editedRow.firstName) row.firstName = editedRow.firstName;
                    if (editedRow.lastName) row.lastName = editedRow.lastName;
                    if (editedRow.role) row.role = editedRow.role;
                }
                return row;
            })
            fetch(`http://localhost:8080/tableData/${editedRow.id}`, {
                method: "PUT",
                body: JSON.stringify(newData.find(x => x.id === editedRow.id)),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            }).then(() => {
                setRowsState(newData);
                setEditedRow(undefined)
            })
        }, 1000)
    }
    const handleAdd = (item) => {
        const newData = Object.assign([], rowsState)
        fetch('http://localhost:8080/tableData', {
            method: "POST",
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        }).then(response => response.json())
            .then(json => {
                newData.push(json)
                setRowsState(newData)
                setNotification("Элемент успешно добавлен")
            })
    }
    const handleConfirmation = () => window.confirm("Вы уверены?");

    return (
        <div>
            <AddModal handleAdd={handleAdd} show={modalShow} onHide={() => setModalShow(false)}/>
            <div className={"notification"}>
                {notification}
            </div>
            <hr className={"line"} width={"100%"} size={"2px"} color={"black"}/>
            <button className={"addButton btn btn-light"} onClick={() => setModalShow(true)}>Add</button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    {columns.map((column) => {
                        return <th key={column.field}>{column.fieldName}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {rowsState.map((row) => {
                    return <tr key={row.id}>
                        <td>
                            {row.id}
                        </td>
                        <td>
                            {isEditMode && rowIDToEdit === row.id
                                ? <Form.Control
                                    type='text'
                                    defaultValue={editedRow ? editedRow.firstName : row.firstName}
                                    id={row.id}
                                    name='firstName'
                                    onChange={(e) => handleOnChangeField(e, row.id)}
                                />
                                : row.firstName
                            }
                        </td>
                        <td>
                            {isEditMode && rowIDToEdit === row.id
                                ? <Form.Control
                                    type='text'
                                    defaultValue={editedRow ? editedRow.lastName : row.lastName}
                                    id={row.id}
                                    name='lastName'
                                    onChange={(e) => handleOnChangeField(e, row.id)}
                                />
                                : row.lastName
                            }
                        </td>
                        <td>
                            {isEditMode && rowIDToEdit === row.id
                                ? <Form.Control
                                    type='text'
                                    defaultValue={editedRow ? editedRow.role : row.role}
                                    id={row.id}
                                    name='role'
                                    onChange={(e) => handleOnChangeField(e, row.id)}
                                />
                                : row.role
                            }
                        </td>
                        {actions &&
                        <td>
                            {isEditMode && rowIDToEdit === row.id
                                ? <button onClick={() => {
                                    if (handleConfirmation()) {
                                        handleSaveRowChanges()
                                        setNotification("Редактирование завершено");
                                    }
                                }} className='custom-table__action-btn'
                                          disabled={!editedRow}>
                                    <Save/>
                                </button>
                                : <button onClick={() => handleEdit(row.id)} className='custom-table__action-btn'>
                                    <PencilFill/>
                                </button>
                            }
                            {isEditMode && rowIDToEdit === row.id
                                ? <button onClick={() => handleCancelEditing()} className='custom-table__action-btn'>
                                    <XSquare/>
                                </button>
                                : <button onClick={() => {
                                    if (handleConfirmation()) {
                                        setNotification("Удаление завершено");
                                        handleRemoveRow(row.id)
                                    }
                                }} className='custom-table__action-btn'>
                                    <Trash/>
                                </button>
                            }
                        </td>
                        }
                    </tr>
                })}
                </tbody>
            </Table>
        </div>

    );
};
export default EditableTable;