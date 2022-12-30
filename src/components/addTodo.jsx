import React from "react";
import { useState, useEffect } from "react";
import {
  ApolloClient,
  InMemoryCache,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:8080/v1/graphql",
  headers: { "x-hasura-admin-secret": "myadminsecretkey" },
  cache: new InMemoryCache(),
});



let data;

const Addtodo = () => {
  const [todo, setTodo] = useState();
  const [todos, setTodos] = useState([{}]);

  const userID = localStorage.getItem("userID");
  const username = localStorage.getItem("username");

  useEffect(() => {
    client
      .query({
        query: gql`query MyQuery {
            user_todo_aggregate(where: {User_Map_Todo: {id: {_eq: ${userID}}}}) {
              nodes {
                id
                task
              }
            }
          }
          `,
      })
      .then((res) => {
        data = res.data.user_todo_aggregate.nodes;
        setTodos(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handlesubmit = (e) => {
    e.preventDefault();

    client
      .mutate({
        mutation: gql`
        mutation MyMutation($todo: String!) {
            insert_user_todo_one(object: {task: $todo, user_id: ${userID}}){
              id
              task
            }
          }
      `,
      variables:{todo: todo}
      })
      .then((res) => {
        const response = res.data.insert_user_todo_one;
        setTodos([...todos, response]);

        setTodo('');
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const deleteData = ( e,id) =>{
    e.preventDefault();

    client
    .mutate({
      mutation: gql`
      mutation MyMutation {
        delete_user_todo(where: {id: {_eq: ${id}}}) {
          returning {
            task
          }
        }
      }
    `,
    })
    .then((res) => {
      const updatedTodo = todos.filter((data)=> data.id != id)
      setTodos(updatedTodo)
    })
    .catch((err) => {
      console.log(err);
    });
  }

  useEffect(() => {
    //console.log(todos)
  }, [todos])

  const readTodo = todos.map((item, index) => {
    return <li key={index}> 
    <button onClick={(e) => deleteData(e,item.id)}>Delete</button>
    <button >Update</button>
    {item.task}</li>
  });

  

  return (
    <>
      <div>Hi, {username}</div>
      <form>
        <label htmlFor="todo">Todo:</label>
        <input
          type="text"
          id="todo"
          name="todo"
          value={todo}
          placeholder="What's on your mind?"
          onChange={(e) => setTodo(e.target.value)}
        />
        <br />

        <input type="submit" onClick={handlesubmit} />
        {readTodo}
      </form>
    </>
  );
};

export default Addtodo;
