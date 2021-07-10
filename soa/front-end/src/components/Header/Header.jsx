import React from 'react';
import './scss/style.scss';
import Logo from '../../mylogo.png';
import '../Button/Button.jsx';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import {analytics_url, bus_analytics_url} from "../../base_url";

class Header extends React.Component {

    // [click, setClick] = useState(false);
    constructor(props) {
        super(props);
        this.state = {
            click: true,
            logged: false,
            username: ''
        };
    }
    async componentDidMount() {
        if (Cookies.get("token_id") !== '') {

            var myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer " + Cookies.get("token_id"));
            myHeaders.append("Content-Type", "application/json");
            const data = JSON.stringify({ userId : Cookies.get("user_id") });
            const raw = JSON.stringify({
                base_route: "analytics",
                api_route: "user",
                method: "post",
                data: data
            })

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            const response = await fetch(bus_analytics_url, requestOptions)
            const json = await response.json();
            // console.log(json.result);
            await this.setState({
                username: json.result.result.username
            })
            await this.setState({
                logged: true
            })
        }
    }

    closeMobileMenu = () => this.setState({ click: false });
    logout = () => {
            document.cookie =  'token_id = ; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie =  'user_id =; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            this.setState({
                logged: false
            })
    }

    handleClick(e) {
        e.preventDefault();
        const btnHamburger = document.querySelector('#btnHamburger');
        const header = document.querySelector('.header');
        const overlay = document.querySelector('.overlay');
        const fadeElems = document.querySelectorAll('.has-fade');
        const body = document.querySelector('body');
        console.log('The link was clicked.');
        if (header.classList.contains('open')) { // close hamburger menu
            body.classList.remove('noscroll');

            header.classList.remove('open');
            fadeElems.forEach(function (element) {
                element.classList.remove('fade-in');
                element.classList.add('fade-out');
            })

        }
        else { // open hamburger menu
            body.classList.add('noscroll');
            header.classList.add('open');
            fadeElems.forEach(function (element) {
                element.classList.remove('fade-out');
                element.classList.add('fade-in');
            })


        }
    }

    render() {
        const renderprofile = () => {
            if (this.state.logged) {
                return (
                    <a href="">

                        <Link to='/myprofile' onClick={this.closeMobileMenu}>
                            Profile
                        </Link>
                    </a>
                );
            } else {
                return <></>;
            }
        }
        const renderlogout = () => {
            if (this.state.logged) {
                return (
                    <>
                        <a className="username2">
                            <b>{this.state.username}</b>
                        </a>

                        <Link
                            to='/'
                            onClick={this.logout}
                        >
                            <button type="button" className=" btn_header hide-for-mobile" >
                                Logout</button>
                        </Link>
                    </>
                );
            } else {
                return (
                    <>
                        <Link
                            to='/loginregister'
                            onClick={this.closeMobileMenu}
                        >
                            LOG IN
                        </Link>

                        <Link
                            to='/loginregister'
                            onClick={this.closeMobileMenu}
                        >
                            <button type="button" className="btn_header  hide-for-mobile" >
                                Register</button>
                        </Link>
                    </>
                );
            }
        }
        return (
            <div>
                <header className="header">
                    <div className="overlay has-fade hide-for-desktop"/>
                    <nav className="cont cont--nav cont--pall flex flex-jc-sb flex-ai-c">
                        <a className="header__logo">
                            <Link to='/' className='navbar-logo' onClick={this.closeMobileMenu}>
                                <img src={Logo} alt="inCharge" />
                            </Link>
                        </a>

                        <a id="btnHamburger" href="#" onClick={this.handleClick} className="header__toggle hide-for-desktop">
                            <span/>
                            <span/>
                            <span/>
                        </a>


                        <div className="header__links hide-for-mobile">
                                <div className={"page_choices"}>
                                    {renderprofile()}
                                    <a href="">
                                        <Link to='/askquestion' >
                                            AskQuestion
                                        </Link>
                                    </a>
                                    <a href="">
                                        <Link to='/answerquestion' onClick={this.closeMobileMenu}>
                                            AnsQuestion
                                        </Link>
                                    </a>
                                    <a href="">
                                        <Link to='/keywords' onClick={this.closeMobileMenu}>
                                            Keywords
                                        </Link>
                                    </a>
                                    <a href="">
                                        <Link to='/timesearch' onClick={this.closeMobileMenu}>
                                            TimeSearch
                                        </Link>
                                    </a>
                                </div>

                        </div>
                        <div className={"header__buttons hide-for-mobile"}>
                                {renderlogout()}
                        </div>
                    </nav>
                </header>
                <div className="header__menu has-fade hide-for-desktop">
                    <a href="/">Home</a>
                    <a href="">
                        <Link to='/myprofile' onClick={this.closeMobileMenu}>
                            Profile
                        </Link>
                    </a>
                    <a href="">
                        <Link to='/askquestion' onClick={this.closeMobileMenu}>
                            Ask question
                        </Link>
                    </a>
                    <a href="">
                        <Link to='/answerquestion' onClick={this.closeMobileMenu}>
                            Answer question
                        </Link>
                    </a>
                    <a href="">
                        <Link to='/keywords' onClick={this.closeMobileMenu}>
                            Keyword Search
                        </Link>
                    </a>
                    <a href="">
                        <Link to='/timesearch' onClick={this.closeMobileMenu}>
                            Time Search
                        </Link>
                    </a>
                    <a href="">
                        <Link to='/loginregister' onClick={this.closeMobileMenu}>
                            Log In - Register
                        </Link>
                    </a>
                </div>
            </div>
        );

    }

}

export default Header;