import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import { show_qa_url } from "../../base_url";
import Cookies from "js-cookie";

class ShowQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      click: true,
      question: {},
      question_id: this.props.location.state,
      answers: [],
      keywords: [],
      description: ''
    };
  }
  async componentDidMount() {
    console.log(Cookies.get("token_id"));
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({ "questionId": this.state.question_id });
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    const response = await fetch(show_qa_url + "/questions/question_id", requestOptions)
    const json = await response.json();
    console.log(json);
    await this.setState({
      question: json.result[0]
    })
    await this.setState({
      keywords: this.state.question.keywords
    })
    const response2 = await fetch(show_qa_url + "/answers/question", requestOptions)
    const json2 = await response2.json();
    console.log(json2);
    await this.setState({
      answers: json2.result
    })
    await console.log(this.state.answers);
  }
  handleDescriptionChange = (event) => {
    this.setState({
      description: event.target.value
    })
  }



  closeMobileMenu = () => this.setState({ click: false });

  render() {
    return (
      <div>
        <div className="title_of_question">{this.state.question.title}</div>
        <div className="box_of_question">
          <div className="text_of_question">
            {this.state.question.question}
          </div>

          <div className="author">
            Written by: {this.state.question.username}
          </div>
          <div className="flex">
            <div className="author">
              Keywords: &nbsp;
            </div>
            {this.state.keywords.map(keyword =>
              <div className="keyword_display">
                <p>{keyword}</p>
              </div>
            )}
          </div>
          <div className="num_of_answers">
            Answers: {this.state.question.num_of_answers}
          </div>
        </div>

        {this.state.answers.map(answer =>
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
        )}
        <div>
          <div className="my_answer">
            <p>Write your answer:</p>
          </div>
          <div className="textbox">
          <textarea
            type="text"
            value={this.state.description}
            placeholder="Use up to 1.000 characters"
            onChange={this.handleDescriptionChange}
          />
          </div>

        </div>



        <Link to={
          {
            pathname: "/",
            // state: {
            //   selected_question : this.state.question._id
            // }
          }

        } type="button" className="answer_button2" >
          Answer now!
        </Link>

<br></br>
<br></br>
<br></br>

      </div>
    );

  }
}

export default ShowQuestion;
