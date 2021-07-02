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
                <div className="welcome_title">Welcome to <b>AskMeAnything</b>!</div>
                    <div className="choice__grid">
                        
                        <a href="#" className="choice__item">
                        <Link to='/keywords'>
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
                        </Link>
                        </a>
                        
                        
                        <a href="#" className="choice__item">
                        <Link to='/timesearch'>
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
                                    analytics regarding posted 
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
                </div>

            </section>
        );
    }
}

export default ChoicesBoxes;