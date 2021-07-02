import React from 'react';
import './scss/style.scss';
import answer from "../ChoicesBoxes/images/Answer.jpg";
import ask from "../ChoicesBoxes/images/ask.jpeg";
import statistics from "../ChoicesBoxes/images/statistics.jpg";
import search_keyword from "../ChoicesBoxes/images/search-keyword.jpg";
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

//     const myHeaders = new Headers();
//     const requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         redirect: 'follow'
//       };

//     fetch(show_qa_url + "/question", requestOptions)
//     .then(response => {
//         if (response.status === 200) {
//             return response.text();
//         } else {
//             throw new Error(response.status);
//         }
//     })
//     .then(result => {
//         const json_obj = JSON.parse(result);
//         Swal.fire({
//             title: 'Success',
//             text: json_obj.msg,
//             icon: 'success',
//             customClass: "swal_ok_button",
//             confirmButtonColor: "#242424"
//         }).then(function () {
//             window.location.href = '/loginregister';
//         })

//     })
//     .catch(error => {
//         Swal.fire({
//             title: 'Error!',
//             text: error,
//             icon: 'error',
//             customClass: "swal_ok_button",
//             confirmButtonColor: "#242424"
//         });
//     });
// }

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