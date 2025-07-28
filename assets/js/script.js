'use strict';

/**
 * Navbar toggle functionality
 */
const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [navOpenBtn, navCloseBtn, overlay];

const navToggleEvent = function (elem) {
  for (let i = 0; i < elem.length; i++) {
    elem[i].addEventListener("click", function () {
      navbar.classList.toggle("active");
      overlay.classList.toggle("active");
    });
  }
};

navToggleEvent(navElemArr);
navToggleEvent(navLinks);

/**
 * Dropdown menu toggle on click (for mobile or custom dropdowns)
 */
document.querySelectorAll('.navbar-link').forEach(link => {
  link.addEventListener('click', function (e) {
    const dropdown = this.nextElementSibling;
    if (dropdown && dropdown.classList.contains('dropdown-menu')) {
      e.preventDefault(); // Prevent link navigation if there's a dropdown
      dropdown.classList.toggle('open');
    }
  });
});

/**
 * Sticky header & go-to-top button
 */
const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 200) {
    header.classList.add("active");
    goTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    goTopBtn.classList.remove("active");
  }
});
