import React from "react";
import loginImg from "../../mylogo2.png";
import {base_url} from "../../base_url";
//import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2'
import GoogleLogin from 'react-google-login';


export class Login extends React.Component {
    
    
    componentDidMount(){
    }
    
    constructor(props) {
        super(props);
        // this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            username: "",
            password: ""
        };
    }
    changeStateHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }
    handleLogin = (event) => {
        let username = this.state.username;
        let password = this.state.password;
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(base_url + "/signin", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    return response.text();
                } else {
                    throw new Error(response.status);
                }
            })
            .then(result => {
                const json_obj = JSON.parse(result);
                Swal.fire({
                    title: 'Success',
                    text: json_obj.msg,
                    icon: 'success',
                    customClass: "swal_ok_button",
                    confirmButtonColor: "#242424"
                }).then(function () {
                    document.cookie = "token_id = " + json_obj.token;
                    window.location.href = '/';
                })


            })
            .catch(error => {
                 Swal.fire({
                      title: 'Error!',
                      text: error,
                      icon: 'error',
                      customClass: "swal_ok_button",
                      confirmButtonColor: "#242424"
                });
            });
    }
    responseSuccessGoogle(response) {

        const raw = JSON.stringify({tokenId: response.tokenId});
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        fetch(base_url + "/googlelogin", requestOptions)
             .then(response => response.json())
             .then(result => {
                console.log(result);
             })
             .catch(error => console.log('error', error));


    }
    responseFailGoogle(response) {
        console.log(response);
    }
    render() {
        const changeChoice = this.props.changeChoice;
        let styleObj = {fontSize: 28}
        let styleObj2 = {lineHeight: 2}
        return ( 
        <div className="base.container" ref= {this.props.containerRef}>
            
            <div className="content">
                <div className="image">
                    <img src={loginImg} />    
                </div>
                <div className="form" style={styleObj2}>
                    <div className="form-group">
                        <label htmlFor="username"> <b> Username </b></label>
                        <input className = "input_field" type="text" name="username" id="username" onChange={this.changeStateHandler} placeholder="username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"> <b>Password&nbsp;&nbsp;</b></label>
                        <input className = "input_field" type="password"  name="password" id="password" onChange={this.changeStateHandler} placeholder="password" />
                    </div>
                </div>
            </div>
            <div className="login_button">
                <button type="button" className="btn_teo" onClick={this.handleLogin}>
                    Login
                </button>
            </div>
            <GoogleLogin
                clientId="1074766905977-lm80vj56vtkl2r3qh0urnv1eeaut71ns.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={this.responseSuccessGoogle}
                onFailure={this.responseFailGoogle}
                cookiePolicy={'single_host_origin'}
            />
            <div className="other_option hide-for-desktop">
                <a onClick={changeChoice} className="log_option" name="Register">Not Registered Yet?</a>
            </div>

        </div>
        );
    }



}