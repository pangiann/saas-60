import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Link } from 'react-router-dom';
import './Navbar.css';
import getCookie from '../functions/getCookie.js'
import Swal from 'sweetalert2'
import logoImg from "../EVlogo2.png";




function Navbar() {
  
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [validated, setValidated] = useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

    // Logout method
// function logout(){
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");
//     myHeaders.append("charge_evolution_token",  getCookie('charge_evolution_token'));
//     var requestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     redirect: 'follow'
//     };

//     fetch("http://localhost:5000/api/users/logout", requestOptions)
//     .then(response => response.json())
//     .then(result => {
//         if (result.status == 200) {
//             Swal.fire({
//               title: 'Success',
//               text: result.msg,
//               icon: 'success',
//               customClass: "swal_ok_button",
//               confirmButtonColor: "#000000"
//             }).then(function () {
//                 setValidated(false);
//                 window.location.href = '/';
//             });
            
//         }
//         else {
//             Swal.fire({
//                     title: 'error',
//                     text: result.msg,
//                     icon: 'success',
//                     customClass: "swal_ok_button",
//                     confirmButtonColor: "#000000"
//                   })
//         }
//     })
//     .catch(error => console.log('error', error));
//   }


  const fullNavbar = () => {
    return (
  
    <>
        <nav className='navbar'>
          <div className='navbar-container'>
            <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            <img src={logoImg} className="logo-img" />    
              Ask Me Everything
            </Link>
            <div className='menu-icon' onClick={handleClick}>
              <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
                <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
                
              <li className='nav-item'>
                <Link
                  to='/charge'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Charge
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  to='/profile'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to='/'
                  className='nav-links-mobile'
                  // onClick={logout}
                >
                  Log out
                </Link>
              </li>
            </ul>
            {button && <Button buttonStyle='btn--outline' 
            // onClick={logout}
            >Log out</Button>}
          </div>
        </nav>
      </>
      );
  }
  const halfNavbar = () => {
    return (
  
      <>
          <nav className='navbar'>
            <div className='navbar-container'>
              <Link to='/'   className='navbar-logo' onClick={closeMobileMenu}>
                
                <img src={logoImg} className="logo-img" />    
                Ask Me Everything
    
              </Link>
              <div className='menu-icon' onClick={handleClick}>
                <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
              </div>
              <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                <li className='nav-item'>
                  <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to='/loginregister'
                    className='nav-links-mobile'
                    onClick={closeMobileMenu}
                  >
                    Log in
                  </Link>
                </li>
              </ul>
              {button && <Button buttonLink = '/loginregister' buttonStyle='btn--outline'>Log in</Button>}
            </div>
          </nav>
        </>
        );
  }
  




  

  useEffect(() => {


    // // Validation
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("charge_evolution_token",  getCookie('charge_evolution_token'));
    var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
    };

    fetch("http://localhost:5000/api/users/validate", requestOptions)
    .then(response => response.json())
    .then(result => {
        if (result.status == 200) {
            setValidated(true);
            
        }
        else {
          alert(this.validated);
          Swal.fire({
            title: 'Not authenticated',
            text: result.msg,
            icon: 'info',
            customClass: "swal_ok_button",
            confirmButtonColor: "#000000"
          })
        }
    })
    .catch(error => console.log('error', error));
    // // End of validation  
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  if (validated) {
    console.log("VALID");
    return fullNavbar();
  }
  else {
    console.log("INVVALID");
    return halfNavbar();
  }




}








export default Navbar;