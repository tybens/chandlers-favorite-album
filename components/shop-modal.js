import React, { forwardRef, useState } from 'react';
import Shop from './shop';

const Modal = ({ token, onClose }) => {
  // allow closing of the modal
  //   document.onkeydown = function (evt) {
  //     evt = evt || window.event;
  //     var isEscape = false;
  //     if ('key' in evt) {
  //       isEscape = evt.key === 'Escape' || evt.key === 'Esc';
  //     } else {
  //       isEscape = evt.keyCode === 27;
  //     }
  //     if (isEscape && showModal) {
  //       handleClose();
  //     }
  //   };

  function handleClose() {
    onClose();
  }

  return (
    <div
      className="modal z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center md:p-0 p-5
    ">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

      <div className="modal-container bg-white w-11/12 mx-auto rounded shadow-lg z-50 md:overflow-y-auto overflow-y-scroll md:h-auto h-full">
        <div className="modal-content py-4 text-left px-6">
          <div className="flex justify-between items-center pb-3">
            <p className="text-2xl font-bold">Chandler Shop</p>
            <div className="modal-close cursor-pointer z-50" onClick={handleClose}>
              <svg
                className="fill-current text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18">
                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
              </svg>
            </div>
          </div>
          <Shop token={token} />
          {/* {[...Array(20).keys()].map((x) => (
            <br></br>
          ))} */}
          <div className="flex justify-end h-10"></div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
