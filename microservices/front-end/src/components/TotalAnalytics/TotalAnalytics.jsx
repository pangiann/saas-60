import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import {show_analytics} from "../../base_url";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

class TotalAnalytics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tot_questions: 0,
            tot_answers: 0,
            best_questions_contributor: '',
            best_answers_contributor: ''
        };

    }
    componentDidMount() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(show_analytics + "/questionsPerUser", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    return response.text();
                } else {
                    throw new Error(response.status);
                }
            })
            .then(result => {
                let json_obj = JSON.parse(result)
                let questions_stats = json_obj.result
                this.setState({

                })
                let sum = 0;
                for (let i = 0; i < questions_stats.length; i++) {
                    sum += questions_stats[i].no_of_questions;
                }

                this.setState({
                    best_questions_contributor: questions_stats[0].username,
                    tot_questions: sum
                })
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: error,
                    icon: 'error',
                    customClass: "swal_ok_button",
                    confirmButtonColor: "#242424"
                });
            });



        fetch(show_analytics + "/answersPerUser", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    return response.text();
                } else {
                    throw new Error(response.status);
                }
            })
            .then(result => {
                let json_obj = JSON.parse(result)
                let answers_stats = json_obj.result
                this.setState({

                })
                let sum = 0;
                for (let i = 0; i < answers_stats.length; i++) {
                    sum += answers_stats[i].no_of_answers;
                }

                this.setState({
                    best_answers_contributor: answers_stats[0].username,
                    tot_answers: sum
                })
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: error,
                    icon: 'error',
                    customClass: "swal_ok_button",
                    confirmButtonColor: "#242424"
                });
            });
    }

    render() {
        return (
            <div className={"tot_anal_flex"}>
                    <div className={"tot_box"}>
                        <div className={"box_info"}>
                            <p className={"info"}>{this.state.tot_questions}</p>
                            <p>Questions</p>
                        </div>
                        <div  className={"box_info"}>
                            <p  className={"info"}>{this.state.best_questions_contributor}</p>
                            <p>Best Questions Contributor</p>
                        </div>
                        <div  className={"box_info"}>
                            <p  className={"info"}>{this.state.best_answers_contributor}</p>
                            <p>Best Answers Contributor</p>
                        </div>
                        <div  className={"box_info"}>
                            <p  className={"info"}> {this.state.tot_answers}</p>
                            <p>Answers</p>
                        </div>
                    </div>

            </div>

        );
    }
}

export default TotalAnalytics;