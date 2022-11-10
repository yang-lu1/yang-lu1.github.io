let slidePosition = 0;
const slides = document.querySelectorAll(".carousel__item");
const totalSlides = slides.length;
let next_button = document.querySelector("#carousel__button--next");
let prev_button = document.querySelector("#carousel__button--prev");
next_button.classList.add("no_border");
prev_button.classList.add("no_border");
next_button.addEventListener("click", function () {
  moveToNextSlide();
  prev_button.classList.remove("highlight", "border");
  prev_button.classList.add("no_border");
  next_button.classList.add("highlight", "border");
  next_button.classList.remove("no_border");
});

prev_button.addEventListener("click", function () {
  moveToPrevSlide();
  next_button.classList.remove("highlight", "border");
  next_button.classList.add("no_border");
  prev_button.classList.add("highlight", "border");
  prev_button.classList.remove("no_border");
});

function updateSlidePosition() {
  for (let slide of slides) {
    slide.classList.remove("carousel__item--visible");
    slide.classList.add("carousel__item--hidden");
  }

  slides[slidePosition].classList.add("carousel__item--visible");
}

function moveToNextSlide() {
  if (slidePosition === totalSlides - 1) {
    slidePosition = 0;
  } else {
    slidePosition++;
  }

  updateSlidePosition();
}

function moveToPrevSlide() {
  if (slidePosition === 0) {
    slidePosition = totalSlides - 1;
  } else {
    slidePosition--;
  }

  updateSlidePosition();
}
