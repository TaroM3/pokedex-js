const pokeApi = `https://pokeapi.co/api/v2/pokemon`;

const nextButton = $("#next");

const previousButton = $("#previous");

const MAX_ID = 10275;

previousButton.style.visibility = "hidden";

function sweet() {
  backDex.style.opacity = 0;
  Swal.fire({
    title: "Pokemon",
    text: "Write the index or name of the pokemon",
    input: "text",
    inputValidator: (value) => {
      return !value.trim() && "Please, write the pokemon name or number";
    },
    allowOutsideClick: false,
    // timer: 2000,
    width: "30rem",
    background: "yellowgreen",
  }).then(async (res) => {
    const pokemon = await getPokemon(res.value);
    index = pokemon.id;
    pokeCard(pokemon);
  });
}

// arrow_down = document.createTextNode("arrow_drop_down");

// previousButton.classList.add("material-symbols-outlined blink");
// addClass(previousButton, "blink");
// addClass(nextButton, "material-symbols-outlined");

let index = 0;

const language = window.navigator.language;

setLS("language", language);

console.log(language);

const backDex = $(".back");

const display = $(".content p");

const pokeScreen = $(".pokeScreen img");

pokeScreen.style.display = "none";

const intro = [
  // "Welcome! Use arrows to navigate Pokedex. For a specific Pokemon, tap the blue lens",
  "Welcome, use the arrows to navigate in your Pokedex. If you're looking for a specific Pokemon, tap the blue lens of the Pokedex",
  "Termine. ",
];

// const

let i = 0;
const arrayText = [...intro];

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
        $(".blue").addEventListener("click", sweet);
        clearInterval(typing);
      }
    },
    time,
    infoTemplate
  );
};

async function arrowsController(event) {
  if (event.key === "ArrowDown") {
    removeClass(previousButton, "blink");
    removeClass(nextButton, "blink");
    document.removeEventListener("keyup", arrowsController);
    $(".blue").removeEventListener("click", sweet);

    pokeScreen.style.display = "none";
    backDex.style.opacity = 0;
    backDex.style.visibility = "hidden";
    i = 0;
    index++;
    const pokemon = await getPokemon(index);
    pokeCard(pokemon);
  }

  if (index > 1 && event.key === "ArrowUp") {
    removeClass(previousButton, "blink");
    removeClass(nextButton, "blink");
    document.removeEventListener("keyup", arrowsController);
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
  const length = String(number).length;
  return ID_FIXER[length](number);
};

const pokeCard = async (pokemon) => {
  pokeScreen.style.opacity = 0;
  resetDisplay();
  const image =
    pokemon.sprites.other.dream_world.front_default !== null
      ? pokemon.sprites.other.dream_world.front_default
      : `https://res.cloudinary.com/didni0nof/image/upload/v1698132347/Pngtree_question_mark_vector_icon_3722522_pe6rvj.png`;
  pokeScreen.setAttribute("src", `${image}`);
  const weight = !Number.isNaN(pokemon.weight)
    ? Number(pokemon.weight / 10).toFixed(1)
    : pokemon.weight;
  const height = !Number.isNaN(pokemon.height)
    ? Number(pokemon.height / 10).toFixed(1)
    : pokemon.height;
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
    // $("#next").appendChild(nextButton);
    addClass(nextButton, "blink");
    // addClass(previousButton, "blink");
    document.addEventListener("keyup", arrowsController);
    $(".blue").addEventListener("click", sweet);
  }
};
// addClass(previousButton, "blink");
backDex.addEventListener("click", function intro() {
  backDex.style.transform = "translateY(40.5rem)";
  // backDex.style.transform = "translateX(30rem)";
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
    };
  }
};
