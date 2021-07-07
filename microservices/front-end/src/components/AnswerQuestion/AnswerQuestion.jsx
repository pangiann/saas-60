import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import { show_qa_url } from "../../base_url";
import Cookies from "js-cookie";
import FeedQuestion from "./FeedQuestion.jsx";

class AnswerQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      click: true,
      questions: [],
      question: []
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


  render() {
    return (
      <div>
        <div className="answer_title">Answer a question!</div>
        {this.state.questions.map(question =>
          <FeedQuestion question={question} />
        )
        }
      </div>
    );
  }
}


export default AnswerQuestion;