import React, { useState, useRef } from 'react';
import axios from 'axios';

import BorderButton from 'common/Button/BorderButton';

const ModalContents = (props) => {
  const progress = props.items.progress || [];
  const [state, setState] = useState(props.data);

  return (
    <React.Fragment>
      <div className="modal_content" style={{}}>
        <div className="box_div">
          <div className="box_layout noshadow">
            <div className="_content fx_h_380">
              <div className="grid_box">
                <div className="rows-mb-20" />
                {
                    progress.map((item) => {
                      let name = item.status_name;
                      let addClass = `type${item.order_status}`;

                      const onHandle = () => {
                        setState({
                          ...state,
                          order_status: item.order_status,
                          status_name: name
                        });
                      };
                        
                      return (
                        <BorderButton
                          key={`${item.order_status}-${item.status_name}`}
                          addClass={`progressBtn ${addClass}`}
                          onHandle={e => onHandle(e)}
                          name={name}
                        />
                      );
                    })
                  }
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );

};

export default ModalContents;
