import React from 'react';
import Link from 'next/link';

const Header = ({currentUser}) => {
    const links = [
        !currentUser && {label:'sign in', href:"/auth/signin"},
        !currentUser && {label:'sign up', href:"/auth/signup"},
        currentUser && {label:'sign out', href:"/auth/signout"},
    ]
    .filter(l=>l)
    .map((link) => {
        return (
            <li key={link.href} className='nav-item my-2'>
                <Link style={{textDecoration:"none",margin:"0 5px"}} href={link.href}>{link.label}</Link>
            </li>
        )
    })
  return (
    <nav className='navbar navbar-light bg-light p-2'>
        <Link className="navbar-brand" href="/">
             GC
        </Link>
        <div className='d-flex justify-content-end'>
           
                <ul className='nav d-flex align-items-center'>
                    {links}
                </ul>
         
        </div>
    </nav>
  )
}

export default Header