import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import { show_qa_url } from "../../base_url";
import Cookies from "js-cookie";
import FeedQuestion from "../AnswerQuestion/FeedQuestion.jsx";


class MyQnA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      click: true,
      questions: [],
      answers: [],
    };
  }
  async componentDidMount() {
    // console.log(Cookies.get("token_id"));
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + Cookies.get("token_id"));
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({ "userId": Cookies.get("user_id") });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const response = await fetch(show_qa_url + "/questions/user", requestOptions)
    const json = await response.json();
    // console.log(json, "questions");
    await this.setState({
      questions: json.result
    })
    const response2 = await fetch(show_qa_url + "/answers/user", requestOptions)
    const json2 = await response2.json();
    // console.log(json2, "answers");
    await this.setState({
      answers: json2.result
    })
    // await console.log(this.state.answers);
  }

  closeMobileMenu = () => this.setState({ click: false });

  render() {



    const renderanswers = () => {
      if (this.state.answers == "") {
        return (
          <div className="my_answer2">
            <p>You have not answered a question yet. <b>Answer now</b>!</p>
          </div>
        );
      } else {
        return <>

          {this.state.answers.map(answer =>
            <Link to={{ pathname: "/question", state: answer.question_id}}>
              <div className="box_of_answer">
                <div className="text_of_question">
                  {answer.answer}
                </div>

                <div className="author">
                  Written by: {answer.username}
                </div>
                <div className="num_of_answers">
                  Upvotes: {answer.upvotes}
                </div>

              </div>
            </Link>
          )}

        </>;
      }
    }
    const renderquestions = () => {
      if (this.state.questions == "") {
        return (
          <div className="my_answer2">
            <p>You have not posted a question yet. <b>Post now</b>!</p>
          </div>
        );
      } else {
        return (
          <>
            {this.state.questions.map(question =>
              <FeedQuestion question={question} />
            )
            }
          </>
        );
      }
    }
    return (
      <div>
        <div className="my_answer">
          <p>Your questions:</p>
        </div>
        {renderquestions()}
        <div>
          <div className="my_answer">
            <p>Your answers:</p>
          </div>
          {renderanswers()}

        </div>
        <br></br>
        <br></br>
        <br></br>

      </div>
    );

  }
}

export default MyQnA;