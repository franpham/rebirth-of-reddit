"use strict";
/* jslint browser: true */
/* globals $: false */

(function () {
  var CLICK = "click";
  $.getJSON("https://www.reddit.com/r/aww.json", function(obj) {
    var json = obj.data.children;
    var ul = $('<ul />');
    $('section').append(ul);
    $.each(json, function(idx, val) {
      var data = val.data;
      var content = $('<div />', {
        'class': 'content'
      });
      // 'href': data.preview.images[0].source.url
      var image = $('<a />', {
        'href': data.url,
        'target': '_blank'})
        .append($('<img />', {
          'src': data.thumbnail,
          'width': '200px',
          'height': '200px'
      }));
      content.data(CLICK, true);
      ul.append(
        $('<li />', {'id': data.id})
          .append($('<a />', {
            'href': '#',
            'class': 'contentLink',
            'html': data.title
          }))
          .append($('<a />', {
            'href': 'https://www.reddit.com' + data.permalink,
            'class': 'comments',
            'target': '_blank',
            'html': ' comments'
          }))
          .append(image)
          .append(content.html(data.selftext_html))
      );
    });
    $('.contentLink').click(function() {
      var content = $(this).siblings('.content');
      content.fadeToggle(500);
      if (content.data(CLICK)) {
        content.data(CLICK, false);
        content.html(content.text());
      } else {
        content.data(CLICK, true);
        content.text(content.html());
      }
    });
  });
})();