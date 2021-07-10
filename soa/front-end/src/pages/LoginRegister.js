import React from "react";
import "../components/LoginRegister/scss/style.scss";
import { Login } from "../components/LoginRegister/Login";
import { Register } from "../components/LoginRegister/Register";
import "../components/Header/scss/style.scss"
import validator from 'validator'

class LoginRegister extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoginActive: true
      };
      
    }
    componentDidMount() {
      //Add .right by default
    }

    changeState() {
      const { isLoginActive } = this.state;
      this.setState(prevState => ({ isLoginActive: !prevState.isLoginActive }));
    }


    render() {
      const { isLoginActive } = this.state;
      const current = isLoginActive ? "Register" : "Login";
      const currentActive = isLoginActive ? "login" : "register";

      return (
        <div className="LoginRegister " id="log" >
          <div className="login"  >
            <div className="container" ref={ref => (this.container = ref)}>
              {isLoginActive && (
                <Login
                    // containerRef={ref => (this.current = ref)}
                    changeChoice={this.changeState.bind(this)}

                />
              )}
              {!isLoginActive && (
                <Register
                    containerRef={ref => (this.current = ref)}
                    changeChoice={this.changeState.bind(this)}
                />

              )}
            </div>
          </div>
        </div>
      );
    }
  }

  export default LoginRegister;