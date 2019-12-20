const header = document.querySelector("header");
const sectionOne = document.querySelector(".lg-heading");

const sectionOneOptions = {
    rootMargin: "-120px 0px 0px 0px"
};

const sectionOneObserver =
    new IntersectionObserver((entries, sectionOneObserver) => {
        entries.forEach(entry => {
            console.log(entry);
            if (!entry.isIntersecting) {
                header.classList.add("nav-scrolled");
            } else {
                header.classList.remove("nav-scrolled");
            }
        });
    }, sectionOneOptions);

sectionOneObserver.observe(sectionOne);

console.log("hello from observer.js");