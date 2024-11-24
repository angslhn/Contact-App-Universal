const responsiveHeight = () => {
  const main = document.querySelector("main");
  const height = window.innerHeight;

  main.style.height = `${height}px`;
};

window.addEventListener("resize", responsiveHeight);

responsiveHeight();

const nama = document.getElementById("nama");

nama.addEventListener("blur", () => {
  const word = nama.value;

  const capitalize = (word) => {
    return word
      .trim()
      .replace(/\s+/g, ' ')
      .split(" ")
      .map((text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
      .join(" ");
  };

  nama.value = capitalize(word);
});
