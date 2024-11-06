import axios from 'axios'
import React from 'react'
import buildClient from '../api/build-client';

const LandingPage = ({data}) => {
  //axios.get('/api/users/currentuser');
  console.log(data);
  
  return (
    <div className="container">
    <h1 className="text-center text-primary my-5">{data?.currentUser?"Sign Out":"Sign In"}</h1>
    <button className="btn btn-primary">Bootstrap Buton</button>
  </div>
  )
}

LandingPage.getInitialProps = async (context) => {
  console.log("landing");
  
  const client = buildClient(context); // Get axios instance from buildClient
  const { data } = await client.get('/api/users/currentuser'); // Make the API request
return { data };
  
}

export default LandingPage