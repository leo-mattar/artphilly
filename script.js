gsap.registerPlugin(ScrollTrigger, Flip);

gsap.config({
  nullTargetWarn: false,
  trialWarn: false,
});

let mm = gsap.matchMedia();

let lastScrollTop = 0;

// --- GLOBAL - RELOAD AT THE TOP
$(window).on("beforeunload", function () {
  history.scrollRestoration = "manual";
});

// --- GLOBAL - SPLIT TEXT
let splitText;

function runSplit() {
  splitText = new SplitType("[split-text]", {
    types: "words",
  });
}

// --- GLOBAL FADE
function fade() {
  let elements = gsap.utils.toArray("[fade]");
  // gsap.set(elements, { autoAlpha: 0, y: "5em" });
  gsap.set(elements, { autoAlpha: 0 });

  ScrollTrigger.batch(elements, {
    once: true,
    start: "top 90%",
    onEnter: (batch) => {
      gsap.to(batch, {
        autoAlpha: 1,
        duration: 1.8,
        ease: "power2.out",
        stagger: 0.1,
      });
    },
  });
}

// --- HEADER VISIBILITY STATUS
window.enableHeaderScroll = true; // Flag variable to enable/disable header scrolling

function headerStatus() {
  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (!window.enableHeaderScroll) return; // Exit the function if scrolling is disabled

    if (scrollTop > lastScrollTop) {
      // Scrolling down
      gsap.to(".c-header", { duration: 0.4, autoAlpha: 0 });
    } else {
      // Scrolling up
      gsap.to(".c-header", { duration: 0.4, autoAlpha: 1 });
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  });
}

// --- IMAGES COMPONENT - ARTIST INFO
function imagesArtistInfo() {
  $(".c-img-contain-item").each(function () {
    let artistInfo = $(this).find(".c-artist-info");
    let artistInfoText = $(this).find(".c-artist-info-txt");
    let artistInfoLink = $(this).find(".c-artist-info-link");
    let headlineOneZindex = $(".t-display-1.is-animated").css("z-index");
    let heroLogoZindex = $(".c-img-contain.hero-logo").css("z-index");
    let headlineClosest = $(this).closest('.c-section').find(".t-display-1.is-animated");
    let heroLogoClosest = $(this).closest('.c-section').find(".c-img-contain.hero-logo");

    let tl = gsap.timeline({ paused: true, defaults: { ease: "power3.inOut", duration: 0.4 } });

    // tl.fromTo(
    //   artistInfo, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" });

    // Check screen width
    if ($(window).width() >= 992) {
      tl.fromTo(
        artistInfo, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" });
    } else {
      tl.fromTo(
        artistInfo, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" });
    }

    tl.to(artistInfoText, { autoAlpha: 1 }, "<0.2");
    tl.to(artistInfoLink, { autoAlpha: 1 }, "<0");

    $(this).on("mouseenter", function () {
      if ($(window).width() <= 991) {
        gsap.set(headlineClosest, { zIndex: -1 });
        gsap.set(heroLogoClosest, { zIndex: -1 });
      }
      tl.restart();
    });

    $(this).on("mouseleave", function () {
      if ($(window).width() <= 991) {
        gsap.set(headlineClosest, { zIndex: headlineOneZindex });
        gsap.set(heroLogoClosest, { zIndex: heroLogoZindex });
      }
      tl.reverse();
    });
  });
}

// --- ART SWIPER
if ($(".swiper.art").length > 0) {
  let artSlider = new Swiper(".swiper.art", {
    // slidesPerView: "auto",
    // spaceBetween: 40,
    // centeredSlides: true,
    speed: 400,
    loop: true,
    loopedSlides: 4,
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-next.art",
      prevEl: ".swiper-prev.art",
    },
    breakpoints: {
      320: {
        slidesPerView: 1.37,
        spaceBetween: 20,
        // centeredSlides: false,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
        // centeredSlides: false,
      },
      992: {
        slidesPerView: "auto",
        spaceBetween: 40,
        // centeredSlides: true,
      }
    }
  });
}

// Define the function and attach it to the global scope
// window.initializeSwiper = function () {
//   let artSlider = new Swiper(".swiper.art", {
//   });
// };

// --- EVENTS SWIPER
if ($(".swiper.events").length > 0) {
  let eventsSlider = new Swiper(".swiper.events", {
    slidesPerView: "auto",
    speed: 600,
    spaceBetween: 40,
    grabCursor: true,
    navigation: {
      nextEl: ".swiper-next.events",
      prevEl: ".swiper-prev.events",
    },
    breakpoints: {
      320: {
        slidesPerView: 1.10,
        spaceBetween: 18,
      },
      376: {
        slidesPerView: 1.30,
        spaceBetween: 18,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      992: {
        slidesPerView: "auto",
        spaceBetween: 40,
      }
    }
  });
}

// --- THEME SWITCHER
function themeSwitch() {
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }
  const colorThemes = [];
  const htmlStyles = getComputedStyle(document.documentElement);
  const targetStylesheet = document.querySelector("#color-themes");
  const regex = /--([^:\s]+):\s*var\(--([^)]+)\);/g;

  if (targetStylesheet) {
    const rules = targetStylesheet.sheet.cssRules || targetStylesheet.sheet.rules;
    for (const rule of rules) {
      const styleObject = {};
      let match;
      while ((match = regex.exec(rule.cssText)) !== null) {
        const key = "--" + match[1];
        const value = htmlStyles.getPropertyValue("--" + match[2]);
        styleObject[key] = value;
      }
      colorThemes.push(styleObject);
    }

    const durationSetting = attr(0.4, targetStylesheet.getAttribute("speed")),
      easeSetting = attr("power1.out", targetStylesheet.getAttribute("ease")),
      offsetSetting = attr(50, targetStylesheet.getAttribute("percent-from-top")),
      breakpointSetting = attr(0, targetStylesheet.getAttribute("min-width"));
    gsap.registerPlugin(ScrollTrigger);

    const triggerElements = document.querySelectorAll("[animate-body-to]");
    triggerElements.forEach((element, index) => {
      const modeIndex = +element.getAttribute("animate-body-to");
      let endSetting = `clamp(bottom ${offsetSetting}%)`;
      if (index === triggerElements.length - 1) endSetting = `bottom ${offsetSetting}%`;
      gsap.matchMedia().add(`(min-width: ${breakpointSetting}px)`, () => {
        const colorScroll = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: `clamp(top ${offsetSetting}%)`,
            end: endSetting,
            toggleActions: "play complete none reverse"
          }
        });
        colorScroll.to("body", {
          ...colorThemes[modeIndex - 1],
          duration: durationSetting,
          ease: easeSetting
        });
      });
    });
  }
}

