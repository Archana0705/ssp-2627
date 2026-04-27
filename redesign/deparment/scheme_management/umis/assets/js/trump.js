function initStepper(formId, progressId) {
  let currentStep = 0;
  const steps = document.querySelectorAll(`#${formId} fieldset`);
  const progressItems = document.querySelectorAll(`#${progressId} li`);
  let animating = false;

  function updateProgress(index) {
    progressItems.forEach((item, i) => {
      item.classList.remove("active");
      if (i === index) item.classList.add("active");
    });
  }

  function goToStep(newStep, direction) {
    if (animating || newStep === currentStep) return;
    animating = true;

    let current = steps[currentStep];
    let next = steps[newStep];

    next.classList.remove("active", "exit-left", "exit-right");

    // animation direction
    next.style.transform =
      direction === "next"
        ? "translateX(100%)"
        : "translateX(-100%)";

    next.style.opacity = "1";
    next.style.display = "block";

    next.offsetHeight; // force repaint

    current.classList.add(direction === "next" ? "exit-left" : "exit-right");
    next.classList.add("active");

    setTimeout(() => {
      current.classList.remove("active", "exit-left", "exit-right");
      current.style.opacity = "0";

      next.style.transform = "";
      next.style.opacity = "";

      currentStep = newStep;
      updateProgress(currentStep);
      animating = false;
    }, 400);
  }

  /* =========================
     TAB CLICK NAVIGATION
  ========================== */
  progressItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (animating || index === currentStep) return;

      const direction = index > currentStep ? "next" : "prev";
      goToStep(index, direction);
    });
  });



  steps.forEach((step, i) => {
    step.style.display = i === 0 ? "block" : "none";
    step.style.opacity = i === 0 ? "1" : "0";
  });

  steps[0].classList.add("active");
  updateProgress(0);
}

document.addEventListener("DOMContentLoaded", function () {
  initStepper("msform", "field-progressbar");
  initStepper("ssform", "field-progressbar1");
});

$('.column-toggle').on('change', function () {

  let type = $(this).val();

  if (type === "course") {
    $('.course-col').toggleClass('d-none');
  }

  if (type === "institute") {
    $('.inst-col').toggleClass('d-none');
  }

  if (type === "student") {
    $('.stud-col').toggleClass('d-none');
  }

  table.columns.adjust().draw(false);

});








// function getSelected(name) {
//   return Array.from(
//     document.querySelectorAll(`.chip-select[data-name="${name}"] input:checked`)
//   ).map(i => i.value);
// }

document.addEventListener("DOMContentLoaded", function () {

  const radios = document.querySelectorAll('input[name="disability_status"]');

  const categoryField = document.getElementById("add_field_disability_category");
  const amountField = document.getElementById("add_field_disability_amount");

  function toggleDisabilityFields() {
    const selected = document.querySelector('input[name="disability_status"]:checked');

    if (selected && selected.value === "Applicable") {
      categoryField.classList.remove("d-none");
      amountField.classList.remove("d-none");
    } else {
      categoryField.classList.add("d-none");
      amountField.classList.add("d-none");
    }
  }

  // run on change
  radios.forEach(radio => {
    radio.addEventListener("change", toggleDisabilityFields);
  });

  // run on page load (IMPORTANT)
  toggleDisabilityFields();

});