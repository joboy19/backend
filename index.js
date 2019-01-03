const express = require('express');
const morgan = require('morgan');
const app = express();

// logging
app.use(morgan('dev'));

// static content
app.use(express.static('public'));

// templating
app.set('views', './views');
app.set('view engine', 'pug');

function render_page(name, template) {
    template = template || name;
    app.get(`/${name}`, (req, res) => res.render(`pages/${template}`, {}));
}

render_page('', 'index');

app.listen(8080, () => {});
