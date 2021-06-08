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
          keyword1:'',
          keyword2:'',
          keyword3:''
        };
      }

    handleTitleChange = (event) => {this.setState({
        title: event.target.value
    })
    }
    handleDescriptionChange = (event) => {this.setState({
        description: event.target.value
    })
    }
    handleKeyword1Change = (event) => {this.setState({
        keyword1: event.target.value
    })
    }
    handleKeyword2Change = (event) => {this.setState({
        keyword2: event.target.value
    })
    }
    handleKeyword3Change = (event) => {this.setState({
        keyword3: event.target.value
    })
    }

    render() {
        return (
            <div>
            <div className="ask_title">Ask a question</div>

            <form>
                <div>
                    <label>Title</label>
                    <input
                    type="text"
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                    type="text"
                    value={this.state.description}
                    onChange={this.handleDescriptionChange}
                    />
                </div>
                <div className="keywords">
                    <label>Keyword 1</label>
                    <input
                    type="text"
                    value={this.state.keyword1}
                    onChange={this.handleKeyword1Change}
                    />
                </div>
                <div className="keywords">
                    <label>Keyword 2</label>
                    <input
                    type="text"
                    value={this.state.keyword2}
                    onChange={this.handleKeyword2Change}
                    />
                </div>
                <div className="keywords">
                    <label>Keyword 3</label>
                    <input
                    type="text"
                    value={this.state.keyword3}
                    onChange={this.handleKeyword3Change}
                    />
                </div>
            </form>
            </div>
        );
    }
}

export default AskQuestion;