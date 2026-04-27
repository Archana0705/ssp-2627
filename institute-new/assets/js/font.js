// sidebar
$(document).ready(function() {
    $('.toggle-sidebar-btn').click(function() {
        $('body').toggleClass('toggle-sidebar');
    });
    var $affectedElements = $("p, h1, h2, h3, h4, h5, h6, span, a, div, label, option, select, .card-body");

    // Store the original font size of each element
    $affectedElements.each(function () {
      var $this = $(this);
      $this.data("orig-size", $this.css("font-size"));
    });

    // Increase font size on button click
    $(".btn-increase").click(function () {
      changeFontSize(1);
    });

    // Decrease font size on button click
    $(".btn-decrease").click(function () {
      changeFontSize(-1);
    });

    // Reset to original font size on button click
    $(".btn-orig").click(function () {
      $affectedElements.each(function () {
        var $this = $(this);
        $this.css("font-size", $this.data("orig-size"));
      });
    });

    // Function to change font size
    function changeFontSize(direction) {
      $affectedElements.each(function () {
        var $this = $(this);
        var currentSize = parseFloat($this.css("font-size"));
        $this.css("font-size", (currentSize + direction) + "px");
      });
    }
  });


  function toggleScreenReader() {
    var sr = document.getElementById("sound");
    if (sr.className == "bi bi-volume-up-fill") {
        sr.className = "bi bi-volume-down-fill";
    } else {
        sr.className = "bi bi-volume-up-fill";
    }
    readText();
}

function readText() {
    let checkBoxSR = document.getElementById("screenReaderSwitch");
    const bodyElement = document.querySelector("body");
    const textContent = getTextFromElement(bodyElement);

    if (checkBoxSR.checked) {
        const utterance = new SpeechSynthesisUtterance(textContent);
        utterance.addEventListener('boundary', (event) => {
            const charIndex = event.charIndex;
            highlightText(charIndex);
        });
        utterance.onend = clearHighlights;
        speechSynthesis.speak(utterance);
    } else {
        speechSynthesis.cancel();
        clearHighlights();
    }
}

function getTextFromElement(element) {
    let text = "";

    function shouldExclude(element) {
        return (
            element.tagName === "SCRIPT" ||
            element.tagName === "HEAD" ||
            element.style.display === "none" ||
            element.style.visibility === "hidden" ||
            element.classList.contains("gigw") ||
            element.classList.contains("header") ||
            element.classList.contains("apexcharts-canvas") ||
            element.classList.contains("footer") ||
            !element.closest("body")
        );
    }

    function traverse(element) {
        for (let node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                !shouldExclude(node)
            ) {
                traverse(node);
            }
        }
    }

    traverse(element);
    return text;
}