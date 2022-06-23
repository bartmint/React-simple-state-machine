import { useState } from 'react';

function StateMachineExample() {
  const states = {
    empty: 'empty',
    isLoading: 'loading',
    hasLoaded: 'loaded',
    hasError: 'error',
  };
  const [currentState, setCurrentState] = useState(states.empty);
  const [imageSrc, setImageSrc] = useState(null);

  const transitions = {
    [states.empty]: {
      FETCH_IMG: states.isLoading,
    },
    [states.isLoading]: {
      FETCH_IMG_SUCCESS: states.hasLoaded,
      FETCH_IMG_ERROR: states.hasError,
    },
    [states.hasLoaded]: {
      FETCH_IMG: states.isLoading,
    },
    [states.hasError]: {
      FETCH_IMG: states.isLoading,
    },
  };

  function transition(currentState, action) {
    const nextState = transitions[currentState][action];
    return nextState || currentState;
  }

  function updateState(action) {
    setCurrentState((currentState) => transition(currentState, action));
  }

  const compareState = (state) => currentState === state;

  const fetchCharacterImage = () => {
    updateState('FETCH_IMG');

    fetch(`https://rickandmortyapi.com/api/character/${getRandomId()}`)
      .then((res) => res.json())
      .then(({ image }) => { setImageSrc(image); updateState('FETCH_IMG_SUCCESS'); })
      .catch(() => { updateState('FETCH_IMG_ERROR '); });
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen pb-12 mx-auto">
      <header className="pb-8 text-3xl leading-8">
        Rick and Morty
      </header>
      {(!compareState(states.hasLoaded)) && (
        <div className="animate-pulse bg-grey-900">
          <div className={`${compareState(states.empty) ? 'bg-gray-500' : ''} ${compareState(states.isLoading) ? 'bg-main' : ''} ${compareState(states.hasError) ? 'bg-red-500' : ''} w-72 h-72`} />
        </div>
      )}
      {compareState(states.hasLoaded) && <img src={imageSrc} alt="Rick and Morty Character" className="w-72 h-72" />}
      <div className="py-2" />
      {compareState(states.empty) && <p className="text-gray-900 ">What you&apos;re waiting for? Fetch the first character!</p>}
      {compareState(states.hasError) && <p className="text-red-500">An error has occurred. Please try again.</p>}
      <div className="py-2" />
      <button onClick={fetchCharacterImage} type="button" className="px-4 py-2 text-white rounded bg-main hover:bg-main-600">Fetch</button>
    </div>
  );
}

function getRandomId(min = 1, max = 108) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default StateMachineExample;

