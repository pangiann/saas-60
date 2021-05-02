import React,{ useState} from 'react';
import '../components/Home/scss/style.scss';
import { Link } from 'react-router-dom';
import '../App.css';


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

        </div>
    );
}


export default Home;