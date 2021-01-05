const MAX_SCALE = 0.6;
const MIN_SCALE = 0;
export default () => {
  return (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
      <style jsx>
        {`
          .spinner {
            display: inline;
            text-align: center;
          }

          .spinner > div {
            width: 18px;
            height: 18px;
            background-color: white;

            border-radius: 100%;
            display: inline-block;
            -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
            animation: sk-bouncedelay 1.4s infinite ease-in-out both;
          }

          .spinner .bounce1 {
            -webkit-animation-delay: -0.32s;
            animation-delay: -0.32s;
          }

          .spinner .bounce2 {
            -webkit-animation-delay: -0.16s;
            animation-delay: -0.16s;
          }

          @-webkit-keyframes sk-bouncedelay {
            0%,
            80%,
            100% {
              -webkit-transform: scale(${MIN_SCALE});
            }
            40% {
              -webkit-transform: scale(${MAX_SCALE});
            }
          }

          @keyframes sk-bouncedelay {
            0%,
            80%,
            100% {
              -webkit-transform: scale(${MIN_SCALE});
              transform: scale(${MIN_SCALE});
            }
            40% {
              -webkit-transform: scale(${MAX_SCALE});
              transform: scale(${MAX_SCALE});
            }
          }
        `}
      </style>
    </div>
  );
};
