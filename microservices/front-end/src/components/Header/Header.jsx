import React from 'react';
import './scss/style.scss';
import Logo from '../../mylogo.png';
import '../Button/Button.jsx';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

class Header extends React.Component {

    // [click, setClick] = useState(false);
    constructor(props) {
        super(props);
        this.state = {
            click: true
        };
    }

    closeMobileMenu = () => this.setState({ click: false });

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
        return (
            <div>
                <header className="header">
                    <div className="overlay has-fade hide-for-desktop"></div>
                    <nav className="cont cont--nav cont--pall flex flex-jc-sb flex-ai-c">
                        <a className="header__logo">
                            <Link to='/' className='navbar-logo' onClick={this.closeMobileMenu}>
                                <img src={Logo} alt="inCharge" />
                            </Link>
                        </a>

                        <a id="btnHamburger" href="#" onClick={this.handleClick} className="header__toggle hide-for-desktop">
                            <span></span>
                            <span></span>
                            <span></span>
                        </a>


                        <div className="header__buttons hide-for-mobile">
                            <a href='' className="sub-button hide-for-mobile">
                                <Link
                                    to='/loginregister'
                                    onClick={this.closeMobileMenu}
                                >
                                    LOG IN
                                </Link></a>

                            <Link
                                to='/loginregister'
                                onClick={this.closeMobileMenu}
                            >
                                <button type="button" className=" btn_teo hide-for-mobile" >
                                    Register</button>
                            </Link>


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