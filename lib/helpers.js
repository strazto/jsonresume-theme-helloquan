var Handlebars = require('handlebars');
var moment = require('moment');
var encode = require('email-scramble').encode;
var micromark = require('micromark');

var parseText = function(text, pattern, replacement, lowercase) {
    text = Handlebars.escapeExpression(text || '');
    text = text.replace(pattern, replacement);
    text = !!lowercase ? text.toLowerCase() : text;
    return new Handlebars.SafeString(text);
};

var formatDate = function(date, format) {
    date = Handlebars.escapeExpression(date || '');
    date = moment(date).format(format);
    return new Handlebars.SafeString(date);
};

var isObject = function(thing) {
    return (typeof thing === 'object')
}

// Coalesce implementation from:
// https://github.com/leapfrogtechnology/just-handlebars-helpers/blob/ebf098/src/helpers/conditionals.js#L261-L274
// licensed under MIT, copied without including the MIT notice as it is "not a substantial portion" of the work
var coalesce = function(...params) {
  // Ignore the object appended by handlebars.
  if (isObject(params[params.length - 1])) {
    params.pop();
  }

  for (let i = 0; i < params.length; i++) {
    if (params[i]) {
      return params[i];
    }
  }

  return params.pop();
};


module.exports = {
    markdown: function(text) {
        return new Handlebars.SafeString(micromark(text.trim()));
    },
    sanitizePhone: function(phone) {
        return parseText(phone, /[-\s]/g, '', true);
    },
    sanitizeURL: function(url) {
        return parseText(url, /http?s:\/\//g, '', true);
    },
    normalizeNetwork: function(network) {
        return parseText(network, /\s/g, '', true);
    },
    normalizeName: function(name) {
        return parseText(name, /\s/g, '-', true);
    },
    obfuscateText: function(html) {
        html = Handlebars.escapeExpression(html || '');
        html = html.substring(0, 4) + '<span style="display:none;">1337</span>' + html.substring(4);
        return new Handlebars.SafeString(html);
    },
    scrambleText: function(text) {
        text = Handlebars.escapeExpression(text || '');
        text = encode(text);
        return new Handlebars.SafeString(text);
    },
    scramblePhone: function(phone) {
        return encode(parseText(phone, /[-\s]/g, '', true));
    },
    formatDate: formatDate,
    formatMMMMYYYY: function(date) {
        return formatDate(date, 'MMMM YYYY');
    },
    formatMMMDDYYYY: function(date) {
        return formatDate(date, 'MMM DD, YYYY');
    },
    formatYYYY: function(date) {
        return formatDate(date, 'YYYY');
    },
    humaneDuration: function(start, end) {
        start = Handlebars.escapeExpression(start || '');
        var endTimestamp = end ? new Date(end).getTime() : Date.now();
        var duration = endTimestamp - (new Date(start).getTime());
        return new Handlebars.SafeString(moment.duration(duration).humanize());
    },
    mapURL: function(location) {
        var googleMaps = 'https://www.google.com/maps?q=';
        var fields = [
            Handlebars.escapeExpression(location.address || ''),
            Handlebars.escapeExpression(location.postalCode || ''),
            Handlebars.escapeExpression(location.city || ''),
            Handlebars.escapeExpression(location.region || ''),
            Handlebars.escapeExpression(location.countryCode || '')
        ];
        return new Handlebars.SafeString(googleMaps + encodeURIComponent(fields.join(' ').replace(/\s+/g, ' ')));
    },
    itemID: function(category, index, length) {
        category = Handlebars.escapeExpression(category || '');
        index = Handlebars.escapeExpression(length - index);
        return new Handlebars.SafeString(category + '-' + index);
    },
    truncate: function(text, length) {
        text = Handlebars.escapeExpression(text || '');
        text = text.substring(0, length);
        return new Handlebars.SafeString(text);
    },
    coalesce: coalesce
};
