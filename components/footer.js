export default () => {
    return (
      <footer className="mt-16">
        <div className="max-w-screen-lg mx-auto px-4 md:px-6 lg:px-8 py-8 text-center">
          <div className="flex items-center justify-center text-gray-800">
            <a className="mx-2" href="mailto:tyler.benson+cfa@gmail.com" target="_blank">
              Contact
            </a>
            <a className="mx-2" href="https://twitter.com/tybens" target="_blank">
              Twitter
            </a>
          </div>
          <a
            className="mt-8 flex justify-center items-baseline text-gray-800 cursor-pointer"
            href="https://vercel.com/"
            target="_blank">
            <svg height="16" viewBox="0 0 116 100" fill="#000" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M57.5 0L115 100H0L57.5 0z" />
            </svg>
            <span className="ml-2">
              Powered by <span className="font-semibold">Vercel</span>
            </span>
          </a>
          <p className="mt-8 text-gray-700 text-sm">
            ® 2020 Chandlers Favorite Album
            <br />
            All rights reserved
          </p>
        </div>
      </footer>
    );
  };
  