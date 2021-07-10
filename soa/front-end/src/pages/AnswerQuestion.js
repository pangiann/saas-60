import React,{ useState} from 'react';
import '../components/AnswerQuestion/scss/style.scss';
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