import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import {show_qa_url} from "../../base_url";

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

    render() {
        return (
            <div>
                <div className="ask_title">Ask a new question!</div>

                <form>
                    <div className="outside-box">
                        <div className="title">Title</div>
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
                        <div className="title">Description</div>
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
                        <div className="title">Keywords</div>
                        {/* <div className="inside-box"> */}
                            <input
                                type="text"
                                value={this.state.keywords}
                                placeholder="Add keywords space separated"
                                onChange={this.handleKeywordsChange}
                            />
                        {/* </div> */}
                    </div>
                    <Link to='/'>
                    <button type="button" className='button_ask'
                    // onClick={ () =>  reserveSlot(point.id , moment(selectedDate).format('YYYY-MM-DD') + " :00")}
                    >
                        Post your question now!
                    </button>
                    </Link>
                </form>
            </div>
        );
    }
}

export default AskQuestion;