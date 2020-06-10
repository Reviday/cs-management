import React, { useState, useRef } from 'react';
import 'common/Modal/Modal.scss';

const ModalContents = (props) => {
  const [state, setState] = useState(props.data);

  const selected = useRef();

  const onHandle = (e) => {
    setValue(list.find(e => e._id === selected.current.value));
  };

  return (
    <React.Fragment>
      <div className="modal_content" style={{ height: '800px', overflow: 'auto', padding: '20px 10px', display: 'inline-block' }}>
        <div className="box_div">
          <div className="box_layout noshadow">
            <div className="_content fx_h_380">
              <div className="grid_box">
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    지점
                  </div>
                  <div className="order_row_input">
                    <select ref={selected} onChange={onHandle}>
                      {
                        state.list?.map((item, index) => {
                          return (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          );
                        })
                      }
                    </select>
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    고객명
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="고객명" style={{ width: '150px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    연락처
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="연락처" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    주소
                  </div>
                  <div className="order_row_input" style={{ width: '360px' }}>
                    <input type="text" placeholder="우편번호" style={{ width: '100px' }} />
                    <input className="addr_searchBtn" type="button" value="주소 검색" />
                    <input type="text" placeholder="상세주소" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    상품명
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="상품명" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    가격
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="가격" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20">
                  <div className="order_row_title">
                    특이사항
                  </div>
                  <div className="order_row_input">
                    <input type="text" placeholder="특이사항" style={{ width: '300px' }} />
                  </div>
                </div>
                <div className="rows-mb-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ModalContents;
