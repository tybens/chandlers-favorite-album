import { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../layouts';
import Header from '../components/header';
import SearchBar from '../components/searchbar';
import SwagPreview from '../components/swag-preview';
import ThreeDots from '../components/three-dots';
import Footer from '../components/footer';

// pre-encoded image (transparent pixel)
const DEFAULT_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const Page = () => {
  const inputRef = useRef();
  const buttonRef = useRef();
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [album, setAlbum] = useState(DEFAULT_IMAGE);
  const [generated, setGenerated] = useState(false);

  const isComplete = !(album === DEFAULT_IMAGE);

  // useEffect is a react thing that activates after DOM loads
  useEffect(() => {
    // scroll screen down to generate button after album is selected
    if (isComplete) {
      window.scrollTo({
        top: buttonRef.current.offsetTop,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [isComplete]);

  function generateSwag() {
    setLoading(true);
    setTimeout(() => {
      setGenerated(true);
      setLoading(false);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }, 50);

    // serverless api call to generate Swag
  }

  return (
    <Layout>
      <Head>
        <title>Chandlers Favorite Album</title>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@tyloben" />
        <meta property="og:title" content="Chandlers Favorite Album" />
        <meta property="og:description" content="Turns out Chandler also loves ur favorite album" />
        <meta property="og:image" content="/images/meme.jpeg" />
      </Head>
      <div className="py-12 px-2 md:px-4 lg:px-6 max-w-screen-xl flex flex-col items-center mx-auto">
        <Header />
        <div className="grid gap-4 mt-8">
          <SearchBar
            ref={inputRef}
            onSelect={(album) => {
              const newAlbum = album;
              // set the `album` variable to the url
              setAlbum(newAlbum.url);
              // reset selected index to none
              console.log(album.url, newAlbum);
              setSelectedIndex(-1);
            }}
            placeholder="Search for Album..."
          />

          <SwagPreview
            album={album}
            generated={generated}
            onClick={(idx) => {
              setSelectedIndex(idx);
            }}
            selectedIndex={selectedIndex}
          />
          {isComplete && !(generated) && (
            <button
              ref={buttonRef}
              className="text-white bg-blue-900 p-3 text-lg font-bold"
              onClick={generateSwag}>
              {loading ? <ThreeDots /> : 'Generate Swag'}
            </button>
          )}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Page;
