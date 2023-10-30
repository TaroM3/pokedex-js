const pokeApi = `https://pokeapi.co/api/v2/pokemon`;

const nextButton = $("#next");

const previousButton = $("#previous");

const MAX_ID = 10275;

let index = 0;

previousButton.style.visibility = "hidden";

document.addEventListener("keydown", preventKeyBoardScroll, false);

function preventKeyBoardScroll(e) {
  var keys = [32, 33, 34, 35, 37, 38, 39, 40];
  if (keys.includes(e.keyCode)) {
    e.preventDefault();
    return false;
  }
}

function sweet() {
  backDex.style.opacity = 0;
  Swal.fire({
    title: "Pokemon",
    text: "Write the index or name of the pokemon",
    input: "text",
    target: document.querySelector("body"),
    padding: "-19px",
    inputValidator: (value) => {
      return !value.trim() && "Please, write the pokemon name or number";
    },
    confirmButtonColor: "black",
    confirmButtonText: "ENTER",
    customClass: {
      container: "swal2-container",
      title: "title",
      htmlContainer: "htmlContainer",
    },
    allowOutsideClick: false,
    width: "30rem",
    background: "yellowgreen",
  }).then(async (res) => {
    if (!isNaN(Number(res.value))) {
      if (Number(res.value) <= MAX_ID) {
        const pokemon = await getPokemon(res.value);
        index = pokemon.id;
        pokeCard(pokemon);
      } else {
        index = 1;
        const pokemon = await getPokemon(index);
        pokeCard(pokemon);
      }
    } else {
      const pokemon = await getPokemon(res.value.toLowerCase());
      pokeCard(pokemon);
    }
  });
}

const language = window.navigator.language;

setLS("language", language);

const backDex = $(".back");

const display = $(".content p");

const pokeScreen = $(".pokeScreen img");

pokeScreen.style.display = "none";

const intro = [
  "Welcome, use the arrows to navigate in your Pokedex. If you're looking for a specific Pokemon, tap the blue lens of the Pokedex",
  "Termine. ",
];

let i = 0;

const resetDisplay = () => {
  display.innerHTML = "";
};

const typingEffect = (infoTemplate, content, time = 50) => {
  let counter = 0;
  const typing = setInterval(
    () => {
      if (content < infoTemplate.length) {
        display.innerHTML += infoTemplate[content][counter++];
        if (counter >= infoTemplate[content].length) {
          display.innerHTML += "<br>";
          content++;
          counter = 0;
        }
      } else {
        if (index > 1) {
          previousButton.style.visibility = "visible";
          addClass(previousButton, "blink");
        } else {
          previousButton.style.visibility = "hidden";
        }
        if (index < MAX_ID) {
          nextButton.style.visibility = "visible";
          addClass(nextButton, "blink");
        } else {
          nextButton.style.visibility = "hidden";
        }

        document.addEventListener("keyup", arrowsController);
        nextButton.addEventListener("click", nextButtonController);
        previousButton.addEventListener("click", previousButtonController);
        $(".blue").addEventListener("click", sweet);
        clearInterval(typing);
      }
    },
    time,
    infoTemplate
  );
};

async function previousButtonController() {
  removeClass(previousButton, "blink");
  removeClass(nextButton, "blink");
  document.removeEventListener("keyup", arrowsController);
  nextButton.removeEventListener("click", nextButtonController);
  previousButton.removeEventListener("click", previousButtonController);
  $(".blue").removeEventListener("click", sweet);
  if (index > 1) {
    pokeScreen.style.display = "none";
    backDex.style.opacity = 0;
    i = 0;
    --index;
    const pokemon = await getPokemon(index);
    pokeCard(pokemon);
  }
}

