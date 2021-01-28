import Dynamic from 'next/dynamic';
import { useState } from 'react';

const PRODUCTS = [
  { size: 'S', length: '28', width: '18', id: 2417958883 },
  { size: 'M', length: '29', width: '20', id: 2417958884 },
  { size: 'L', length: '30', width: '22', id: 2417958885 },
  { size: 'XL', length: '31', width: '24', id: 2417958886 },
];

const Shop = ({ token, checkout }) => {
  const [selectedSize, setSelectedSize] = useState('S');
  const [isModalShowing, showModal] = useState(false);
  const selectedProduct = PRODUCTS.find((x) => x.size === selectedSize);

  const handleBuyNow = () => {
    console.log('selected size', selectedSize)
    checkout(selectedProduct)
  };
  
  return (
    <>
      <div className="md:mt-12 px-4 md:px-6 lg:px-8 max-w-screen-lg items-center mx-auto overflow:scroll">
        <div className="md:flex mt-3 font-light tracking-wider">
          <div className="md:mr-6 md:w-1/2">
            <div className="md:hidden mb-4">
              <div className="flex justify-between leading-snug">
                <p className="text-gray-800 tracking-wide">Unisex</p>
                <p className="text-gray-800 font-medium tracking-wide">$15</p>
              </div>
              <h2 className="text-xl font-medium leading-snug inline tracking-normal">A t-shirt</h2>
            </div>
            <div className="col-span-3 bg-white-100">
              <img
                className="mx-auto"
                style={{ maxHeight: token ? '40vh' : '10vh' }}
                src={token ? `api/shirt?token=${token}` : '/images/loading.gif'}></img>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="hidden md:block">
              <p className="text-gray-800 tracking-wide leading-snug">Unisex</p>
              <h2 className="text-xl font-medium leading-snug">The Shirt</h2>
            </div>
            <p className="mt-5">Color: White</p>
            <div className="md:inline-block mt-3">
              <div className="flex justify-between">
                <p className="">Size: {selectedSize}</p>
              </div>
              <div className="grid grid-cols-4 gap-2 md:flex mt-1 md:-ml-3">
                {PRODUCTS.map(({ size }) => (
                  <div
                    key={size}
                    className={
                      'p-2 md:w-10 md:h-10 border flex items-center justify-center box-border md:ml-3 cursor-pointer hover:border-gray-800 active:border-gray-900 ' +
                      (size === selectedSize ? 'border-black' : 'border-gray-400')
                    }
                    onClick={() => setSelectedSize(size)}>
                    {size}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3">$15</p>
            <p className="mt-3">
              Your favorite album and your favorite Chandler. On your favorite white shirt.
            </p>
          </div>
        </div>
        <div className="mt-8">
          <a
          onClick={() => {
            handleBuyNow();
          }}
           className="block text-center w-full text-white bg-blue-900 px-8 py-2 font-medium cursor-pointer">
            Buy now
          </a>
        </div>
      </div>
    </>
  );
};

export default Shop;

