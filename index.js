const express = require('express')

var app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
 
const user = require('./app/routes/user');
app.use('/user', user);

const post = require('./app/routes/post');
app.use('/post', post);

const timeline = require('./app/routes/timeLine_post');
app.use('/timeline', timeline);

const message = require('./app/routes/message');
app.use('/message', message);

const like = require('./app/routes/like');
app.use('/like', like);

const friendship = require('./app/routes/friendship');
app.use('/friendship', friendship);

const event = require('./app/routes/event');
app.use('/event', event);

const eventParticipant = require('./app/routes/enent_participant');
app.use('/eventParticipant', eventParticipant);

const comment = require('./app/routes/comment');
app.use('/comment', comment);

var port = 5000;
app.listen(port, () => {
    console.log("The web server is ready on port: "+port);
});