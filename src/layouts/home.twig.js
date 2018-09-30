const template = require( './home.twig' );

const image = {
    src: require("../images/backgrounds/bg.jpg"),
    alt: "Chuck Norris"
};

module.exports = template( { image } );