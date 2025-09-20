var fs = require('fs');
var Handlebars = require('handlebars');

var partials = require('./lib/partials');
var helpers = require('./lib/helpers');

Handlebars.registerPartial(partials);
Handlebars.registerHelper(helpers);

const desired_width = 767;
const desired_height = 1080;

module.exports = {
    render: function(resume) {
        var template = fs.readFileSync(__dirname + '/resume.hbs', 'utf-8');

        return Handlebars.compile(template)({
            resume: resume,
        });
    },


    pdfRenderOptions: {
        format: 'A4',
        margin: {top:'0mm', right:'0mm', bottom:'0mm', left: '0mm'},
        printBackground: false,
    },
    pdfViewport: {
       "width" : desired_width,
       "height": desired_height,
    }
};
