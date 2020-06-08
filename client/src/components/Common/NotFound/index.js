import React from 'react';
// import logo from 'resources/images/ibricks_img.png';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="v_nf_container">
      <div className="nf_center_layout">
        <div className="cont_box">
          <div className="img_box">
            {/* <img className="nf_logo" src={logo} alt="i-bricks" /> */}
          </div>
          <div className="notFound_box">
              Page Not Found
          </div>
          <div className="go_to_home">
            <a href="/">
                  Go to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
