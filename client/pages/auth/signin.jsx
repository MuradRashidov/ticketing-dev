import axios from 'axios';
import React, { useState } from 'react'
import useRequest from '../../hooks/use-request';
import Router  from 'next/router';

const signin = () => {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const { doRequest, errors} = useRequest({
    method:'post',
    url:'/api/users/signin',
    body:{ email, password },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async (e) => {
    e.preventDefault(); 
    doRequest();  
  }

  return (
    <form onSubmit={onSubmit}>
        <h2>Sign In</h2>
        <div className='form-group'> 
            <label>Email</label>
            <input  onChange={e => setEmail(e.target.value)} className='form-control'/>
            {errors[0] && <div className='alert alert-danger mt-2'>
                {
                    errors[0].message
                }
            </div>}
        </div>
        <div className='form-group'> 
            <label className='password'>Password</label>
            <input  onChange={e => setPassword(e.target.value)} type='password' className='form-control'/>
            {errors[1] && <div className='alert alert-danger mt-2'>
                {
                    errors[1].message
                }
            </div>}
        </div>
        <button type='submit' className='btn btn-primary mt-2'>Sign In</button>
    </form>
  )
}

export default signin