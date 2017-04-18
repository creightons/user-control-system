const express = require('express');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.get('/', (req, res) => {
	res.status(200).render('base');
});

app.listen(process.env.SERVER_PORT, () => {
	console.log(`server is live on port ${process.env.SERVER_PORT}...`);
});