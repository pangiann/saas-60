import React from 'react';
import './scss/style.scss';
import answer from "./images/Answer.jpg";
import ask from "./images/ask.jpeg";
import statistics from "./images/statistics.jpg";
import search_keyword from "./images/search-keyword.jpg";
import { Link } from 'react-router-dom';

class ChoicesBoxes extends React.Component {
    render() {
        return (
            <section className="choices">

                <div className="choice__content container container--nav container--pall">

                    <div className="choice__grid">
                        <Link to='/keywords'>
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
                        </Link>
                        <Link to='/timesearch'>
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
                        </Link>
                        <Link to='/askquestion'>
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
                        </Link>
                        <Link to='/answerquestion'>
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
                        </Link>
                    </div>
                </div>

            </section>
        );
    }
}

export default ChoicesBoxes;