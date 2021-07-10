import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import {bus_qa_url, qa_url} from "../../base_url";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

class AskQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            keywords: ''
        };
    }

    handleTitleChange = (event) => {
        this.setState({
            title: event.target.value
        })
    }
    handleDescriptionChange = (event) => {
        this.setState({
            description: event.target.value
        })
    }
    handleKeywordsChange = (event) => {
        this.setState({
            keywords: event.target.value
        })
    }
    submitQuestion = (event) => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + Cookies.get('token_id'));
        myHeaders.append("Content-Type", "application/json");
        const data = JSON.stringify({
            "userId": Cookies.get('user_id'),
            "title": this.state.title,
            "question":this.state.description,
            "keywords": this.state.keywords.split(' ')
        });
        const raw = JSON.stringify({
            base_route: "questionsAnswers",
            api_route: "question",
            method: "post",
            data: data
        })
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        console.log(this.state.keywords.split(' '))
        fetch(bus_qa_url, requestOptions)
            .then(response => {
                if (response.status === 200) {
                    return response.text();
                } else {
                    throw new Error(response.status);
                }
            })
            .then(result => {
                console.log(result)
                window.location.replace("/");
                //window.location.reload();
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

    render() {
        return (
            <div>
                <div className="ask_title">Ask a new question!</div>

                <form>
                    <div className="outside-box">
                        <div className="quest_title">Title</div>
                        {/* <div className="inside-box"> */}
                            <input
                                type="text"
                                value={this.state.title}
                                placeholder="The question in one sentence"
                                onChange={this.handleTitleChange}
                            />
                        {/* </div> */}
                    </div>
                    <div className="outside-box">
                        <div className="quest_title">Description</div>
                        {/* <div className="inside-box"> */}
                            <textarea
                                type="text"
                                value={this.state.description}
                                placeholder="More information about your question"
                                onChange={this.handleDescriptionChange}
                            />
                        {/* </div> */}
                    </div>
                    <div className="outside-box">
                        <div className="quest_title">Keywords</div>
                        {/* <div className="inside-box"> */}
                            <input
                                type="text"
                                value={this.state.keywords}
                                placeholder="Add keywords space separated"
                                onChange={this.handleKeywordsChange}
                            />
                        {/* </div> */}
                    </div>

                    <button type="button" className='button_ask' onClick={this.submitQuestion}>
                        [+] Ask the Question
                    </button>

                </form>
            </div>
        );
    }
}

export default AskQuestion;