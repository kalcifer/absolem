/* global define */
define([
    'jquery', 'ramda', 'pointfree', 'Maybe', 'io', 'bacon', 'http'
], function($, _, P, Maybe, io, bacon, http) {
    'use strict';


    var compose = P.compose;
    var map = P.map;
    var concatenate = P.concat;

    var log = function(x) {
        console.log(x);
        return x;
    }

    var setHtml = _.curry(function(sel, x) {
        return $(sel).html(x);
    });

    var appendandClearHtml = _.curry(function(sel, x) {
        $('#item').val('');
        return $(x).appendTo(sel);
    });

    var makeHtml = _.curry(function(itemText) {
        return "<li>" + itemText + "</li>"
    })

    var listen = _.curry(function(event, target) {
        return bacon.fromEventTarget($(target), event);
    });

    var isEnter = function(event) {
        return event.keyCode === 13 ? Maybe(event) : Maybe(null)
    }

    var keyUpStream = listen('keyup');

    var clickStream = listen('click');


    var getVal = compose(_.get('value'), _.get('target'));
    var getJqVal = function(item) {
        return item.val();
    }
    var isVal = function(x) {
        return x && x !== "" ? Maybe(x) : Maybe(null);
    }
    var toTextBoxTarget = function(x) {
        return $('#item');
    }
    var isLi = function(target) {
        return target.nodeName === 'LI' ? Maybe(target) : Maybe(null);
    }
    var removeHtml = function(target) {
        $(target).remove()
    }
    var createHtml = compose(appendandClearHtml('#todos'), makeHtml)
    var getItem = compose(map(createHtml), isVal);


    keyUpStream('#item').onValue(
        compose(map(getItem), map(getVal), isEnter)
    );

    clickStream('#submitItem').onValue(
        compose(map(getItem), isVal, getJqVal, toTextBoxTarget)
    );

    clickStream(document).onValue(
        compose(map(removeHtml), isLi, _.get('target'))
    );


});
