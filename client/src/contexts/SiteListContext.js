import React, { useState, createContext, useEffect } from 'react';
import axios from 'axios';

import Config from 'config';

const SiteListContext = createContext([]);

const SiteListProvider = (props) => {

  const [siteList, setSiteList] = useState([]); // 지점 리스트

  // Site List 정보 가져오기
  const getSiteList = async () => {
    let options = {
      url: `http://${Config.API_HOST.IP}/api/account/siteslist`,
      method: 'post'
    };

    try {
      let setData = await axios(options);
      let result = setData?.data?.data;
      if (result) setSiteList(result);
      console.log(result);
    } catch (e) {
      console.log('ERROR', e);
    }
  };

  useEffect(() => {
    if (siteList.length === 0) getSiteList(); // 지점 리스트
  }, []);

  return (
    <SiteListContext.Provider value={[siteList, setSiteList]}>
      {props.children}
    </SiteListContext.Provider>
  );
};

export { SiteListProvider, SiteListContext };
