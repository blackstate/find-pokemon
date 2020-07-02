const timer = (() => {
  let startTIme;

  const start = () => {
    startTime = new Date();
  };

  const get = () => {
    let time = new Date() - startTime;
    time = Array.from(String(time), String);
    time.splice(1, 0, '.');
    time = time.join('');
    return time;
  };

  return {
    start,
    get,
  };
})();

const app = (() => {
  const check = (pokemon, x, y, cx, cy) => {
    const db = firebase.firestore();
    db.collection('pokemon-box')
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          let coords = doc.data();
          if (
            coords.ix <= x &&
            x <= coords.ax &&
            coords.iy <= y &&
            y <= coords.ay
          ) {
            if (doc.id === pokemon) {
              display.showPokemon(pokemon, cx, cy);
              display.removePokemon(pokemon);
            }
          }
        });
      });
  };

  const win = (pokemons) => {
    if (pokemons.length === 0) {
      let time = timer.get();
      let name = prompt(
        'Congratulations! You took ' + time + ' seconds to complete!'
      );
      // alert(name + ' is a winner');
    }
  };
  return {
    check,
    win,
  };
})();

const display = (() => {
  let canvasImage = document.querySelector('.find-pokemon-img');
  let canvas = document.querySelector('.pokemon-canvas');
  let pokemons = ['Kabutops', 'Poliwag', 'Krabby'];

  // hide selection when click outside
  const initClickOutside = (selection) => {
    canvasImage.addEventListener('click', () => {
      selection.remove();
    });
  };

  const showSelection = (e) => {
    // create a div for the whole selection
    let selection = document.createElement('div');
    selection.classList.add('div');

    // handle position of selection
    let cx = e.clientX - 40;
    let cy = e.clientY - 40;
    selection.style.left = cx + 'px';
    selection.style.top = cy + 'px';

    // selection box
    let target = document.createElement('div');
    target.classList.add('select-box');

    // pokemon selection
    let selectPokemon = document.createElement('select');
    selectPokemon.classList.add('pokemon-select');

    // first option in pokemon selection
    let firstOption = document.createElement('option');
    firstOption.value = '';
    firstOption.setAttribute('disabled', true);
    firstOption.setAttribute('selected', true);
    firstOption.innerText = 'Select';
    selectPokemon.appendChild(firstOption);

    // pokemon options
    pokemons.forEach((pokemon) => {
      let option = document.createElement('option');
      option.value = pokemon;
      option.innerText = pokemon;
      selectPokemon.appendChild(option);
    });

    // prevent hiding the selection as soon as image is clicked
    e.stopPropagation();

    // pokemon option selection
    selectPokemon.addEventListener('change', () => {
      selection.remove();
      let x = e.offsetX;
      let y = e.offsetY;
      app.check(selectPokemon.value, x, y, cx, cy);
    });

    // when no option is clicked, remove selection after click outside
    initClickOutside(selection);

    // appending elements
    selection.appendChild(target);
    selection.appendChild(selectPokemon);
    canvas.appendChild(selection);
  };

  const showPokemon = (pokemon, x, y) => {
    let selectionFound = document.createElement('div');
    selectionFound.classList.add('select-found');
    selectionFound.style.left = x + 'px';
    selectionFound.style.top = y + 'px';

    canvas.appendChild(selectionFound);
  };

  const removePokemon = (pokemon) => {
    pokemons = pokemons.filter((pkm) => pkm !== pokemon);
    app.win(pokemons);
  };

  const initSelect = () => {
    canvasImage.addEventListener('click', showSelection);
  };

  return {
    initSelect,
    showPokemon,
    removePokemon,
  };
})();

timer.start();

display.initSelect();
