import React from "react";
import loginImg from "../EVlogo.png";


export class Register extends React.Component {
    
    
    

    render() {
        let styleObj = {fontSize: 28}
        let styleObj2 = {lineHeight: 2}
        return ( 
        <div className="base.container">
            <div className="content">
                <div className="image">
                    <img src={loginImg} />    
                </div>
                <div className="form" style={styleObj2}>
                    <div className="form-group">
                        <label htmlFor="username"><b> Email (username): &nbsp;&nbsp;&nbsp;</b></label>
                        <input  className = "input_field" type="text" name="username" placeholder="username" id="username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password"> <b>Password: &nbsp;&nbsp;&nbsp;&nbsp;
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b></label>
                        <input   className = "input_field" type="password" name="password" placeholder="password" id="password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="first_name"> <b> Re-enter password: </b></label>
                        <input   className = "input_field" type="Re-enter_password" name="first_name" placeholder="first_name" id="first_name" />
                    </div>
                </div>
            </div>
            <div className="footer">
                <button type="button" className="btn_teo" 
                // onClick={this.handleRegister}
                >
                    Register
                </button>
            </div>
        </div>
        );
    }

    // handleRegister() {
    //     var username = document.getElementById("username").value;    
    //     var password = document.getElementById("password").value; 
    //     var first_name = document.getElementById("first_name").value; 
    //     var last_name = document.getElementById("last_name").value; 
    //     var email = document.getElementById("email").value; 
    //     var telephone_number = document.getElementById("telephone").value; 

    //     var myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     var raw = JSON.stringify({username , password,first_name,last_name,email,telephone_number });

    //     var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    //     };

    //     fetch("http://localhost:5000/api/users/register", requestOptions)
    //     .then(response => response.json())
    //     .then(result => {
    //         if (result.status == 200) {
    //             document.cookie = "charge_evolution_token=" + result.token;
    //             window.location.href = '/';
    //         }
    //         else {
    //             alert(result.msg);
    //         }
    //     })
    //     .catch(error => console.log('error', error));
    //     }      


}