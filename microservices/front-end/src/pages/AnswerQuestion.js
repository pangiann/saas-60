import React,{ useState} from 'react';
import '../components/AnswerQuestion/scss/style.scss';
import Header from '../components/Header/Header';
import AskQuestion from "../components/AskQuestion/AskQuestion";
import ChoicesBoxes from '../components/ChoicesBoxes/Choices'
import { Link } from 'react-router-dom';
import '../App.css';
import AnswerQuestion from "../components/AnswerQuestion/AnswerQuestion";



class AnswerQuestionPage extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <AnswerQuestion/>
        );
    }
}


export default AnswerQuestionPage;