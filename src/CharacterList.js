// https://www.freecodecamp.org/news/how-to-use-the-usestate-and-useeffect-hooks-in-your-project/
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CharacterCard from './CharacterCard';

function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const initialRender = useRef(true);


  const fetchCharacters = async (page) => {
    const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`);
    setCharacters((prev) => [...prev, ...response.data.results]);
    if (!response.data.info.next) setHasMore(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      // https://learnersbucket.com/examples/javascript/detect-if-window-is-scrolled-to-the-bottom/
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2 && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    };
  // https://dev.to/samabaasi/mastering-useref-why-it-doesnt-trigger-re-renders-and-how-it-persists-across-re-renders-1l2b
    if (!initialRender.current) {
      fetchCharacters(page);
    } else {
      initialRender.current = false;
    }
    // https://stackoverflow.com/questions/75775786/how-to-properly-add-window-scroll-event-listener-in-react-for-animating-an-eleme
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, page]);

  return (
    <div className="grid m-0 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
      {characters.map((character, i) => (
        <CharacterCard key={i} character={character} />
      ))}
    </div>
  );
}

export default CharacterList;
