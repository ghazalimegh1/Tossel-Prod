(() => {
  let nav = document.querySelector("nav");
  let footer = document.querySelector("footer");

  function includeHTML(file, elementSelector, targetElement, callback) {
    fetch(file)
      .then(res => res.text())
      .then(html => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        let part = doc.querySelector(elementSelector);
        if (part && targetElement) {
          targetElement.innerHTML = part.innerHTML;
        }
        if (callback) callback();
      })
      .catch(err => console.error("Error including", file, err));
  }

  includeHTML("../../html/nav_footer/nav.html", "nav", nav, () => {
    let navCss = document.createElement("link");
    navCss.rel = "stylesheet";
    navCss.href = "../../css/nav_footer/nav.css";
    document.head.appendChild(navCss);

    let navScript = document.createElement("script");
    navScript.src = "../../js/nav_footer/nav.js";
    navScript.defer = true;
    document.body.appendChild(navScript);
  });

  includeHTML("../../html/nav_footer/footer.html", "footer", footer, () => {
    let footerCss = document.createElement("link");
    footerCss.rel = "stylesheet";
    footerCss.href = "../../css/nav_footer/footer.css";
    document.head.appendChild(footerCss);
  });
})();