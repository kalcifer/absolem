/* global document */

require.config({ baseUrl: '/scripts'
               , paths : { 'jquery': '/bower_components/jquery/dist/jquery.min'
                         , 'ramda': '/scripts/ramda'
                         , 'pointfree': '/bower_components/pointfree/dist/pointfree.amd'
                         , 'future': 'data.future.umd'
                         , 'bacon': '/bower_components/bacon/dist/Bacon.min'
                         //, 'lenses': '/node_modules/lenses/dist/lenses.amd'
                         }
               , shim: { jquery: { exports: '$' }
                       , lodash: { exports: '_' }
                       , ramda: { exports: 'ramda' }
                       }
                });
require(
  [ 'jquery', 'dragndropapp' ],
  function($, app){
    'use strict';

    $(app);
  }
);
