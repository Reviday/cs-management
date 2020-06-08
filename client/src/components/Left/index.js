import React, { useContext } from 'react';
import './Left.scss';
import Navi from './Navigate';
import { CollapseContext } from 'contexts/CollapseContext';


const Left = () => {
  const [isCollapse] = useContext(CollapseContext);

  return (
    <div className={`vc_left ${isCollapse ? 'collapse' : ''}`}>
      <Navi />
    </div>
  );
  
};

export default Left;
