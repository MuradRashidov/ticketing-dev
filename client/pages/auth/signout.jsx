import React, { useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const Signout = () => {
    const {doRequest} = useRequest({
        method:"post",
        url:'/api/users/signout',
        body:{},
        onSuccess:() => Router.push('/')
        
    })
    useEffect(() => {
        const signOut = async () => {
            await doRequest();
        };
        
        signOut();
    }, []);
  return (
    <div>Signout</div>
  )
}

export default Signout