import React from "react";
import loginImg from "../../mylogo2.png";
import GoogleLogin from "react-google-login";
import {login_register_url} from "../../base_url";
import Swal from "sweetalert2";
import validator from 'validator';


export class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '' ,
            password: '',
            email: '',
            formErrors: {email: '', password: ''},
            emailValid: false,
            passwordValid: false,
            formValid: false
        };
    }
    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value},
            () => { this.validateField(name, value) });
    }

    validateField = (fieldName, value) => {
        let fieldValidationErrors = this.state.formErrors;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch(fieldName) {
            case 'email':
                emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                fieldValidationErrors.email = emailValid ? '' : ' is invalid';
                break;
            case 'password':
                passwordValid = value.length >= 6;
                fieldValidationErrors.password = passwordValid ? '': ' is too short';
                break;
            default:
                break;
        }
        this.setState({formErrors: fieldValidationErrors,
            emailValid: emailValid,
            passwordValid: passwordValid
        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }




    handleRegister = (event) => {
        let username = this.state.username;
        let password = this.state.password;
        let email = this.state.email;

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        let urlencoded = new URLSearchParams();
        urlencoded.append("username", username);
        urlencoded.append("password", password);
        urlencoded.append("email", email);
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(login_register_url + "/register", requestOptions)
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
                    window.location.href = '/loginregister';
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
        fetch(login_register_url + "/googleregister", requestOptions)
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
        <div className="base.container" >

            <div className="content">
                <div className="image">
                    <img src={loginImg} />    
                </div>
                <div className="form" style={styleObj2}>
                    <div className="form-group">
                        <label htmlFor="username"><b> Username: </b></label>
                        <input className = "input_field" type="text" name="username" onChange={this.handleUserInput} placeholder="Username" id="username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"> <b>Password:</b></label>
                        <input className = "input_field" type="password" name="password" onChange={this.handleUserInput} placeholder="Password" id="password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email"> <b> Email: &nbsp;&nbsp;&nbsp;</b></label>
                        <input className = "input_field" type="text" name="email" onChange={this.handleUserInput} placeholder="Email Address" id="email" />
                    </div>
                </div>
            </div>
            <div className={"panel"}>
                <div className='formErrors'>
                    {Object.keys(this.state.formErrors).map((fieldName, i) => {
                        if(this.state.formErrors[fieldName].length > 0){
                            return (
                                <p key={i}>{fieldName} {this.state.formErrors[fieldName]}</p>
                            )
                        } else {

                            return (
                                <p className={"hide-for-desktop hide-for-mobile"} />
                            )
                        }
                    })}
                </div>
            </div>
            <div className="register_button">
                <button type="button" className="btn_teo btn_form"  onClick={this.handleRegister}>Register</button>
            </div>
            <GoogleLogin
                clientId="1074766905977-lm80vj56vtkl2r3qh0urnv1eeaut71ns.apps.googleusercontent.com"
                buttonText="Register with Google"
                onSuccess={this.responseSuccessGoogle}
                onFailure={this.responseFailGoogle}
                cookiePolicy={'single_host_origin'}
            />
            <div className="other_option ">
                <a onClick={changeChoice} className="log_option" name="Log In">Already Registered?</a>
            </div>
        </div>
        );
    }

  
}