
import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import {  show_user } from "../../base_url";
import Cookies from "js-cookie";
import ProfileIcon from '../../profile-icon.png';
import answer from "../images/Answer.jpg";
import ask from "../images/ask.jpeg";
import statistics from "../images/statistics.jpg";
import search_keyword from "../images/search-keyword.jpg";
import ChoicesBoxes from "../ChoicesBoxes/Choices";

class ChoicesBoxesLoggedIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            click: true,
            user: {}
        };
    }

    async componentDidMount() {
        console.log(Cookies.get("token_id"));


        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get("token_id"));
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({"userId": Cookies.get("user_id")});

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch(show_user + "/user", requestOptions)
        const json = await response.json();
        console.log(json.result);
        await this.setState({
            user: json.result
        })
    }

    render() {
        return (
            <section className="choices_profiled">
                <div className="choice__grid">

                    <a href="#" className="choice__item">
                        <Link to='/myqna'>
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${search_keyword})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    My Q&A
                                </div>
                                <div className="choice__description">
                                    View all the questions and
                                    answers that you have posted.
                                </div>
                            </div>
                        </Link>
                    </a>


                    <a href="#" className="choice__item">
                        <Link to='/timesearch'>
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${statistics})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    My contributions per day
                                </div>
                                <div className="choice__description">
                                    Select a time period of your
                                    preferance and see all the
                                    analytics regarding your posted
                                    questions and answers.
                                </div>
                            </div>
                        </Link>
                    </a>


                    <a href="#" className="choice__item">
                        <Link to='/askquestion'>
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${ask})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Ask a new question
                                </div>
                                <div className="choice__description">
                                    Struggling with finding answers
                                    to a problem? Post a new question
                                    and let our community take
                                    care the rest.
                                </div>
                            </div>
                        </Link>
                    </a>


                    <a href="#" className="choice__item">
                        <Link to='/answerquestion'>
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${answer})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Answer a question
                                </div>
                                <div className="choice__description">
                                    Are you Mr. BigBrains? Answer a
                                    question and make someone's life easier.
                                </div>
                            </div>
                        </Link>
                    </a>

                </div>

            </section>
        )
    }
}
export default ChoicesBoxesLoggedIn;