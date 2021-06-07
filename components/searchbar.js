import { useState, useEffect, useRef, forwardRef } from 'react';
import useDebounce from '../utils/debounce';
import useAxios from '../utils/axios';

const SearchResult = ({ result: { artist, album, url }, selected, ...rest }) => {
  return (
    <div
      className={
        'flex items-center cursor-pointer p-2 border-b border-gray-300 overflow-hidden hover:bg-gray-200' +
        (selected ? ' bg-gray-100' : '')
      }
      {...rest}>
      <img className="w-16 mr-4" src={url} />
      <span className="leading-snug">
        <h3 className="font-semibold">{album}</h3>
        <p className="text-gray-700">{artist}</p>
      </span>
    </div>
  );
};

export default forwardRef(({ onSelect, ...rest }, ref) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 700);

  const { data, error, loading: searchInFlight } = useAxios(
    debouncedSearchTerm === ''
      ? null
      : {
          method: 'get',
          url: `/api/search/album?q=${debouncedSearchTerm.toLowerCase()}`
        }
  );

  const isLoading = debouncedSearchTerm !== searchTerm || searchInFlight;

  let results;

  if (data) {
    results = data?.slice(0, 5).map(x => x);
  }

  if (!results) {
    results = [];
  }

  function setModal(open) {
    setSelectedIndex(0);
    if (open) {
      setOpen(open);
      document.body.classList.add('modal-open');
    } else {
      setOpen(open);
      document.body.classList.remove('modal-open');
    }
  }

  return (
    <>
      <form
        className={
          'z-40 bg-white md:relative ' +
          (open ? 'fixed top-0 left-0 w-screen sm:w-full sm:static' : 'relative')
        }
        onKeyDown={e => {
          if (e.key === 'ArrowDown') {
            setSelectedIndex((selectedIndex + 1) % results.length);
          }
          if (e.key === 'n' && e.ctrlKey) {
            setSelectedIndex((selectedIndex + 1) % results.length);
            e.preventDefault();
          }
          if (e.key === 'ArrowUp') {
            setSelectedIndex((selectedIndex - 1 + results.length) % results.length);
          }
          if (e.key === 'p' && e.ctrlKey) {
            setSelectedIndex((selectedIndex - 1 + results.length) % results.length);
            e.preventDefault();
          }
          if (e.key === 'Escape') {
            ref.current.blur();
          }
          if (e.key === 'Tab') {
            e.preventDefault();
            if (e.shiftKey) {
              setSelectedIndex((selectedIndex - 1 + results.length) % results.length);
            } else {
              setSelectedIndex((selectedIndex + 1) % results.length);
            }
          }
        }}
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          if (!isLoading && selectedIndex !== -1) {
            setSelectedIndex(-1);
            onSelect(results[selectedIndex]);
            setModal(false);
            ref.current.blur();
          }
        }}>
        <input
          tabIndex={0}
          ref={ref}
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onFocus={e => setModal(true)}
          className={
            'appearance-none focus:outline-none sm:block text-sm border border-gray-400 w-full py-2 px-4 ' +
            (open ? 'pl-10 sm:pl-2' : '')
          }
          {...rest}
        />
        {results && (
          <div
            className={
              ' ' +
              (open
                ? ' block absolute w-screen h-screen sm:w-max sm:h-auto border border-gray-300 bg-white box-border'
                : ' hidden') +
              (results.length > 0 ? ' ' : ' block sm:hidden')
            }
            onTouchStart={e => ref.current.blur()}>
            {results.map((x, idx) => (
              <SearchResult
                key={idx}
                result={x}
                onMouseOver={e => setSelectedIndex(idx)}
                onClick={e => {
                    // set current selected modal index to none
                  setSelectedIndex(-1);
                  // tell index.js that we selected x (the album)
                  onSelect(x);
                  // hide the modal
                  setModal(false);
                  // blur
                  ref.current.blur();
                }}
                selected={idx === selectedIndex}
              />
            ))}
          </div>
        )}
        {isLoading && <img className="absolute w-6 top-0 right-0 m-2" src="/images/loading.gif" />}
        <img
          className={
            'absolute left-0 top-0 w-6 m-2 select-none cursor-pointer md:hidden ' +
            (open ? '' : 'hidden')
          }
          draggable="false"
          src="/images/backarrow.svg"
          onClick={() => setModal(false)}
        />
      </form>
    </>
  );
});
