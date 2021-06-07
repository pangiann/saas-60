import React, { useState } from 'react'
import './scss/App.css';
import DatePicker from 'react-datepicker';
import TimeKeeper from 'react-timekeeper';
import moment from 'moment';
import pointimg from "../ChoicesBoxes/images/statistics.jpg";
import "react-datepicker/dist/react-datepicker.css"
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
// import getCookie from '../../functions/getCookie.js'
// import jwt_decode from "jwt-decode";





// function reserveSlot(point_id,effective_timestamp){
//   effective_timestamp = "asdasd";
//   var reservation_html = document.getElementById("reservation-details").outerHTML;
//   // var reservation_html = <div>asd</div>;
//   Swal.fire({
//     title: '<strong>Your reservation details</strong>',
//     html: reservation_html,
//     showCloseButton: true,
//     showCancelButton: true,
//     focusConfirm: false,
//     confirmButtonText: "Yes , reserve slot",
//     cancelButtonText: "No , do not reserve"
//   }).then((result) => {
    
//     if (result.isConfirmed){
//       var decoded = jwt_decode( getCookie('charge_evolution_token'));      
//       var myHeaders = new Headers();
//       myHeaders.append("charge_evolution_token", getCookie("charge_evolution_token"));
//       myHeaders.append("Content-Type", "application/json");
      
//       var raw = JSON.stringify({"point_id":point_id,"effective_timestamp":effective_timestamp});
//       var requestOptions = { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow'};
      
//       fetch("http://localhost:5000/api/users/reservations/" + decoded.id, requestOptions)
//         .then(response => response.json())
//         .then(result => {
//           if (result.status == 200) {
//             Swal.fire({
//                 title: 'Success',
//                 text: result.msg,
//                 icon: 'success',
//                 customClass: "swal_ok_button",
//                 confirmButtonColor: "#242424"
//               });
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
//         })
//         .catch(error => console.log('error', error));
//     }
    
          
//     })

// }





function TimeSearch (props) {
//   console.log(props.location.state);
//   const station = props.location.state.selected_station;
//   const point = props.location.state.selected_point;
//   if (point.fast_charging === 'True') var fast_charging = "Capable of fast charging" ;
//   if (point.fast_charging === 'False') var fast_charging = "Not capable of fast charging"; 
//   if (point.fast_charging === 'Uknown') var fast_charging = "Not capable of fast charging";
//   const fast_charging_const = fast_charging;
//   const connector = point.title + " " + point.level + " " + point.current 
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [time, setTime] = useState('12:35')
  return (
    <div>
      <div className="containercarimg">
        <img src={pointimg} className="resize_fit_center" /> 
        <br></br>
        <div className="rowrendezvous">
          <div className="columnrendezvous">
              <div className="pane-title-container" >
                <h2>Details of your reservation</h2>
              </div>
              <br></br>
              <div id='reservation-details' className="randezvous-pane">
                <p>Address: 
                    {/* {station.address} */}
                    </p>              
                <p>Town: 
                    {/* {station.town} */}
                </p>
                <p>Postcode: 
                    {/* {station.postcode}  */}
                </p>
                <p>Contact Phone: 
                    {/* {station.phone} */}
                    </p>            
                <p>Point specs: 
                    {/* {connector} */}
                </p>
                <p>Fast charging: 
                    {/* {fast_charging_const} */}
                    </p>
                <hr></hr>
                <p><b>Date: 
                    {moment(selectedDate).format('YYYY-MM-DD')}
                </b> </p>
                <p>Time: {time} </p>
              </div>
            </div>
        
          <div className='columnrendezvous'>
            <div className="pane-title-container">
              <h2>Pick date</h2>
            </div>
            
            <div className="pane-title-container">
              <DatePicker
                className='react-datepicker'
                selected={selectedDate}
                onChange={(timetoshow) => setSelectedDate(timetoshow) }
                dateFormat="dd/MM/yyyy"
                placeholderText={'DD/MM/YYYY'}
                minDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                popperPlacement='bottom-end'
                    popperModifiers={{
                        flip: {
                            enabled: false
                        }}}
              />
            </div>
            
          </div>
          <div className="columnrendezvous">
            <div className="pane-title-container">
              <h2>Pick time</h2>
            </div>
            <br></br>
            <div  className="pane-title-container">
              <div className="clockstyle">
              <TimeKeeper
                time={time}
                onChange={(newTime) => setTime(newTime.formatted24)}
                switchToMinuteOnHourSelect
                hour24Mode
                coarseMinutes={5}
                forceCoarseMinutes
              />
              </div>
            </div>
          </div>
          <div className="columnrendezvous">
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          
            <button type="button" className='btn--large4'
            //  onClick={ () =>  reserveSlot(point.id , moment(selectedDate).format('YYYY-MM-DD') + " :00")}
             >
            <i class="fas fa-calendar-check"></i>&nbsp;Book charging slot now!
            </button>
          
          </div>
          
        </div>
        <br></br>
          <br></br>
          <br></br>
      </div>
      
    </div>
    
  )
}

export default TimeSearch
