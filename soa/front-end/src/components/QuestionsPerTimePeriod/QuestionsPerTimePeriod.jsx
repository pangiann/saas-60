import React from 'react';
import './scss/style.scss';
import jwt from 'jwt-decode'
import Cookies from "js-cookie";

import { Link } from 'react-router-dom';
import {analytics_url, bus_analytics_url} from "../../base_url";
import { Chart } from "react-google-charts";

class QuestionsPerTimePeriod extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoginActive: false,
            tot_num_per_day_arr: [[]],
            tot_num_per_month_arr: [[]],
            tot_years_num_arr: [[]],
            active_chart: [[]],
            first_year: 0,
            last_year: 0,
            monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
            ],
            monthToNumber : {
                "Jan": 1,  "Feb": 2,  "Mar" : 3,  "Apr" : 4,  "May" : 5,  "Jun" : 6,
                "Jul": 7,  "Aug": 8,  "Sept" : 9,  "Oct" : 10, "Nov" : 11, "Dec" : 12
            }

        };
    }
    componentDidMount() {
        let api_request = "questionsPerDay"
        const myHeaders = new Headers();
        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        }
        let raw = JSON.stringify({
            base_route: "analytics",
            api_route: api_request,
            method: "get",
            data: {}
        })
        if (Cookies.get("token_id") !== undefined && Cookies.get("user_id") !== undefined) {
            this.setState({
                isLoginActive: true
            })
            let auth_token = Cookies.get("token_id")
            api_request = "questionsPerDay/user"
            const decodedToken = jwt(auth_token);

            myHeaders.append("Authorization", "Bearer " + auth_token);
            myHeaders.append("Content-Type", "application/json");
            const data =  JSON.stringify(
                {"username": decodedToken.username}
            );
            raw = JSON.stringify({
                base_route: "analytics",
                api_route: api_request,
                method: "post",
                data: data
            })


            requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

        }


        fetch(bus_analytics_url, requestOptions)
            .then(response => {

                if (response.status === 200) {
                    return response.text();
                } else {
                    throw new Error(response.status);
                }
            })
            .then(result => {
                console.log(result)
                let json_obj = JSON.parse(result);
                json_obj = json_obj.result;
                let first_year = json_obj.first_year;

                let last_year = json_obj.last_year;
                let tot_num_per_day = json_obj.tot_num_per_day;
                let tot_num_per_month = json_obj.tot_num_per_month;
                let tot_years_num = json_obj.tot_years_num;


                let tot_num_per_day_arr = []
                let tot_num_per_month_arr = []
                let years = document.getElementById('years');
                for (let i = 0; i <= last_year - first_year; i++) {
                    let x = document.getElementById('years');
                    let option  = document.createElement('option');
                    option.text = json_obj.first_year + i;
                    x.add(option);
                }
                for (let i = first_year; i <= last_year; i++) {
                    tot_num_per_day_arr.push([]);
                    for (let j = 0; j < 12; j++) {
                        tot_num_per_day_arr[i - first_year].push([["Day", "Number of Questions"]]);

                        for (let k = 0; k < 31; k++) {
                            let num_day = [(k + 1).toString() + "/" + (j + 1).toString(), tot_num_per_day[i - first_year][j][k]];
                            tot_num_per_day_arr[i - first_year][j].push(num_day);
                        }
                    }
                }
                for (let i = first_year; i <= last_year; i++) {
                    tot_num_per_month_arr.push([["Month", "Number of Charges"]]);
                    for (let j = 0; j < 12; j++) {
                        let times_month = [this.state.monthNames[j], tot_num_per_month[i-first_year][j]];
                        tot_num_per_month_arr[i-first_year].push(times_month);
                    }

                }

                let tot_years_num_arr = [["Year", "Number of Questions"]]
                for (let i = 0; i < tot_years_num.length; i++) {
                    tot_years_num_arr.push([(first_year + i).toString(), tot_years_num[i]]);
                }



                this.setState({
                    tot_num_per_day_arr: tot_num_per_day_arr,
                    tot_num_per_month_arr: tot_num_per_month_arr,
                    tot_years_num_arr: tot_years_num_arr,
                    first_year: first_year,
                    last_year: last_year,
                    active_chart: tot_years_num_arr
                })

                //document.getElementById('mo_year').innerHTML = total + " popular keywords in total";


            })
            .catch(error => console.log('error', error));
    }
    changeChart = (event) => {

        const year = document.getElementById("years").value;
        const month = document.getElementById("month").value;
        if (year === "All" ) {
            this.setState({
                active_chart: this.state.tot_years_num_arr
            })
        }
        else {
            if (month === "All") {
                this.setState({
                    active_chart: this.state.tot_num_per_month_arr[year - this.state.first_year]
                })
            }
            else {
                console.log(this.state.tot_num_per_day_arr);
                this.setState( {
                    active_chart: this.state.tot_num_per_day_arr[year - this.state.first_year][this.state.monthToNumber[month] - 1]
                })
            }
        }
    }



    render() {
        return (
            <section className="stats">
                <nav className="container container--nav container--px container--pb">
                    <div className="select_flex3" id="form2" onChange={this.changeChart}>
                        <select id="years">
                            <option id={"All"}>All</option>
                        </select>
                        <select id="month">
                            <option id="All">All</option>
                            <option id="Jan">Jan</option>
                            <option id="Feb">Feb</option>
                            <option id="Jan">Mar</option>
                            <option id="Feb">Apr</option>
                            <option id="Jan">May</option>
                            <option id="Feb">Jun</option>
                            <option id="Jan">Jul</option>
                            <option id="Feb">Aug</option>
                            <option id="Jan">Sep</option>
                            <option id="Feb">Oct</option>
                            <option id="Jan">Nov</option>
                            <option id="Feb">Dec</option>
                        </select>
                    </div>
                    <div id="div_chart">
                        <Chart
                            chartType="ColumnChart"
                            data={this.state.active_chart}
                            height={'400px'}
                            options = {
                                {
                                    title: "Questions Per Time Period",
                                    subtitle: "Number of Questions created in a time period",
                                    vAxis: {minValue: 0},
                                    colors: ['#6a98ce']
                                }
                            }

                        />
                    </div>
                    <div className="mo2">
                        <p>Average</p>
                        <h3 id="mo_month"/>
                    </div>
                </nav>

            </section>

        );
    }
}

export default QuestionsPerTimePeriod;