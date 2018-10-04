const template = require( './default.twig' );

const image = {
    "do-src": require("../images/icons/DO_Logo_Horizontal_White.png"),
    "portrait-src": require("../images/portraits/portrait-0.jpg"),
    "cashapp-icon": require("../images/icons/CashApp-Dollar-Icon.svg"),
};

const partials = {
    header: '{% partial "../partials/site/header" %}',
    footer: '{% partial "../partials/site/footer" %}',
};

const page = {
    id: '{{ this.page.id }}',
    title: '{{ this.page.title }}',
    content: '{% page %}'
};


module.exports = template( { image, partials, page } );