// --- PARALLAX
function parallax() {
  $("[parallax]").each(function () {
    let element = $(this);
    let parallaxY = parseFloat(element.attr("data-parallax-y")) || 0;
    let screenWidth = $(window).width();

    if (element.attr("parallax") !== "mobile-false" || screenWidth > 991) {
      let tl = gsap.timeline({
        defaults: { ease: "none" }
      });

      tl.to(element, {
        yPercent: parallaxY,
        scrollTrigger: {
          trigger: element,
          start: "clamp(top bottom)",
          end: "clamp(bottom center)",
          scrub: 1,
        }
      });
    }
  });
}

// --- HEADLINE TEXT ANIMATION
function headlineTextAnimation() {
  $(".t-display-1.is-animated, .t-display-2.is-animated").each(function () {

    let headlineText = $(this).find("[headline-text]");

    let headlineText1 = $(this).find("[headline-line-1]");
    let headlineText2 = $(this).find("[headline-line-2]");
    let headlineText3 = $(this).find("[headline-line-3]");

    let headlineText1Value = parseFloat(headlineText1.attr("headline-line-1"));
    let headlineText2Value = parseFloat(headlineText2.attr("headline-line-2"));
    let headlineText3Value = parseFloat(headlineText3.attr("headline-line-3"));

    gsap.set(headlineText1, { xPercent: headlineText1Value });
    gsap.set(headlineText2, { xPercent: headlineText2Value });
    gsap.set(headlineText3, { xPercent: headlineText3Value });

    let tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
        duration: 1.4,
        stagger: 0.2
      },
      scrollTrigger: {
        trigger: $(this),
        start: "top bottom",
        once: true,
      }
    });

    tl.to(headlineText, { xPercent: 0 });

  });
}

// --- TEAM GROUPS
function addTeamsToGroups() {
  $(".c-team-item").each(function (index) {
    let cmsItem = $(this);
    let itemCategory = cmsItem.find(".c-team-group-txt").text();
    $(".c-group").each(function (index) {
      let groupCategory = $(this).find("[group-title]").text();
      if (groupCategory === itemCategory) {
        cmsItem.appendTo($(this).find("[team-list]"));
      }
    });
  });
}

