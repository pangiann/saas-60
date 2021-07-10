import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import {bus_qa_url, qa_url} from "../../base_url";
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
      const data = JSON.stringify({ "userId": Cookies.get("user_id") });
      let raw = JSON.stringify({
          base_route: "questionsAnswers",
          api_route: "questions/user",
          method: "post",
          data: data
      })
      let requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
      };

      const response = await fetch(bus_qa_url, requestOptions)
      const json = await response.json();
      console.log(json)
      await this.setState({
        questions: json.result.questions
      })
      raw = JSON.stringify({
          base_route: "questionsAnswers",
          api_route: "answers/user",
          method: "post",
          data: data
      })
      requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
      };
      const response2 = await fetch(bus_qa_url, requestOptions)
      const json2 = await response2.json();
      // console.log(json2, "answers");
      await this.setState({
        answers: json2.result.answers
      })
      // await console.log(this.state.answers);
  }

  closeMobileMenu = () => this.setState({ click: false });

  render() {
    const renderanswers = () => {
        if (this.state.answers === "") {
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
          if (this.state.questions === "") {
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
        <div className={"questions"}>
            <p className={"kapa"}>Your questions:</p>
            {renderquestions()}
        </div>
        <div className={"answers"}>
            <p className={"kapa"}>Your answers:</p>

            {renderanswers()}
        </div>

      </div>
    );

  }
}

export default MyQnA;