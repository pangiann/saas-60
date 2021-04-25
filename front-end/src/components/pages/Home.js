import React,{ useState} from 'react';
import { Button } from '../Button';
import '../Home.css';
import Dropdown from 'react-bootstrap/Dropdown'
import { Link } from 'react-router-dom';
import { id } from 'date-fns/locale';
import '../../App.css'


let formElements = [
  {
    label: "Brand Model and Release Year:",
    key: 'vehicle_id'
  },
  {
  label: "Plate number:",
  key: 'plate_number'
}
]


function Home(props) {
 
  const submit = () => {
    if (IsFormInvalid()){
      return
    }
    alert(JSON.stringify(formData))

  }

  const dosmth = () => {
    alert("hello");
  }

  const IsFormInvalid = () => {
    let returnvalue = false;
    formElements.forEach(formElement =>{
      if(formData[formElement.key] === undefined){
        alert(formElement.key + " is missing");
        returnvalue = true
      }
    })
  }

  const [formData,setformData] = useState({});

  const handleChange = (value: string,key: string) =>{
    console.log(value)
    setformData({...formData,...{[key]:value}});
  }

  const handleChange2 = (target: string,key: string) =>{
      const index = target.selectedIndex;
      const optionElement = target.childNodes[index];
      const optionElementId = optionElement.getAttribute('id');

      console.log(optionElementId);
    
    setformData({...formData,...{[key]:optionElementId}});
  }

  console.log(props.vehicles);
  return (
    <div className='profilestyle'>
      <div className='profile-title-container'>
        <div className='profile-title-container'>
          <h1><i class="fas fa-user-alt"></i>&nbsp;&nbsp;My profile</h1>
        </div>
        <div className='profileboxbox'>
          <div className='profile-box'>
            <div className='profile-text'> Username: &nbsp;&nbsp;{props.profile.username}</div>
            <br></br>
            <div className='profile-text'>First Name: &nbsp;&nbsp;{props.profile.first_name}</div>
            <br></br>
            <div className='profile-text'>Last Name: &nbsp;&nbsp;{props.profile.last_name}</div>
            <br></br>
            <div className='profile-text'>Email adress: &nbsp;&nbsp;{props.profile.email}</div>
            <br></br>
            <div className='profile-text'>Telephone number:&nbsp;&nbsp; {props.profile.telephone_number}</div>
          </div>
          <Link to='/balance' className={{textDecoration: 'none'}}>     
            <button className='profilebtns2'>
              <a>
              <i class="fas fa-balance-scale-right"></i>&nbsp;&nbsp;My Balance
              </a>
            </button>
          </Link>
          <Link to='/sessions' className={{textDecoration: 'none'}}>  
            <button className='profilebtns2'>
              <a>
              <i class="fas fa-charging-station"></i>&nbsp;&nbsp;My Sessions
              </a>
            </button>
          </Link>
        </div>
        <br></br>
        <div className='profile-title-container'>
          <h1><i class="fas fa-car"></i>&nbsp;&nbsp;My vehicles</h1>
        </div>               
        <div className= "cars-profile" >
          { props.vehicles.map(vehicle=> 
            <div className='cars-profile-box'>
              <div className='profile-text'>Model: &nbsp;&nbsp;{ vehicle.brand}</div>
              <br></br>
              <div className='profile-text'>Plate Number: &nbsp;&nbsp;{vehicle.plate_number}</div>
              <br></br>
              <div className='profile-text'> Brand: &nbsp;&nbsp;{vehicle.brand}</div>
              <br></br>
              <div className='profile-text'> Variant: &nbsp;&nbsp;{vehicle.variant}</div>
              <br></br>
              <div className='profile-text'> Energy Consumption: &nbsp;&nbsp;{vehicle.energy_consumption}</div>
              <br></br>
              <div className='profile-text'> Release Year: &nbsp;&nbsp;{vehicle.release_year}</div>
              <br></br>
              <div className='profile-text'> Type: &nbsp;&nbsp;{vehicle.type}</div>
            </div>
          )}
      </div>
      <br></br>
      <div className='profile-title-container'>
          <h1><i class="far fa-file-alt"></i>&nbsp;&nbsp;Fill the form to add a vehicle</h1>
      </div>
      <div className = "formbox">
        <form> 
          {formElements.map(formElement=> {
            if(formElement.key=='vehicle_id'){
              return(
                <div>
                  <br></br>
                  Pick model:&nbsp;&nbsp;
                  <select  
                  value={formData[formElement.key]} 
                  onChange={(e)=>{handleChange2(e.target,formElement.key)}}
                  className="selectprofiledrop"
                  >
                    {props.allvehicles.map(id=>
                      <option id={id.id}>
                        {String.prototype.concat(id.brand,'  ',id.model,' ',id.release_year)}   
                      </option>
                    )}
                  </select>
                </div>
              )
            }
            else{
              return(
                <div className ="m-3">
                  <br></br>
                  Insert the plate number:
                  <input 
                  className="selectprofileinput"
                  value={formData[formElement.key]} 
                  onChange={(e)=>{handleChange(e.target.value,formElement.key)}}/>
                </div>
              )
            }
          })}
          <button className='profilebtns' onClick={(e) =>{submit()}}>
          <i class="fas fa-check-circle"></i>&nbsp;&nbsp;Submit
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}


export default Home;