// --- TEAM CARDS ANIMATION
function teamCardsAnimation() {
  if ($(".c-team-item").length > 0) {
    $(".c-team-item").each(function () {
      let bioTrigger = $(this).find(".c-team-info_bt-trigger");
      let bioTriggerIcon = $(this).find(".c-icon.team-bio");
      let bioBG = $(this).find(".c-team-hover-bg");
      let bioTitle = $(this).find(".c-team-bio-title");
      let teamInfoClone = $(this).find(".c-team-info-inner-clone");
      let teamInfoWrap = $(this).find(".c-team-info-inner-wrap");
      let bioRichText = $(this).find(".t-rich-text.bio");

      let noPhotoWrap = $(this).find(".c-team-info_bt-wrap");
      let noPhotoElement = $(this).find(".c-team-info_bt.photo-not-set");

      let noPhotoItem = $(this).has(".c-img-contain.team.w-condition-invisible");

      let tl = gsap.timeline({
        paused: true,
        defaults: {
          duration: 0.4,
          ease: "power3.inOut",
        },
        onReverseComplete: () => {
          gsap.set(bioTrigger, { clearProps: "opacity" });
        },
      });

      tl.set(".c-team-name-clone", { autoAlpha: 1 });

      tl.to(bioBG, { height: "100%", duration: 0.6 });
      tl.to(bioTriggerIcon, { rotation: 45 }, 0);
      tl.to(bioTrigger, { opacity: 1 }, 0);
      tl.to(bioRichText, { autoAlpha: 1 }, "<0.3");

      $(this)
        .closest(".c-team-item")
        .on("click", function () {
          $(this).toggleClass("is-open");
          if ($(this).hasClass("is-open")) {

            if (noPhotoItem.length === 0) {
              let state = Flip.getState(teamInfoClone);
              teamInfoClone.appendTo(bioTitle);

              Flip.from(state, {
                duration: 0.6,
                ease: "power3.inOut",
                absolute: true,
              });
            } else if (noPhotoItem.length === 1) {
              bioRichText.css("display", "block");
              $(this).find("[bio-title]").css("display", "none");
              $(this).find("[bio-company]").css("display", "none");
              let state = Flip.getState(noPhotoElement);
              noPhotoElement.appendTo(bioTitle);
              Flip.from(state, {
                duration: 0.6,
                ease: "power3.inOut",
              });
            }

            tl.restart();
          } else {
            tl.reverse();

            if (noPhotoItem.length === 0) {

              let state = Flip.getState(teamInfoClone, noPhotoElement);
              teamInfoClone.appendTo(teamInfoWrap);
              Flip.from(state, {
                duration: 0.4,
                ease: "power2.out",
                absolute: true,
                delay: 0.3,
              });

            } else if (noPhotoItem.length === 1) {
              bioRichText.css("display", "none");
              let state = Flip.getState(noPhotoElement);
              noPhotoElement.appendTo(noPhotoWrap);
              Flip.from(state, {
                duration: 0.6,
                ease: "power3.inOut",
              });
            }
          }
        });
    });
  }
}

// --- HEADER MOBILE
// header.children().clone(true).appendTo(menu);
function headerMobile() {
  let menu = $(".c-menu-mobile");
  let header = $(".c-section.footer");
  let menuOpenBtn = $(".c-nav-btn");
  let menuCloseBtn = $(".c-icon.menu-close");

  let tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: 1,
      ease: "power3.inOut"
    }
  })

  tl.fromTo(menu, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" });

  menuOpenBtn.on("click", function () {
    if (!tl.isActive()) {
      lenis.stop();
      enableHeaderScroll = false;
      tl.restart();
    }
  });

  menuCloseBtn.on("click", function () {
    lenis.start();
    enableHeaderScroll = true;
    tl.reverse();
  });
}

