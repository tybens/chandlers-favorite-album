import { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../layouts';
import Header from '../components/header';
import SearchBar from '../components/searchbar';
import SwagPreview from '../components/swag-preview';
import ThreeDots from '../components/three-dots';
import Footer from '../components/footer';
import Link from 'next/link';
import axios from 'axios';
import ShopModal from '../components/shop-modal';

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
  const [showModal, setShowModal] = useState(false);
  const [shopClicked, setShopClicked] = useState(false);
  const [token, setToken] = useState('');

  const isComplete = !(album === DEFAULT_IMAGE);

  // useEffect is a react thing that only be triggered client side!
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

  const handleShop = () => {
    // don't save another shirt if they close out of the shop and want to go back in
    if (!shopClicked) {
      setShopClicked(true);
      axios.get(`/api/image?album_url=${album}`).then((response) => {
        console.log(response);
        setToken(response.data);
      });
    }
    setShowModal(true);
  };

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
      <div
        className="py-12 px-2 md:px-4 lg:px-6 max-w-screen-xl flex flex-col items-center mx-auto"
        style={{
          overflow: showModal ? 'hidden visible !important' : '',
        }}>
        <Header />
        {showModal && (
          <ShopModal
            style={{
              transition: 'opacity 0.25s ease',
              opacity: showModal ? '' : '0',
            }}
            showModal={showModal}
            token={token}
            onClose={() => {
              setShowModal(false);
            }}></ShopModal>
        )}
        <div className="grid gap-4 mt-8">
          <SearchBar
            ref={inputRef}
            onSelect={(album) => {
              const newAlbum = album;
              // set the `album` variable to the url
              setAlbum(newAlbum.url);
              // allow user to "generate swag" again
              setGenerated(false);
              // allow user to generate a new swag image
              setShopClicked(false);
              // reset selected index to none
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
            style={{}}
            selectedIndex={selectedIndex}
          />
          {isComplete && !generated && (
            <button
              ref={buttonRef}
              className="text-white bg-blue-900 p-3 text-lg font-bold"
              onClick={generateSwag}>
              {loading ? <ThreeDots /> : 'Generate Swag'}
            </button>
          )}
          {generated && (
            <button
              ref={buttonRef}
              onClick={handleShop}
              className="text-white bg-blue-900 p-3 text-lg font-bold">
              {loading ? <ThreeDots /> : 'S H O P'}
            </button>
          )}
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Page;
