import React,{ useState} from 'react';
import '../components/Home/scss/style.scss';
import QuestionsPerTimePeriod from "../components/QuestionsPerTimePeriod/QuestionsPerTimePeriod";
import { Link } from 'react-router-dom';
import '../App.css';
import Header from '../components/Header/Header';


class QuestionsPerTimePage extends React.Component  {

    constructor(props) {
        super(props);
        this.state = {
        };

    }
    render() {
        return (
            <QuestionsPerTimePeriod/>
        );
    }
}


export default QuestionsPerTimePage;