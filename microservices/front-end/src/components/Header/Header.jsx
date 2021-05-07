import React from 'react';
import './scss/style.scss';
import Logo from '../../images/driverslogo.png';
import '../Button/Button.jsx';

class Header extends React.Component {
    
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
            fadeElems.forEach(function(element){
                element.classList.remove('fade-in');
                element.classList.add('fade-out');
            })
       
        }
        else { // open hamburger menu
            body.classList.add('noscroll');
    
            header.classList.add('open');
            fadeElems.forEach(function(element){
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
                            <img src={Logo} alt="inCharge" />
                        </a>

                        <a id="btnHamburger" href="#" onClick={this.handleClick} className="header__toggle hide-for-desktop">
                            <span></span>
                            <span></span>
                            <span></span>
                        </a>


                        <div className="header__buttons hide-for-mobile">
                            <a href='' className="sub-button hide-for-mobile">LOG IN</a>
                            <button type="button" className=" btn_teo hide-for-mobile">Register</button>
                        </div>
                    </nav>
                </header>
                <div className="header__menu has-fade hide-for-desktop">
                    <a href="/">Home</a>
                    <a href="/">Drivers</a>
                    <a href="/">Business</a>
                    <a href="/">Log In</a>
                    <a href="/">Register</a>
                </div>
            </div>
       );

    }
}

export default Header;