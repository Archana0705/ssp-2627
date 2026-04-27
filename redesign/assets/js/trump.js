let animating = false;

$(".next").click(function () {
  if (animating) return;
  animating = true;

  let current_fs = $(this).closest("fieldset");
  let next_fs = current_fs.next();

  $("#field-progressbar li")
    .eq($("fieldset").index(next_fs))
    .addClass("active");

  next_fs.show();

  current_fs.css({ position: "absolute" });

  current_fs.animate(
    { opacity: 0 },
    {
      duration: 500,
      easing: "swing", // built-in, no plugin needed
      step: function (now) {
        let scale = 1 - (1 - now) * 0.2;
        let left = now * 50 + "%";
        let opacity = 1 - now;

        current_fs.css({
          transform: "scale(" + scale + ")",
        });

        next_fs.css({
          left: left,
          opacity: opacity,
        });
      },
      complete: function () {
        current_fs.hide();
        animating = false;
      },
    }
  );
});

$(".previous").click(function () {
  if (animating) return;
  animating = true;

  let current_fs = $(this).closest("fieldset");
  let prev_fs = current_fs.prev();

  $("#field-progressbar li")
    .eq($("fieldset").index(current_fs))
    .removeClass("active");

  prev_fs.show();

  current_fs.animate(
    { opacity: 0 },
    {
      duration: 500,
      easing: "swing",
      step: function (now) {
        let scale = 0.8 + (1 - now) * 0.2;
        let left = (1 - now) * 50 + "%";
        let opacity = 1 - now;

        current_fs.css({ left: left });

        prev_fs.css({
          transform: "scale(" + scale + ")",
          opacity: opacity,
        });
      },
      complete: function () {
        current_fs.hide();
        animating = false;
      },
    }
  );
});