// --- HOME LOADER 
function homeLoader() {
  let tl = gsap.timeline({ defaults: { duration: 2.2, ease: "expo.out" } });

  setTimeout(function () {
    imagesArtistInfo();
  }, 400);

  gsap.set(".c-img-contain.hero-1", { autoAlpha: 1, xPercent: -101 });
  gsap.set(".c-img-contain.hero-2", { autoAlpha: 1, xPercent: 101 });
  // gsap.set(".c-img-contain.hero-1 .c-img", { clipPath: "inset(50% 50% 50% 50%)" });
  // gsap.set(".c-img-contain.hero-2 .c-img", { clipPath: "inset(50% 50% 50% 50%)" });
  // gsap.set(".c-img-contain.hero-logo", { autoAlpha: 0, scale: 0, rotation: 15 });

  tl.to(".c-img-contain.hero-1", { xPercent: 0 });
  // tl.fromTo(
  //   ".c-img-contain.hero-1", { clipPath: "inset(0% 100% 0% 0%" }, {
  //     clipPath: "inset(0% 0% 0% 0%",
  //     duration: 1
  //   },
  //   "<");

  tl.to(".c-img-contain.hero-2", { xPercent: 0 }, "<0.3");
  // tl.fromTo(
  //   ".c-img-contain.hero-2", { clipPath: "inset(0% 0% 0% 100%" }, {
  //     clipPath: "inset(0% 0% 0% 0%",
  //     duration: 1
  //   },
  //   "<");
  tl.to(".c-img-contain.hero-logo", { autoAlpha: 1, duration: 1.4 }, "<0.6");

  // tl.fromTo(
  //   ".c-img-contain.hero-1 .c-img", {
  //     clipPath: "inset(50% 50% 50% 50%)",
  //     scale: 1.4
  //   }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
  // );
  // tl.fromTo(
  //   ".c-img-contain.hero-2 .c-img", {
  //     clipPath: "inset(50% 50% 50% 50%)",
  //     scale: 1.4
  //   }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
  //   "<0.3");
  // tl.to(".c-img-contain.hero-logo", { autoAlpha: 1, scale: 1, rotation: 0, duration: 1.2 }, "<0.2");

}

// --- SUB PAGE LOADER
function subPageLoader() {
  let tl = gsap.timeline({
    defaults: {
      duration: 1.8,
      ease: "power4.out"
    }
  });

  let headlineText1 = $("[headline-sub-line-1]");
  let headlineText2 = $("[headline-sub-line-2]");

  let headlineText1Value = parseFloat(headlineText1.attr("headline-sub-line-1"));
  let headlineText2Value = parseFloat(headlineText2.attr("headline-sub-line-2"));

  gsap.set(".c-img-contain.sub-hero", { autoAlpha: 1 })
  gsap.set(".c-img-contain.sub-hero .c-img", { clipPath: "inset(50% 50% 50% 50%)" });

  gsap.set(".c-subhero_rt .c-headline-line-1", { autoAlpha: 1 });
  gsap.set(".c-subhero_rt .c-headline-line-2", { autoAlpha: 1 });

  gsap.set(headlineText1, { xPercent: headlineText1Value });
  gsap.set(headlineText2, { xPercent: headlineText2Value });

  setTimeout(function () {
    imagesArtistInfo();
  }, 400);

  tl.fromTo(
    ".c-img-contain.sub-hero .c-img", {
      clipPath: "inset(50% 50% 50% 50%)",
      scale: 1.4
    }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
  )

  tl.to(headlineText1, { xPercent: 0 }, "<0.2");
  tl.to(headlineText2, { xPercent: 0 }, "<0");
  tl.to(".c-subhero_rt .t-micro-1", { autoAlpha: 1 }, "<0.2");
  tl.to(".c-subhero_rt .t-body-1", { autoAlpha: 1 }, "<0.2");
}

// --- PAGES
let homePage = document.querySelector("[home-page]");
let subPage = document.querySelector("[sub-page]");

// --- HIDE LOGO HOMEPAGE
function hideLogoHome() {
  ScrollTrigger.create({
    trigger: ".c-section.hm-hero",
    start: "65% top",
    end: "+=1",
    onEnter: () => {
      $(".c-logo-link").addClass("logo-hm");
    },
    onLeaveBack: () => {
      $(".c-logo-link").removeClass("logo-hm");
    },
  });
}

// --- INIT
function init() {
  themeSwitch();
  headlineTextAnimation();
  addTeamsToGroups();
  runSplit();
  teamCardsAnimation();
  parallax();
  headerStatus();
  fade();
  // imagesArtistInfo();
  if (homePage) {
    hideLogoHome();
    homeLoader();
  }
  if (subPage) {
    subPageLoader()
  }
}
init();

// --- MATCHMEDIA - DESKTOP
mm.add("(min-width: 992px)", () => {
  //
  return () => {
    //
  };
});

// --- MATCHMEDIA - TABLET AND MOBILE
mm.add("(max-width: 991px)", () => {
  headerMobile();
  return () => {
    lenis.start();
  };
});
