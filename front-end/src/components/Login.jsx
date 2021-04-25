import React from "react";
import loginImg from "../EVlogo.png";
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2'


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

    render() {
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
                        <input className = "input_field" type="text" name="username" id="username" placeholder="username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"> <b>Password&nbsp;&nbsp;</b></label>
                        <input className = "input_field" type="password"  name="password" id="password" placeholder="password" />
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn_teo"
                //  onClick={this.handleLogin}
                 >
                    Login
                </button>
            </div>

        </div>
        );
    }

    // handleLogin() {
    //     var username = document.getElementById("username").value;    
    //     var password = document.getElementById("password").value; 
    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     var raw = JSON.stringify({username , password});

    //     var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    //     };

    //     fetch("http://localhost:5000/api/users/login", requestOptions)
    //     .then(response => response.json())
    //     .then(result => {
    //         if (result.status == 200) {
    //             Swal.fire({
    //                 title: 'Success',
    //                 text: result.msg,
    //                 icon: 'success',
    //                 customClass: "swal_ok_button",
    //                 confirmButtonColor: "#242424"
    //               }).then(function () {
    //                 document.cookie = "charge_evolution_token=" + result.token;
    //                 window.location.href = '/';
    //               })
                
                
    //         }
    //         else {
    //             Swal.fire({
    //                 title: 'Error!',
    //                 text: result.msg,
    //                 icon: 'error',
    //                 customClass: "swal_ok_button",
    //                 confirmButtonColor: "#242424"
    //               })
    //         }
    //     })
    //     .catch(error => console.log('error', error));
    //     }      

}