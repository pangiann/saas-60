import React,{ useState} from 'react';
import '../components/AskQuestion/scss/style.scss';
import Header from '../components/Header/Header';
import AskQuestion from "../components/AskQuestion/AskQuestion";
import ChoicesBoxes from '../components/ChoicesBoxes/Choices'
import { Link } from 'react-router-dom';
import '../App.css';



class AskQuestionPage extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <AskQuestion/>
        );
    }
}


export default AskQuestionPage;