import React, { useState } from 'react'
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
    const [title,setTitle] = useState('');
    const [price,setPrice] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: { title, price },
        onSuccess: (ticket) => console.log(ticket)
        
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        doRequest();
    }
    const onBlur = () => {
        const value = parseFloat(price);
        if(isNaN(value)){ return };
        setPrice(value.toFixed(2));
    }
  return (
    <div>
        <h3>Create new ticket</h3>
        <form onSubmit={handleSubmit}>
            <div className='form-group'>
                <label htmlFor="title">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} id='title' className='form-control'/>
                {errors[0] && <div className='alert alert-danger mt-2'>
                {
                    errors[0].message
                }
            </div>}
            </div>
            <div className='form-group'>
                <label htmlFor="price">Price</label>
                <input onBlur={onBlur} value={price} onChange={(e) => setPrice(e.target.value)} id='price' className='form-control'/>
                {errors[1] && <div className='alert alert-danger mt-2'>
                {
                    errors[1].message
                }
            </div>}
            </div>
            <button className='btn btn-primary'>Submit</button>
        </form>
    </div>
  )
}

export default NewTicket