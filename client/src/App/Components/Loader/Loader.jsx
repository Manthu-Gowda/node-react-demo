import React from 'react';

const loaderStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
};

const dotStyle = {
  width: '15px',
  height: '15px',
  borderRadius: '50%',
  margin: '0',
  animation: 'growShrink 1.5s infinite ease-in-out both',
};

const dotStyles = [
  { ...dotStyle, backgroundColor: 'rgba(174, 223, 247, 0.7)', animationDelay: '0s' },
  { ...dotStyle, backgroundColor: 'rgba(144, 203, 238, 0.7)', animationDelay: '0.2s' },
  { ...dotStyle, backgroundColor: 'rgba(128, 177, 225, 0.7)', animationDelay: '0.4s' },
  { ...dotStyle, backgroundColor: 'rgba(194, 178, 206, 0.7)', animationDelay: '0.6s' },
  { ...dotStyle, backgroundColor: 'rgba(242, 179, 193, 0.7)', animationDelay: '0.8s' },
];

const keyframes = `
  @keyframes growShrink {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.5);
      opacity: 0.7;
    }
  }
`;

const Loader = () => {
  return (
    <div style={loaderStyle}>
      <style>{keyframes}</style>
      {dotStyles.map((style, index) => (
        <div key={index} style={style}></div>
      ))}
    </div>
  );
};

export default Loader;
