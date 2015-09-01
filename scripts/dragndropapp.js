/* global define */
define([
  'jquery'
, 'ramda'
, 'pointfree'
, 'Maybe'
, 'bacon'
], function($, _, P, Maybe, bacon) {
  'use strict';

  	var listen = _.curry(function(event, target){
		return bacon.fromEventTarget($(target), event);
	});

	var log = function(x){
		x? console.log(x) : console.log('Here you end');
		return x;
	}

	var id = function(x){
		return x;
	}

	var start = function(){
		return "Start Drag"
	}

	var stop = function(){
		return "Stop Drag"
	}
	var coords = function(event){
		return {
			left:event.clientX - $(origItem()).offset().left,
			top:event.clientY - $(origItem()).offset().top
		}
	}

	var createItem = function(event){
		dragItem = event.target;
		origItem = function(){
			return event.target
		};
		return event;
	}
	var moveItem = function(coords){
		dragItem.style.webkitTransform =
		dragItem.style.transform =
		'translate(' + coords.left + 'px, ' + coords.top + 'px)';
		dragItem.setAttribute('data-x', coords.left);
		dragItem.setAttribute('data-y', coords.top);
		return coords;
	}

	var setCoords = _.curry(function(starter, mm){
			return {
				left:(parseFloat(starter.target.getAttribute('data-x')) || 0) + (mm.clientX - (parseFloat(starter.target.getAttribute('data-x')) || 0)),
				top:(parseFloat(starter.target.getAttribute('data-y')) || 0) + (mm.clientY - (parseFloat(starter.target.getAttribute('data-y')) || 0))
			}
		})

	var setData = _.curry(function(starter, event){
		starter.target.setAttribute('data-x', starter.clientX);
		starter.target.setAttribute('data-y', starter.clientY);
		return event;
	})
	var starter = function(md){
		return{
			startx:md.offsetX,
			starty:md.offsetY
		}
	}

	var flatMap = _.curry(function(fn, stream){
		return stream.flatMap(fn);
	});

	var takeUntil = _.curry(function(stream2, stream1){
		return stream1.takeUntil(stream2);
	})

	var onValue = _.curry(function(fn, stream){
		return stream.onValue(fn);
	})

	var doAction = _.curry(function(action, stream){
		return stream.doAction(action)
	})

	var map = P.map;
	var compose = P.compose;

	var mouseUp = compose(doAction('.preventDefault'),listen('mouseup'));
	var mouseDown = compose(doAction('.preventDefault'),listen('mousedown'));
	var mouseMove = compose(doAction('.preventDefault'),listen('mousemove'))

	var dragStream = flatMap(function(md){
		return map(compose(setCoords(md), setData(md)), takeUntil(mouseUp(document), mouseMove(document)));
	})(mouseDown('.draggable'))

	mouseDown('.draggable').onValue(compose(log, start))
	dragStream.onValue(
		compose(log, moveItem)
	)

	//dragStart, dragMove, dragEnd, drop, dropActive, dropInactive

	//droppedStream.onValue(compose(log, stop))
	
});