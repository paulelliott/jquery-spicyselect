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
        //Get and hide the select box
        var selectBox = $(this).hide();
        var selectOptions = $("> *", this);

        //Create and store the id for the masking ol
        var maskId = selectBox.attr('id') + '_mask';
        selectBox.data("mask_id", maskId);

        //Insert the basic structure for the mask into the DOM right after the select
        selectBox.after("<div id='" + maskId + "'><a></a><ol></ol></div>");
        var selectMask = $("#" + maskId).addClass("spicyselect").addClass(selectBox.attr("class"));
        selectMask.data("select_id", selectBox.attr("id"));
        var label = selectMask.find("> a");

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
          var options = $(this).closest("div").find("> ol");
          settings.animate && options.slideToggle("fast") || options.toggle();
          return false;
        });

        //When the user selects an option from the list
        selectMask.find("ol li").click(function() {
          if ($(this).is(".optgroup_label")) return false;
          var mask = $(this).closest("div");
          //Get the original select
          $('#' + mask.data('select_id')).val($(this).data("value")).change();
          mask.find("a:first").text($(this).text());
          settings.animate && mask.find("> ol").slideUp("fast") || mask.find("> ol").hide();
        });

        //If the user clicks off the select, hide it
        $("body").click(function(){
          settings.animate && $(".spicyselect > ol").slideUp("fast") || $(".spicyselect > ol").hide();
        });
      });
    }
  });

  //Create an li for the mask from an option or optgroup
  function createLi(option) {
    var text = option.is("optgroup") ? option.attr("label") : option.text();
    var li = $("<li>" + text + "</li>").addClass(option.attr('class'));
    option.is("optgroup") && li.addClass("optgroup_label");
    li.data('value', option.val());
    return li;
  }
})(jQuery);
