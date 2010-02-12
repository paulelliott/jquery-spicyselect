Screw.Unit(function() {
  describe("jquery-spicyselect", function() {
    //Clean up the spicyselect after each run.
    after(function() {
      $("select").each(function() {
        getMask($(this)).remove();
        $(this).removeData("mask_id");
      }).val('');
    });

    describe('when applied with the default options', function() {
      before(function() { $("select").spicyselect({animate:false}); });

      it("should have a data element with the id of the mask", function() {
        expect($("select").data('mask_id')).to(be_true);
      });
      it("should have a mask present in the dom", function() {
        expect(getMask($("select")).length).to(equal, 1);
      });
      it("should have a mask with the correct number of items in the drop down", function() {
        expect(getMask($("select")).find("li").length).to(equal, 6);
      });
      it("should not have the valueless option", function() {
        expect(getMask($("select")).find("li:contains(Valueless Option)").length).to(equal, 0);
      });
      it("should have the correct options", function() {
        var mask = getMask($("select"));
        expect(mask.find("li:eq(0)").text()).to(equal, "Basic Option");
        expect(mask.find("li:eq(1)").text()).to(equal, "Awesome Option");
        expect(mask.find("li:eq(1)").data('value')).to(equal, "awesome");
        expect(mask.find("li:eq(2)").text()).to(equal, "Classy Option");
        expect(mask.find("li:eq(2)").hasClass('classy')).to(be_true);
      });
      it("has the correct default value", function() {
        expect(getMask($("select")).find("> div a").text()).to(equal, "Valueless Option");
      });
      it("should have a nested ol for the option group", function() {
        expect(getMask($("select")).find("> ol").length).to(equal, 1);
      });
      it("should have the proper label on the option group", function() {
        expect(getMask($("select")).find("> ol > ol li.optgroup_label").length).to(equal, 1);
      });
      it("should not have visible options", function() {
        expect(getMask($("select")).find("> ol").is(":hidden")).to(be_true);
      });
    });

    describe("when the select has a class attribute", function() {
      before(function() { $("select").addClass("someclass").spicyselect({animate:false}); });
      after(function() { $("select").removeClass("someclass"); });

      it("should have the same class on the mask", function() {
        expect(getMask($("select")).hasClass("someclass")).to(be_true);
      });
    });

    describe("when the anchor is clicked", function() {
      before(function() {
        $("select").spicyselect({animate:false});
        getMask($("select")).find("> div").click();
      });

      it("shows the drop down", function() {
        expect(getMask($("select")).find("> ol").is(":visible")).to(be_true);
      });
    });

    describe("when an option is clicked", function() {
      before(function() {
        $("select").spicyselect({animate:false});
        var mask = getMask($("select"));

        //show the options
        mask.find("a").click();

        //click on the Classy Option
        mask.find("li.classy").click();
      });

      it("should show the option text", function() {
        expect(getMask($("select")).find("a").text()).to(match, getMask($("select")).find("li.classy").text());
      });
      it("should set the value of the underlying select", function() {
        expect($("select").val()).to(match, getMask($("select")).find("li.classy").data("value"));
      });
      it("should hide the options", function() {
        expect(getMask($("select")).find("> ol").is(":hidden")).to(be_true);
      });
    });

    describe("when an optgroup label is clicked", function() {
      before(function() {
        $("select").spicyselect({animate:false});
        var mask = getMask($("select"));

        //show the options
        mask.find("a").click();

        //click on the optgroup label
        mask.find("li.optgroup_label").click();
      });

      it("should not do anything", function() {
        expect(getMask($("select")).find("> ol").is(":visible")).to(be_true);
      });
    });

    describe("when the select receives focus", function() {
      var called = false, mask;

      before(function() {
        $("select").spicyselect({animate:false});
        mask = getMask($("select")).focus(function() {
          called = true;
        });
        $("select").focus();
      });

      it("should call focus on the mask", function() {
        expect(called).to(be_true);
      });
      it("should have class 'focus'", function() {
        expect(mask.is(".focus")).to(be_true);
      });

      describe("and then receives blur", function() {
        before(function() {
          $("select").blur();
        });

        it("should no longer have class 'focus'", function() {
          expect(mask.is(".focus")).to(be_false);
        });
      });
    });

    describe("when applied with a custom label", function() {
      var mask;

      before(function() {
        $("select").spicyselect({
          animate: false,
          label_markup: "<label></label><span class='indicator'></span>",
          label_text_selector: "> label"
        });
        mask = getMask($("select"));
      });

      it("should have the custom markup in the label", function() {
        expect(mask.find("> div > label").length).to(equal, 1);
        expect(mask.find("> div > span").is(".indicator")).to(be_true);
      });

      it("should have the default text in the custom location", function() {
        expect(mask.find("> div > label").text()).to(equal, "Valueless Option");
      });

      describe("when an option is selected", function() {
        before(function() {
          //Show the options
          mask.find("> div > label").click();
          //Select an option
          mask.find("ol li.rockin").click();
        });

        it("should have the text for the selected option", function() {
          expect(mask.find("> div > label").text()).to(equal, "Option Groups Rock");
        });
      });
    });

    describe('when clicking off the select', function() {
      var mask;

      before(function() {
        $("select").spicyselect({ animate: false });
        mask = getMask($("select"));
        mask.click();
        $("#some_other_div").click();
      });

      it('is hidden again', function() {
        expect(mask.find("ol").is(':hidden')).to(be_true);
      });

    });
  });

  function getMask(select) {
    return $("#" + select.data("mask_id"));
  }
});
