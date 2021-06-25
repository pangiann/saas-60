import React from 'react';
import './scss/style.scss';
import answer from "../ChoicesBoxes/images/Answer.jpg";
import ask from "../ChoicesBoxes/images/ask.jpeg";
import statistics from "../ChoicesBoxes/images/statistics.jpg";
import search_keyword from "../ChoicesBoxes/images/search-keyword.jpg";
import { Link } from 'react-router-dom';

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
            keyword1: event.target.value
        })
    }

    render() {
        return (
            <div>
                <div className="ask_title">Ask a new question!</div>

                <form>
                    <div className="outside-box">
                        <div className="title">Title</div>
                        <div className="inside-box">
                            <input
                                type="text"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                            />
                        </div>
                    </div>
                    <div className="outside-box">
                        <div className="title">Description</div>
                        <div className="inside-box">
                            <textarea
                                type="text"
                                value={this.state.description}
                                onChange={this.handleDescriptionChange}
                            />
                        </div>
                    </div>
                    <div className="outside-box">
                        <div className="title">Keywords</div>
                        <div className="inside-box">
                            <input
                                type="text"
                                value={this.state.keyword1}
                                onChange={this.handleKeywordsChange}
                            />
                        </div>
                    </div>
                    <button type="button" className='button'
                    // onClick={ () =>  reserveSlot(point.id , moment(selectedDate).format('YYYY-MM-DD') + " :00")}
                    >
                        Post your question now!
                    </button>
                </form>
            </div>
        );
    }
}

export default AskQuestion;