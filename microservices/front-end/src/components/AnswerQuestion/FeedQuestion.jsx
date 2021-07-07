import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import { show_qa_url } from "../../base_url";
import Cookies from "js-cookie";


class FeedQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            click: true,
            question: {},
            keywords: []
        };
    }
    async componentDidMount() {
        await this.setState({
            question: this.props.question,
            keywords: this.props.question.keywords == undefined ? ["sdjkbsdkjb"] : this.props.question.keywords
        })
    }

    render() {
        return (
            <div>
                <Link to={{ pathname: "/question", state: this.state.question._id }}>
                    <div className="box_of_question">

                        <div className="title_of_question1">
                            {this.state.question.title}
                        </div>
                        
                        <div className="author">
                            Written by: {this.state.question.username}
                        </div>
                        <div className="author">
                            Keywords: &nbsp;
                            {this.state.keywords.map(keyword =>
                            <div className="keyword_display" key={Math.random()}>
                                <p>{keyword}</p>
                            </div>
                        )}
                        </div>
                        <div className="those">
                            <div className="num_of_answers">
                                Answers: {this.state.question.num_of_answers}
                            </div>
                            <button type="button" className="answer_button" >
                                Answer now!
                            </button>
                        </div>
                    </div>
                </Link>
            </div>
        )
    }
}
export default FeedQuestion;