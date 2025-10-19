import React from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";
import "./App.css";

function App() {
  return (
    <div className="container">
      <h1 className="title">Quản lý User</h1>
      <AddUser />
      <UserList />
    </div>
  );
}

export default App;
