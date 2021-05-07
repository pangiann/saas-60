import React,{ useState} from 'react';
import '../components/Home/scss/style.scss';
import ChoicesBoxes from '../components/ChoicesBoxes/Choices'
import { Link } from 'react-router-dom';
import '../App.css';



class Home extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <ChoicesBoxes/>

        );
    }
}


export default Home;