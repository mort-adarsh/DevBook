import { Fragment, useState } from "react"
import React from 'react'
import axios from "axios";
import { Link } from "react-router-dom";

export const Login = () => {
    const [formData, setFormData] = useState({
       
        email: '',
        password: ''
        
    });
    const {email, password} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]:e.target.value});
    const onSubmit = async e => {
        e.preventDefault();
            console.log('sucess');
        
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign IN</p>
            <form className="form" onSubmit={e=>onSubmit(e)}>
                <div className="form-group">
                <input type="email" placeholder="Email Address" name="email" value = {email} onChange={e=> onChange(e)} required/>
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                >
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value = {password} onChange={e=> onChange(e)}
                    minLength="6"
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Login" />
            </form>
            <p className="my-1">
                Dont HAave account <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>

    )
}

export default Login;

