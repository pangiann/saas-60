import React from 'react';
import '../ChoicesBoxes/scss/style.scss';
import answer from "../ChoicesBoxes/images/Answer.jpg";
import ask from "../ChoicesBoxes/images/ask.jpeg";
import statistics from "../ChoicesBoxes/images/statistics.jpg";
import search_keyword from "../ChoicesBoxes/images/search-keyword.jpg";
import { Link } from 'react-router-dom';
import {show_qa_url} from "../../base_url";


class AnswerQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          click: true
        };
      }
      componentDidMount(){
        // var myHeaders = new Headers();
        // var decoded = jwt_decode( getCookie('charge_evolution_token'));
        // myHeaders.append("Content-Type", "application/json");
        // myHeaders.append("charge_evolution_token",  getCookie('charge_evolution_token'));
        // var requestOptions = {
        //   method: 'GET',
        //   headers: myHeaders,
        //   redirect: 'follow'
        // };
        const myHeaders = new Headers();
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(show_qa_url + "/question", requestOptions)
        .then(response => {
            if (response.status === 200) {
                return response.text();
            } else {
                throw new Error(response.status);
            }
        })
        .then(result => {
            const json_obj = JSON.parse(result);
            Swal.fire({
                title: 'Success',
                text: json_obj.msg,
                icon: 'success',
                customClass: "swal_ok_button",
                confirmButtonColor: "#242424"
            }).then(function () {
                window.location.href = '/loginregister';
            })

        })
        .catch(error => {
            Swal.fire({
                title: 'Error!',
                text: error,
                icon: 'error',
                customClass: "swal_ok_button",
                confirmButtonColor: "#242424"
            });
        });
    }

    closeMobileMenu = () => this.setState({click:false});

    render() {
        return (
            <section className="choices">

                <div className="choice__content container container--nav container--pall">

                    <div className="choice__grid">

                        <a href="#" className="choice__item">
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${search_keyword})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Questions per Keyword
                                </div>
                                <div className="choice__description">
                                    View the most used keywords
                                    and insert one to see all 
                                    related questions.
                                </div>
                            </div>
                        </a>
                        <a href="#" className="choice__item">
                            <div className="choice__image"
                                 style={{backgroundImage: `url(${statistics})`}}>
                            </div>

                            <div className="choice__text">
                                <div className="choice__title">
                                    Questions per Time Period
                                </div>
                                <div className="choice__description">
                                    Select a time period of your
                                    preferance and see all the 
                                    posted questions and answers.
                                </div>
                            </div>
                        </a>
                        <a href="#" className="choice__item">
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
                        </a>
                        <a href="#" className="choice__item">
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
                        </a>
                    </div>
                </div>

            </section>
        );
    }
}

export default AnswerQuestion;