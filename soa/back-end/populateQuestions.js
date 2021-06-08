const questions = require('./models/questions_answers_management/questions');

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
            const date = new Date(json_data[i].date);

            const res = await questions.populateQuestion(ObjectID(json_data[i]._id.$oid), json_data[i].question_no, json_data[i].title, ObjectID(json_data[i].user_id.$oid), json_data[i].username, date,
                                        json_data[i].question, json_data[i].keywords, json_data[i].num_of_answers);
            //const result = await users.showProfile(ObjectID(json_data[i].user_id.$oid));
            //console.log(json_data[0].user_id)

            console.log(res);
        }
        catch (error) {
            console.log(error);
        }
    }
}

populateQuestions();
