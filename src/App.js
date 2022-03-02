import './App.css';
import React, {useEffect} from 'react';
import {useState} from "react";
import Loading from "./components/Loading";
import EditTable from "./components/EditTable";

function App() {
  const [data, setData] = useState(null);
  const columns = [
    { field: 'id', fieldName: '#' },
    { field: 'firstName', fieldName: 'First Name' },
    { field: 'lastName', fieldName: 'Last Name' },
    { field: 'role', fieldName: 'User\'s role' },
  ];
  useEffect(() => {
    fetch('http://localhost:8080/tableData')
        .then(response => response.json())
        .then(json => setData(json))
  }, []);


  return (
    <div className="App">
      <div>{data ? <EditTable columns = {columns} rows = {data} actions /> : <Loading />}</div>
    </div>
  );
}

export default App;
