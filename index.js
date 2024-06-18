const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Post = require('./post');

require('dotenv').config();

const app = express();
const port = 3000;

const publicVapidKey = 'BJZJ4NEQV37ZZlwsTGR3a6wiCY4m1GTQ-HOBsCIzlNe2dZQCdryJLc-6Zd6AvzOaBVHiiONnFBWwiGUxMpCEsu4';
const privateVapidKey = 's58vvc75MB-RHJc5cT3xewtaer_nMQ3b5g0ZuaiCqLc';

webpush.setVapidDetails('mailto:iamfminsaf@gmail.com', publicVapidKey, privateVapidKey);

let subscriptions = [];

app.use(express.json());
app.use(cors({ origin: '*' }));

const index = path.join(__dirname, 'index');
const admin = path.join(__dirname, 'admin');

app.use(express.static(index));

app.use('/admin', express.static(admin));

app.set('view engine', 'ejs');

app.get('/post/:id', async (req, res) => {
	const postId = parseInt(req.params.id);
	const post = await Post.findById(postId);
	if (post) {
		res.render('post', { post });
	}
});

app.get('/data', async (req, res) => {
	const data = await Post.find({});
	res.json(data);
});

app.post('/save-subscription', (req, res) => {
	const subscription = req.body;
	subscriptions.push(subscription);
	res.status(201).json({ message: 'Subscription saved' });
});

app.post('/send-notifications', (req, res) => {
	const notificationPayload = {
		title: req.body.title,
		body: req.body.body,
	};

	const promises = subscriptions.map((subscription) => {
		return webpush.sendNotification(subscription, JSON.stringify(notificationPayload)).catch((error) => {
			console.error('Error sending notification, reason: ', error);
		});
	});

	Promise.all(promises)
		.then(async () => {
			const post = await Post.create({ title: req.body.title, body: req.body.body });
			res.status(201).json({ message: 'Notifications sent' });
		})
		.catch((error) => {
			console.error('Error sending notifications: ', error);
			res.sendStatus(500);
		});
});

mongoose
	.connect(process.env.DB_URI)
	.then(() => {
		console.log('DB connected successfully!!!');
		app.listen(8050, () => {
			console.log('Server is running on port 8080');
		});
	})
	.catch((err) => console.log(err));