async function nextButtonController() {
  removeClass(previousButton, "blink");
  removeClass(nextButton, "blink");
  document.removeEventListener("keyup", arrowsController);
  nextButton.removeEventListener("click", nextButtonController);
  previousButton.removeEventListener("click", previousButtonController);
  $(".blue").removeEventListener("click", sweet);

  pokeScreen.style.display = "none";
  backDex.style.opacity = 0;
  backDex.style.visibility = "hidden";
  if (index <= MAX_ID) {
    i = 0;
    index++;
    const pokemon = await getPokemon(index);
    pokeCard(pokemon);
  }
}
async function arrowsController(event) {
  if (event.key === "ArrowDown") {
    removeClass(previousButton, "blink");
    removeClass(nextButton, "blink");
    document.removeEventListener("keyup", arrowsController);
    $(".blue").removeEventListener("click", sweet);

    pokeScreen.style.display = "none";
    backDex.style.opacity = 0;
    backDex.style.visibility = "hidden";
    if (index <= MAX_ID) {
      i = 0;
      index++;
      const pokemon = await getPokemon(index);
      pokeCard(pokemon);
    }
  }

  if (index > 1 && event.key === "ArrowUp") {
    removeClass(previousButton, "blink");
    removeClass(nextButton, "blink");
    document.removeEventListener("keyup", arrowsController);
    nextButton.removeEventListener("click", nextButtonController);
    previousButton.removeEventListener("click", previousButtonController);
    $(".blue").removeEventListener("click", sweet);
    if (index > 1) {
      pokeScreen.style.display = "none";
      backDex.style.opacity = 0;
      i = 0;
      --index;
      const pokemon = await getPokemon(index);
      pokeCard(pokemon);
    }
  }
}

const ID_FIXER = {
  1: (number) => {
    return `#0000${number}`;
  },
  2: (number) => {
    return `#000${number}`;
  },
  3: (number) => {
    return `#00${number}`;
  },
  4: (number) => {
    return `#0${number}`;
  },
  5: (number) => {
    return `#${number}`;
  },
};
const idFixer = (number) => {
  if (!isNaN(number)) {
    const length = String(number).length;
    index = number;
    return ID_FIXER[length](number);
  } else {
    index = 0;
    return `#?????`;
  }
};

const pokeCard = async (pokemon) => {
  pokeScreen.style.opacity = 0;
  resetDisplay();
  const image =
    pokemon.sprites.other.dream_world.front_default !== null
      ? pokemon.sprites.other.dream_world.front_default
      : `https://res.cloudinary.com/didni0nof/image/upload/v1698132347/Pngtree_question_mark_vector_icon_3722522_pe6rvj.png`;
  pokeScreen.setAttribute("src", `${image}`);

  const weight = isNaN(pokemon.weight)
    ? pokemon.weight
    : Number(pokemon.weight / 10).toFixed(1);
  const height = isNaN(pokemon.height)
    ? pokemon.height
    : Number(pokemon.height / 10).toFixed(1);
  const id = idFixer(pokemon.id);
  const infoTemplate = [
    `${id}`,
    `name: ${pokemon.name} `,
    `type: ${pokemon.types[0].type.name}`,
    `weight: ${weight} kg`,
    `height: ${height} m`,
  ];

  pokeScreen.style.display = "block";

  typingEffect(infoTemplate, 0, 50);

  setTimeout(() => {
    pokeScreen.style.opacity = 1;
  }, 1000);
};

const typeEffect = () => {
  if (i < intro[0].length) {
    display.innerHTML += intro[0][i++];
    setTimeout(typeEffect, 80);
  } else {
    display.innerHTML += "<span class='blink'>▮</span>";
    addClass(nextButton, "blink");

    document.addEventListener("keyup", arrowsController);
    nextButton.addEventListener("click", nextButtonController);
    $(".blue").addEventListener("click", sweet);
  }
};

backDex.addEventListener("click", function intro() {
  backDex.style.transform = "translateY(40.5rem)";
  backDex.removeEventListener("click", intro);
  setTimeout(() => {
    typeEffect(intro);
  }, 1000);
});

const getPokemon = async (index) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`);
    const pokemon = await response.json();
    return pokemon;
  } catch (error) {
    return {
      id: index,
      name: "unknown ",
      types: [{ type: { name: "unknown " } }],
      weight: "unknown ",
      height: "unknown ",
      sprites: {
        other: { dream_world: { front_default: null } },
      },
      error: "error",
    };
  }
};
