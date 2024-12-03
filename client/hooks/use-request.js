import axios from 'axios'
import React, { useState } from 'react'

const useRequest = ({method,url,body,onSuccess}) => {
    const [ errors, setErrors ] = useState([]);
  const doRequest = async (params = {}) => {
    try {
       const res = await axios[method](url,{...params,...body});
       setErrors([]);
       onSuccess(res.data);
       return res.data;
      } catch (error) {
        setErrors(error.response.data.errors)
      }
  }
  return { doRequest, errors }
}

export default useRequest