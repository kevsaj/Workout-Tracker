const express = require('express');
const mongojs = require('mongojs')
const mongoose = require('mongoose');
const path = require('path')
const PORT = process.env.PORT || 3000;

const db = require('./models');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout-tracker', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


app.get('/exercise', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/exercise.html'));
})


app.get('/stats', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/stats.html'));
})


app.get("/api/workouts",(req,res)=>{
    db.Workout.find({})
    .then(workoutDB => {
        res.json(workoutDB);
    })
    .catch(err => {
        res.json(err);
    });
});

app.post("/api/workouts",(req,res)=>{
    db.Workout.create(new db.Workout(req.body))
    .then(workoutDB => {
        res.send(workoutDB);
    })
    .catch(error =>{
        res.json(error);
    });
});


app.put("/api/workouts/:id", (req, res) => {
    db.Workout.findByIdAndUpdate(req.params.id,
        {
            $push: {
                "exercises": req.body
            }
        },
        {
            new: true
        }
    ).then(dbUpdateWorkout => {
        res.json(dbUpdateWorkout);
    })
        .catch(err => {
            res.json(err);
        });
});


app.get("/api/workouts/range",(req,res)=>{
    db.Workout.find({})
    .then(dbWorkouts =>{
        res.json(dbWorkouts);
    });
});

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});