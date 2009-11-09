/*
 * SpicySelect jQuery Plugin
 *
 * http://github.com/paulelliott/jquery-spicyselect
 *
 * Copyright (c) 2009 Paul Elliott (paul@codingfrontier.com)
 *
 * Based on the jListbox jQuery plugin by Giovanni Casassa (senamion.com - senamion.it)
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt) and GPL (GPL-LICENSE.txt) licenses.
 */
(function($) {
  $.fn.extend({
    spicyselect: function(user_settings) {
      //Override the default settings with the user settings
      var settings = $.extend({
        defaultText: "",
        animate: true
      }, user_settings);

      //Iterate through all the selects being masked
      return this.each(function() {
        //Get and move the select box off the screen
        var selectBox = $(this).css({
          position: 'absolute',
          left: '-9999px'
        }).focus(function() {
          $("#" + $(this).data("mask_id")).focus();
        }).blur(function() {
          hideMask($("#" + $(this).data("mask_id")), settings);
        });
        var selectOptions = $("> *", this);

        //Create and store the id for the masking ol
        var maskId = selectBox.attr('id') + '_mask';
        selectBox.data("mask_id", maskId);

        //Insert the basic structure for the mask into the DOM right after the select
        selectBox.after("<div id='" + maskId + "'><a></a><ol></ol></div>");
        var selectMask = $("#" + maskId).addClass("spicyselect").addClass(selectBox.attr("class")).focus(function() {
          selectMask.addClass("focus");
        });
        selectMask.data("select_id", selectBox.attr("id"));
        var label = selectMask.find("> a");

        //Handle the keypress events
        selectBox.keydown(function(e) {
          //If the keypress was not ctrl, alt, or command and not a tab or enter, send it to the mask instead
          if (e.which != 9 && !e.altKey && !e.ctrlKey && !e.metaKey) {
            //if the down arrow was pressed, show the list
            if (e.which == 40) { //if the down arrow was pressed
              if (selectMask.find("> ol").is(":hidden")) {
                showMask(selectMask, settings);
              } else {
                var current = selectMask.find(".current");
                if (current.length == 0) { //If none are selected, select the first one.
                  selectMask.find("li:first").addClass("current");
                } else if (!selectMask.find("li:last").is(".current")) { //If the last one is selected, do nothing
                  //If any other one is selected, move it down one.
                  var currentIndex = selectMask.find("li").index(current);
                  selectMask.find("li:eq(" + (currentIndex + 1) + ")").addClass("current");
                  current.removeClass("current");
                }
              }
            } else if (e.which == 38 && selectMask.find("> ol").is(":visible")) { //if the up arrow is pressed
              //If the first one is selected, do nothing
              //If any other one is selected, move it up one.
              var current = selectMask.find(".current");
              var currentIndex = selectMask.find("li").index(current);
              selectMask.find("li:eq(" + (currentIndex - 1) + ")").addClass("current");
              current.removeClass("current");
            } else if (e.which == 27) { //if escape is pressed
              hideMask(selectMask, settings);
            } else if ((e.which == 13 || e.which == 32) && selectMask.find("> ol").is(":visible")) { //enter or spacebar is pressed
              //select the current option
              selectOption(selectMask);
              hideMask(selectMask, settings);
            } else if (e.which == 13) {
              //allow enter to pass through to the form if the the options are not visible.
            }

            return false;
          }
        });

        //If the first option has no value, assume it to be the default.
        if (selectOptions.length && !selectOptions[0].value) {
          settings.defaultText = selectOptions[0].text;
          selectOptions = selectOptions.slice(1);
        }
        label.text(settings.defaultText);

        //Iterate over the children of the select
        var options = selectMask.find("> ol").hide();
        selectOptions.each(function() {
          var option = $(this);

          //For an optgroup...
          if (option.is("optgroup")) {
            //Put the optgroup into a new ol
            var optgroup = $("<ol></ol>");
            optgroup.append(createLi(option));

            //Iterate over the options contained within and put them in the ol
            $("option", option[0]).each(function() {
              optgroup.append(createLi($(this)));
              $(this).is(":selected") && label.text(this.text);
            });

            options.append(optgroup);
          } else {
            if (!this.value) {
              //A valueless option is considered to be the default value
              settings.defaultText = this.text;
            } else {
              //Write an option with a blue into the ol
              options.append(createLi(option));
            }
          }

          //If the option was selected, use its label for display
          option.is(":selected") && label.text(option.text());
        });

        //Toggle the the ol if the display anchor is clicked
        selectMask.find("> a").click(function(){
          showMask(selectMask, settings);
          return false;
        });

        //When the user selects an option from the list
        selectMask.find("ol li").click(function() {
          if ($(this).is(".optgroup_label")) return false;
          var mask = $(this).addClass("current").closest("div");
          //Get the original select
          selectOption(mask);
          hideMask(mask, settings);
        });

        //If the user clicks off the select, hide it
        $("body").click(function() {
          hideMask($(".spicyselect"), settings);
        });
      });
    }
  });

  function hideMask(mask, settings) {
    settings.animate && mask.find("> ol").slideUp("fast") || mask.find("> ol").hide();
    mask.removeClass("focus");
    mask.find(".current").removeClass("current");
  }

  function showMask(mask, settings) {
    settings.animate && mask.find("> ol").slideDown("fast") || mask.find("> ol").show();
    mask.addClass("focus");
  }

  function selectOption(mask) {
    var option = mask.find(".current");
    if (option.length > 0) {
      mask.find("a:first").text(option.text());
      $("#" + mask.data("select_id")).val(option.data("value")).change();
    }
  }

  //Create an li for the mask from an option or optgroup
  function createLi(option) {
    var text = option.is("optgroup") ? option.attr("label") : option.text();
    var li = $("<li>" + text + "</li>").addClass(option.attr('class')).attr("style", option.attr('style'));
    option.is("optgroup") && li.addClass("optgroup_label");
    li.data('value', option.val());
    return li;
  }
})(jQuery);
