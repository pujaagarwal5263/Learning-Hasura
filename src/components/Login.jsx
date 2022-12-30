import React from 'react'
import { useState } from "react";
import { ApolloClient, InMemoryCache,gql} from "@apollo/client";
import { useNavigate } from 'react-router-dom';

const client = new ApolloClient({
    uri: "http://localhost:8080/v1/graphql",
    headers: { "x-hasura-admin-secret": "myadminsecretkey" },
    cache: new InMemoryCache(),
});

const Login = () =>{
  const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handlesubmit = (e) =>{
        e.preventDefault();
        client.query({
             query: gql`
             query MyQuery(
              $email: String!
              $password: String!
             ) {
              user_data_aggregate(where: {email: {_eq: $email}, password: {_eq: $password}}) {
                nodes {
                  id
                  name
                }
              }
            }
             `,
          variables: { email: email, password: password },
         })
        .then((res) => {
          const userInfo = res.data.user_data_aggregate.nodes[0];
          //userInfo.id and userInfo.email can be used to destructure
          if(userInfo){
            localStorage.setItem("userID",userInfo.id );
            localStorage.setItem("username",userInfo.name );
            navigate("/addtodo")
          }else{
            //do not allow to login
            console.log("invalid credentials");
            navigate("/login")
          }
        })
        .catch((err) => console.error(err));
    }

   return(
    <>
    <h1>Login here</h1>
     <form>
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
   
export default Login;