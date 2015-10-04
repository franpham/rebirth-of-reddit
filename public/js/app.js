"use strict";
/* jslint browser: true */
/* globals $: false */

$(function () {
  $.getJSON('https://www.reddit.com/r/aww.json', function(obj) {
    var json = obj.data.children;
    $.each(json, function(idx, val) {
      var data = val.data;

      var content = $('<div />', {        // comments container
        'class' : 'content'
      });
      var title = $('<a />', {            // title link to show comments
            'href' : '#' + data.id,
            'class' : 'contentLink',
            'html' : data.title
          });
      var image = idx === 0 ? '' :
      $('<a />', {                   // link to original image
        'href' : data.url,
        'target' : '_blank'})
        .append($('<img />', {              // thumbnail image
          'src' : data.thumbnail,
          'width' : '200px',
          'height' : '200px'
      }));
      $.ajax({      // reddit does not allow html requests from localhost, so request the json data;
        url : 'http://www.reddit.com' + data.permalink.slice(0, data.permalink.length - 2) + '.json',
        dataType : 'json',
        data : {},
        success : function(obj) {
          var json = obj[1].data.children;
          var replies = '&lt;ul&gt;';
          for (var i = 0; i < json.length; i++) {
            replies += '&lt;li&gt;' + json[i].data.author + ': ' + json[i].data.body_html + '&lt;/li&gt;';
          }
          replies = json.length === 0 ? 'No replies.' : replies + '&lt;/ul&gt;';
          replies = replies.replace(/href="\/r\//g, 'href="http://www.reddit.com/r/');   // prefix relative urls;
          replies = replies.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');   // decode to HTML;
          var source = $('<a />', {
            'href' : 'http://www.reddit.com' + data.permalink,
            'class' : 'comments',     // link to original comments
            'target' : '_blank',
            'text' : ' (source) '
          });
          content.html($(replies)).prepend(source);      // add comments: prepend must be AFTER html();
        }
      });
      var listitem =  $('<li />', {'id' : data.id});    // post container
      listitem.append(title).append(image).append(content);
      $('section').append($('<ul />').append(listitem));
    });
    $('.contentLink').click(function() {
      var content = $(this).siblings('.content');
      content.fadeToggle(500);
    });
  });
});

/* TO ENCODE HTML:
// str = str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;");
// OR: (single & double quotes are not encoded by browser)
function encodeHTML(s) {
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
} */