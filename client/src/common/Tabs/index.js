import React from 'react';
import './Tabs.css';

const Tabs = (props) => {
  const categories = props.categories;
  const currentCategory = props.currentCategory;
  const setCurrentCategory = props.setCurrentCategory;

  const onChange = (e) => {
    setCurrentCategory(e.target.innerText);
  };


  return (
    <>
      <div className="_tabs">
        {categories.map((category) => {
          let className = `_tabs_item${category.name === currentCategory ? ' active' : ''}`;
          
          return (
            <button type="button" className={className} key={category.id} onClick={e => setCurrentCategory(e.target.innerText)}>
              {category.name}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default Tabs;
