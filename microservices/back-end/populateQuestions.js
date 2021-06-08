const questions = require('./models/add_q&a_service/questions');
const produce = require('./models/add_q&a_service/producer');
const users = require('./models/users_profile_service/users');
const {ObjectID} = require("bson");

async function populateQuestions() {
    const fs = require('fs')
    var json_data;
    try {
        const data = await fs.readFileSync('/home/pangiann/Questions.json', 'utf8');
        json_data = JSON.parse(data);
        //console.log(json_data);

    } catch (err) {
        console.error(err);
    }
    let i;
    for (i = 0; i < json_data.length; i++) {
        try {

            //const res = await questions.populateQuestion(json_data[i]._id, json_data[i].question_no, json_data[i].title, json_data[i].user_id, json_data[i].date,
                                                       //json_data[i].question, json_data[i].keywords, json_data[i].num_of_answers);
            const result = await users.showProfile(ObjectID(json_data[i].user_id.$oid));
            //console.log(json_data[0].user_id)
            const date = new Date(json_data[i].date.$date);
            produce.produce_addQuestion_event(ObjectID(json_data[i].user_id.$oid), result.username, ObjectID(json_data[i]._id.$oid), json_data[i].question_no,
                                                json_data[i].title, json_data[i].question, json_data[i].keywords, date, json_data[i].num_of_answers)
                .then(r => {
                    console.log("result successfull")
                })
                .catch(err => {
                    throw  err;
                })
            console.log(result);
        }
        catch (error) {
            console.log(error);
        }
    }
}

populateQuestions();
