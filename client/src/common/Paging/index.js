import React, { useState, useEffect } from 'react';
import './Paging.scss';

const Paging = (props) => {
  /*
    ### props

    onClick       ─ 페이지 번호 클릭 시, list를 불러올 함수 (인수는 count로, from이라고 보면 됨) : required
    block         ─ Connection Test 중 페이지 이동을 막기 위한 함수(필수 x)
    totalCount    ─ List의 전체 count : required
    displayCount  ─ 보여질 List의 개수 : required
    current       ─ 현재 페이지 번호를 의미(특수한 경우가 아닌 이상 1로 고정) : required
  */

  const [state, setState] = useState({
    start: 1,
    last: props.displayCount,
    size: props.displayCount,
    listCount: props.listCount,
    totalCount: props.totalCount,
    current: props.current,
    pageViewSize: 0,
    viewSize: [],
    ppreView: 'off',
    preView: 'off',
    nextView: 'off',
    nnextView: 'off'
  });

  useEffect(() => {
    setState({
      ...state,
      start: 1,
      last: props.displayCount,
      totalCount: props.totalCount,
      current: props.current
    });
  }, [props.totalCount, props.current]);

  const SetPaging = class {
    constructor(ref) {
      this.ref = ref;
    }

    initValue() {
      let refObj = this.ref;
      state.nextView = 'off';
      state.nnextView = 'off';
      state.ppreView = 'off';
      state.preView = 'off';

      if (refObj.pageViewSize !== refObj.current) {
        state.nextView = 'on';
        state.nnextView = 'on';
      }

      if (refObj.current !== 1) {
        state.ppreView = 'on';
        state.preView = 'on';
      }

    }

    setPageNum() {
      let refObj = this.ref;
      refObj.pageViewSize = Math.ceil(refObj.totalCount / refObj.size);
      let num = refObj.current;
      let viewSize = [];

      if (refObj.current > refObj.last) {
        refObj.last = Math.ceil(refObj.current / 10) * 10;
        refObj.start = refObj.last - refObj.size + 1;
      }


      let maxSize = refObj.last;
      if (refObj.last > refObj.pageViewSize) maxSize = refObj.pageViewSize;
      for (let idx = refObj.start; idx < maxSize + 1; idx++) {
        viewSize.push(idx);
      }
      state.viewSize = viewSize;
    }

    setNextNum(num) {
      let refObj = this.ref;

      if (refObj.current === refObj.last) {
        refObj.start = refObj.current + 1;
        refObj.last = refObj.current + refObj.size;
      }
      setState({ ...state, current: refObj.current + 1 });
    }

    setNnextNum(num) {
      let refObj = this.ref;

      let minSize = refObj.pageViewSize - (refObj.pageViewSize % refObj.size) + 1;
      if (minSize > refObj.pageViewSize) minSize -= refObj.size;
      if (refObj.pageViewSize !== refObj.last) refObj.start = minSize;
      refObj.last = Math.ceil(refObj.pageViewSize / refObj.size) * refObj.size;
      setState({ ...state, current: refObj.pageViewSize });
    }

    setPrevNum(num) {
      let refObj = this.ref;
      if (refObj.current - 1 === refObj.last - refObj.size) {
        refObj.start = refObj.current - refObj.size;
        refObj.last = refObj.current - 1;
      }
      setState({ ...state, current: refObj.current - 1 });
    }

    setPprevNum(num) {
      let refObj = this.ref;
      refObj.start = 1;
      refObj.last = refObj.size;
      setState({ ...state, current: 1 });
    }
  };

  let paging = new SetPaging(state);
  if (state.totalCount !== 0) {
    paging.setPageNum();
    paging.initValue();
  }

  const handlePageClick = (item, status, view) => {
    if (props.block && !props.block()) return false;

    if (view === 'off') return false;
    let selected = state.current;
    if (selected === item && status === 'no') return false;
    if (status === 'next') {
      paging.setNextNum();
    } else if (status === 'nnext') {
      paging.setNnextNum();
      item = state.pageViewSize;
    } else if (status === 'prev') {
      paging.setPrevNum();
    } else if (status === 'pprev') {
      paging.setPprevNum();
      item = 1;
    } else {
      setState({ ...state, current: item });
    }
    let retCount = item * state.listCount - state.listCount;
    console.log(retCount);
    props.onClick(retCount);
  };


  return (
    <div className="page_div_layout">
      <div className="div_paging">
        <ul className="_ul">
          <li
            className={`_li btn ppre ${state.ppreView === 'on' ? '' : 'dis'}`}
            onClick={() => handlePageClick(0, 'pprev', state.ppreView)}
          >
            {'<<'}
          </li>
          <li
            className={`_li btn pre ion-ios-arrow-left ${state.preView === 'on' ? '' : 'dis'}`}
            onClick={() => handlePageClick(state.current - 1, 'prev', state.preView)}
          />
          {state.viewSize.map((item) => {
            return (
              <li
                className={`_li ${state.current === item ? 'on' : ''}`}
                key={item}
                onClick={() => handlePageClick(item, 'no', 'on')}
              >
                {item}
              </li>
            );
          })
          }
          <li
            className={`_li btn next ion-ios-arrow-right ${state.nextView === 'on' ? '' : 'dis'}`}
            onClick={() => handlePageClick(state.current + 1, 'next', state.nextView)}
          />
          <li
            className={`_li btn nnext ${state.nnextView === 'on' ? '' : 'dis'}`}
            onClick={() => handlePageClick(0, 'nnext', state.nnextView)}
          >
            {'>>'}
          </li>
        </ul>
      </div>
    </div>
  );
};

export { Paging as default, Paging };
