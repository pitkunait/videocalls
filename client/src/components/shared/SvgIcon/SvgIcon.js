import React from 'react';


const SvgIcon = ({ src, width, height }) => (
    <img src={`/img/svg/${src}`} alt={src} height={height} style={{minWidth: width}}/>
);

export default SvgIcon;
