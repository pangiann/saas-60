import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import { show_qa_url } from "../../base_url";
import Cookies from "js-cookie";
import ProfileIcon from '../../profile-icon.png';
import answer from "../images/Answer.jpg";
import ask from "../images/ask.jpeg";
import statistics from "../images/statistics.jpg";
import search_keyword from "../images/search-keyword.jpg";

class MyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            click: true,
            user: {},
            question: {},
            question_id: this.props.location.state,
            answers: [],
            keywords: [],
            description: ''
        };
    }
    //   async componentDidMount() {
    //     console.log(Cookies.get("token_id"));
    //     const myHeaders = new Headers();
    //     myHeaders.append("Content-Type", "application/json");
    //     const raw = JSON.stringify({ "questionId": this.state.question_id });
    //     const requestOptions = {
    //       method: 'POST',
    //       headers: myHeaders,
    //       body: raw,
    //       redirect: 'follow'
    //     };
    //     const response = await fetch(show_qa_url + "/questions/question_id", requestOptions)
    //     const json = await response.json();
    //     console.log(json);
    //     await this.setState({
    //       question: json.result[0]
    //     })
    //     await this.setState({
    //       keywords: this.state.question.keywords
    //     })
    //     const response2 = await fetch(show_qa_url + "/answers/question", requestOptions)
    //     const json2 = await response2.json();
    //     console.log(json2);
    //     await this.setState({
    //       answers: json2.result
    //     })
    //     await console.log(this.state.answers);
    //   }
    //   handleDescriptionChange = (event) => {
    //     this.setState({
    //       description: event.target.value
    //     })
    //   }



    closeMobileMenu = () => this.setState({ click: false });

    render() {
        return (
            <div>
                <div className="welcome_title_of_profile">My Profile</div>

                <div className="profile-box2">
                    <div className="picture2">
                        <img src={ProfileIcon} />
                    </div>

                    <div className="info-box">
                        <p>Username:</p>
                        <p>Email:</p>
                        <p>Number of questions:</p>
                        <p>Number of answers:</p>
                        <p>Upvotes given:</p>
                        <p>Upvotes received:</p>

                    </div>
                </div>

                <br></br>
                <section className="choices">

                    <div className="choice__content container container--nav container--pall">
                        <div className="choice__grid">

                            <a href="#" className="choice__item">
                                <Link to='/keywords'>
                                    <div className="choice__image"
                                        style={{ backgroundImage: `url(${search_keyword})` }}>
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
                                        style={{ backgroundImage: `url(${statistics})` }}>
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
                                        style={{ backgroundImage: `url(${ask})` }}>
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
                                        style={{ backgroundImage: `url(${answer})` }}>
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

                <br></br>

            </div>
        );

    }
}

export default MyProfile;