import React from "react";
import "../components/LoginRegister/scss/style.scss";
import { Login } from "../components/LoginRegister/Login";
import { Register } from "../components/LoginRegister/Register";
import "../components/Header/scss/style.scss"
class LoginRegister extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoginActive: true
      };
      
    }
  
    componentDidMount() {
      //Add .right by default
      this.rightSide.classList.add("right");
    }

    changeState() {
      const { isLoginActive } = this.state;
      const LoginClass = document.getElementById("log");
      if (!isLoginActive) {
          LoginClass.classList.remove("LeftPadding");
          LoginClass.classList.add("RightPadding");
      }
      else {
          LoginClass.classList.remove("RightPadding");
          LoginClass.classList.add("LeftPadding");
      }
      if (isLoginActive) {
        this.rightSide.classList.remove("right");
        this.rightSide.classList.add("left");


      } else {
        this.rightSide.classList.remove("left");
        this.rightSide.classList.add("right");

      }
      this.setState(prevState => ({ isLoginActive: !prevState.isLoginActive }));
    }


    render() {
      const { isLoginActive } = this.state;
      const current = isLoginActive ? "Register" : "Login";
      const currentActive = isLoginActive ? "login" : "register";

      return (
        <div className="LoginRegister RightPadding" id="log" >
          <div className="login"  >
            <div className="container" ref={ref => (this.container = ref)}>
              {isLoginActive && (
                <Login
                    containerRef={ref => (this.current = ref)}
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
            <RightSide
              current={current}
              currentActive={currentActive}
              containerRef={ref => (this.rightSide = ref)}
              onClick={this.changeState.bind(this)}
            />
          </div>
        </div>
      );
    }
  }
  
  const RightSide = props => {
    return (

          <div className="right-side " ref={props.containerRef} onClick={props.onClick} >
            <div className="inner-container ">
              <div className="text">{props.current}</div>
            </div>
          </div>

    );
  };
  export default LoginRegister;