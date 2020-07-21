import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios';

import Config from 'config';

const ProgressContext = createContext([]);

const ProgressProvider = (props) => {

  const [progress, setProgress] = useState([]); // 진행상황 리스트

  // progress 정보 가져오기
  const getProgressInfo = async () => {
    let options = {
      url: `http://${Config.API_HOST.IP}/api/order/making/statuslist`,
      method: 'post'
    };

    try {
      let setData = await axios(options);
      let result = setData?.data?.data;
      if (result) setProgress(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  useEffect(() => {
    if (progress.length === 0) getProgressInfo(); // 진행상황 리스트
  }, []);

  return (
    <ProgressContext.Provider value={[progress, setProgress]}>
      {props.children}
    </ProgressContext.Provider>
  );
};

export { ProgressProvider, ProgressContext };
