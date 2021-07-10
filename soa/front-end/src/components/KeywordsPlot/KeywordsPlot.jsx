import React from 'react';
import './scss/style.scss';
import { Link } from 'react-router-dom';
import {analytics_url, bus_analytics_url} from "../../base_url";
import { Chart } from "react-google-charts";

class KeywordsPlot extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            most_popular_keywords: [[]]

        };
    }
    componentDidMount() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
            base_route: "analytics",
            api_route: "questionsPerKeyword",
            method: "get",
            data: {}
        })

        const requestOptions = {
            method: 'post',
            headers: myHeaders,
            redirect: 'follow',
            body: raw
        };

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
                json_obj = json_obj.result.result
                let most_popular_keywords = [["Keyword", "Total"]];
                for (let i = 0; i < 17; i++) {
                    most_popular_keywords.push([json_obj[i].keyword, json_obj[i].keyword_sum]);
                }
                this.setState({
                    most_popular_keywords: most_popular_keywords
                })
                let total = 0;
                for (let i = 1; i < most_popular_keywords.length; i++) {
                    total += most_popular_keywords[i][1];
                }
                document.getElementById('mo_year').innerHTML = total + " popular keywords in total";


            })
            .catch(error => console.log('error', error));
    }


    render() {
        return (
            <section className="stats">
                <nav className="container container--nav container--px container--pb">
                    <div id="piechart">
                        <Chart
                            chartType="ColumnChart"
                            data={this.state.most_popular_keywords}
                            height={'400px'}
                            options = {
                                    {
                                        title: "Keywords Popularity",
                                        subtitle: "17 most popular keywords in our database",
                                        vAxis: {minValue: 0},
                                        colors: ['#6a98ce']
                                    }
                            }

                        />
                    </div>
                    <div className="mo2">
                        <p>Average</p>
                        <h3 id="mo_year"/>
                    </div>


                </nav>

            </section>

        );
    }
}

export default KeywordsPlot;