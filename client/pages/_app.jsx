import 'bootstrap/dist/css/bootstrap.css';
import React from 'react'
import buildClient from '../api/build-client';
import Header from '../components/Header';

const AppCommponent = ({ Component, pageProps, currentUser }) => {
 return (
    <div>
      <Header currentUser={currentUser}/>
      <div className="container">
        <Component currentUser={currentUser} {...pageProps}/> 
      </div>
    </div>
  )
}

AppCommponent.getInitialProps = async (appContext) => {
   console.log('App');
   
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser);
    }
    
    console.log(data);
    
    return { pageProps, ...data };
}

export default AppCommponent;