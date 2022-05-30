var fs = require('fs');
var Handlebars = require('handlebars');

var partials = require('./lib/partials');
var helpers = require('./lib/helpers');

Handlebars.registerPartial(partials);
Handlebars.registerHelper(helpers);

var desired_width = 767;
var desired_height = 1080;

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
        width: `${(desired_width*1.3) % 1}px`,
        height: `${(desired_height*1.3) % 1}px`

    },
    //pdfViewport: {
    //    "width" : 767,
    //    "height": 1080
    //}
};
