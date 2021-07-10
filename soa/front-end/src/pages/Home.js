import React,{ useState} from 'react';
import '../components/Home/scss/style.scss';
import ChoicesBoxes from '../components/ChoicesBoxes/Choices'
import { Link } from 'react-router-dom';
import '../App.css';
import Header from '../components/Header/Header';
import TotalAnalytics from "../components/TotalAnalytics/TotalAnalytics";


class Home extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <div>
                <ChoicesBoxes/>
                <TotalAnalytics />
            </div>

        );
    }
}


export default Home;