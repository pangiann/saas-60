/*import React from 'react';
//import './scss/style.scss';
import FeedQuestion from "../AnswerQuestion/FeedQuestion.jsx";
import { show_qa_url } from "../../base_url";

import { Link } from 'react-router-dom';

class Keywords extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            click: true,
            questions: [],
            question: [],
            keyword: ""
        };
    }
    async componentDidMount() {
        // console.log(Cookies.get("token_id"));
        const myHeaders = new Headers();
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(show_qa_url + "/question", requestOptions)
        const json = await response.json();
        console.log(json);
        await this.setState({
            questions: json.result
        })
        // await console.log(this.state.questions);
    }

    closeMobileMenu = () => this.setState({ click: false });

    handleKeywordsChange = (event) => {
        this.setState({
            keyword: event.target.value
        })
    }


    render() {
        return (
            <div>
                <div className="answer_title4">
                    <div className="smalltitle">Keyword Search: &nbsp;&nbsp;</div>
                    <input
                        type="text"
                        value={this.state.keyword}
                        placeholder="Insert a keyword"
                        onChange={this.handleKeywordsChange}
                    />
                </div>
                {this.state.questions.map(question =>
                    <FeedQuestion question={question} />
                )
                }
            </div>
        );
    }
}

export default Keywords;
*/
