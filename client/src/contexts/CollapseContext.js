import React, { useState, createContext } from 'react';

const CollapseContext = createContext([]);

const CollapseProvider = (props) => {

  const [isCollapse, setCollapse] = useState(false);

  return (
    <CollapseContext.Provider value={[isCollapse, setCollapse]}>
      {props.children}
    </CollapseContext.Provider>
  );
};

export { CollapseProvider, CollapseContext };
