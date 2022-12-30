import React from 'react'
import { useState } from "react";
import { ApolloClient, InMemoryCache,gql} from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:8080/v1/graphql",
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
    cache: new InMemoryCache(),
});

const Signup = () =>{
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handlesubmit = (e) =>{
        e.preventDefault();
    //console.log(name, email, password);
    client.mutate({
        mutation: gql`
        mutation MyMutation (
          $name: String!
          $email: String!
          $password: String!
        ){
            insert_user_data_one(
                object: {email: $email, name: $name, password: $password} 
                ){
              id
              email
            }
          } 
      `,
      variables: { name: name, email: email, password: password },
      })
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        console.log(err);
      });
    }

   return(
    <>
    <h1>Signup here</h1>
     <form>
     <label htmlFor="name">First name:</label>
     <input type="text" id="name" name="name" onChange={(e) => setName(e.target.value)}/>
     <br />
     <label htmlFor="email">Email:</label>
     <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} />
     <br/>
     <label htmlFor="password">Password:</label>
     <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)}/>
     <br/>
     <input type="submit"  onClick={handlesubmit}/>
     </form>
    </>
   )
}
   
export default Signup;