import axios from 'axios'
import React from 'react'

const LandingPage = ({currentUser}) => {
  //axios.get('/api/users/currentuser');
  console.log(currentUser);
  
  return (
    <div className="container">
    <h1 className="text-center text-primary my-5">Bootstrap Testi</h1>
    <button className="btn btn-primary">Bootstrap Buton</button>
  </div>
  )
}

LandingPage.getInitialProps = async () => {
  let res = await axios.get('http://auth-srv:3000/api/users/currentuser');

    return res.data;
}

export default LandingPage