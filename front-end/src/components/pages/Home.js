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

  // console.log(props.vehicles);
  return (
    <div className='profilestyle'>
      <div className='profile-title-container'>
        <div className='profile-title-container'>
          Welcome to <b>AskMeAnything</b>!
        </div>
        <div className='profileboxbox'>
          <div className='profile-box'>
            <div className = "formbox">
                      {/* <div className ="m-3">
                        <br></br>
                        Insert the plate number:
                        <input 
                        className="selectprofileinput"
                        value={value} 
                        onChange={(e)=>{handleChange(e.target.value)}}/>
                      </div> */}
                    
                <button className='profilebtns' onClick={(e) =>{submit()}}>
                &nbsp;&nbsp;Submit
                </button>
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
      </div>
      <div className = "formbox">
        <form> 
          {formElements.map(formElement=> {
            if(formElement.key=='vehicle_id'){
              return(
                <div>
                  <br></br>
                  Pick model:&nbsp;&nbsp;
                  {/* <select  
                  value={formData[formElement.key]} 
                  onChange={(e)=>{handleChange2(e.target,formElement.key)}}
                  className="selectprofiledrop"
                  >
                    {props.allvehicles.map(id=>
                      <option id={id.id}>
                        {String.prototype.concat(id.brand,'  ',id.model,' ',id.release_year)}   
                      </option>
                    )}
                  </select> */}
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