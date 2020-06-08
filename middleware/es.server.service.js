
const elasticsearch = require('elasticsearch');
const approot = require('app-root-path');
const moment = require('moment');
const mapping = require(`${approot}/config/mapping.json`);
const vendorList = require(`${approot}/config/vendor.json`);
const configfile = require(`${approot}/config/config.json`);
const runmode = configfile.runmode;
const config = configfile[runmode];


let elasticClient;
const setElasticClient = () => {
  const elasticSet = config.ELASTICSEARCH_HOST;
  let elasticUrl = [];
  elasticSet.forEach((item) => {
    elasticUrl.push(item.IP + ':' + item.PORT);
  });
  elasticClient = new elasticsearch.Client({
    hosts: elasticUrl
  });
};

setElasticClient();

let defaultSetting = async () => {
  let indexNameList = ['dcast_db_config', 'dcast_db_vendor', 'dcast_es_config'];
  let indexList = [];

  for (const indexName of indexNameList) {
    await elasticClient.indices.exists({
      index: indexName
    }).then((data) => {
      if (data === false) {
        indexList.push(indexName);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  for (const indexName of indexList) {
    // 인덱스 생성
    await elasticClient.indices.create({
      index: indexName,
      body: mapping[indexName]
    }).then(() => {
      console.log(indexName, '생성 및 매핑');
    }).catch((error) => {
      console.log(error);
    });

      
    // vendor 초기값 입력
    if (indexName === 'dcast_db_vendor') {
      for (let idx in vendorList) {
        if (Object.prototype.hasOwnProperty.call(vendorList, idx)) {
          vendorList[idx].create_date = moment().format('YYYY-MM-DD HH:mm:ss');

          await elasticClient.index({
            index: indexName,
            type: '_doc',
            body: vendorList[idx]
          }).then(() => {
            console.log('vendor :', vendorList[idx].vendor, '값 입력');
          }).catch((error) => {
            console.log(error);
          });
        }
      }
    }
  }
};

defaultSetting();

module.exports = {
  ping: (req, res) => elasticClient.ping({
    requestTimeout: 30000,
  }).catch((err) => {
    return {
      status: false,
      message: 'Elasticsearch cluster is down!',
      err: err
    };
  }),

  /** 1. Create index */
  initIndex: (req, res, indexName) => elasticClient.indices.create({
    index: indexName
  }).catch((err) => {
    console.log(err);
    throw err;
  }),


  /** 2. Check if index exists */
  indexExists: () => elasticClient.indices.exists({
    index: indexNamez
  }).catch((err) => {
    console.log(err);
    throw err;
  }),


  /** 3.  Preparing index and its mapping */
  initMapping: (req, res, indexName, docType, payload) => elasticClient.indices.putMapping({
    index: indexName,
    type: docType,
    body: payload
  }).catch((err) => {
    console.log(err);
    throw err;
  }),

  /** 4. Add a document */
  addDocument: async (indexName, docType, payload) => elasticClient.index({
    index: indexName,
    type: docType,
    refresh: 'wait_for',
    body: payload
  }).catch((err) => {
    console.log(elasticClient.transport._config.hosts);
    console.log(err);
    throw err;
  }),

  /** 5. Update a document */
  update: async (indexName, _id, docType, payload) => elasticClient.update({
    index: indexName,
    type: docType,
    id: _id,
    refresh: 'wait_for',
    body: payload
  }).catch((err) => {
    console.log(err);
    throw err;
  }),
  updateByQuery: async (indexName, docType, payload) => elasticClient.updateByQuery({
    index: indexName,
    type: docType,
    body: payload,
    refresh: 'wait_for',
    conflicts: 'proceed'
  }).catch((err) => {
    console.log(err);
    throw err;
  }),

  /** 6. Search */
  search: async (indexName, docType, payload) => elasticClient.search({
    index: indexName,
    type: docType,
    body: payload
  }).catch((err) => {
    console.log(err);
    throw err;
  }),

  /** 7. Add bulk data */
  addBulk: async payload => elasticClient.bulk({
    refresh: 'wait_for',
    body: payload
  }).catch((err) => {
    console.log(err);
    throw err;
  }),

  /** -----  DANGER AREA [RESTRICTED USE] ----- */

  // Delete a document from an index
  deleteDocument: async (index, _id, docType) => elasticClient.delete({
    index: index,
    type: docType,
    refresh: 'wait_for',
    id: _id,
  }).catch((err) => {
    console.log(err);
    throw err;
  }),

  deletebyquery: async (index, docType, payload) => elasticClient.deleteByQuery({
    index: index,
    type: docType,
    refresh: 'wait_for',
    body: payload
  }).catch((err) => {
    console.log(err);
    throw err;
  }),

  // Delete all
  deleteAll: (req, res) => {
    elasticClient.indices.delete({
      index: '_all'
    }, (err, resp) => {
      if (err) {
        console.error(err.message);
        return res.render('error', {
          message: err.message,
          error: err
        });
      }
      console.log('Indexes have been deleted!', resp);
      return res.json(resp);
    });
  },
  // es에 등록된 특정 유저의 db 리스트 출력
  getDBConfigList: owner => elasticClient
    .search({
      index: 'dcast_db_config',
      type: '_doc',
      body: {
        query: {
          term: {
            owner: owner
          }
        },
        sort: [
          {
            create_date: {
              order: 'desc'
            }
          }
        ]
      }
    })
    .then((data) => {
      let result = [];

      for (let val of data.hits.hits) {
        val._source._id = val._id;
        result.push(val._source);
        console.log(val._source);
      }
      return result;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    }),

  getESConfigList: owner => elasticClient
    .search({
      index: 'dcast_es_config',
      type: '_doc',
      body: {
        query: {
          term: {
            owner: owner
          }
        },
        sort: [
          {
            create_date: {
              order: 'desc'
            }
          }
        ]
      }
    })
    .then((data) => {
      let result = [];

      for (let val of data.hits.hits) {
        val._source._id = val._id;
        result.push(val._source);
        // console.log(val._source);
      }
      return result;
    })
    .catch((error) => {
      console.log(error);
      throw error;
    }),
  // 특정 아이디의 db 설정값 출력
  getDBConfig: id => elasticClient
    .search({
      index: 'dcast_db_config',
      type: '_doc',
      body: {
        query: {
          term: {
            _id: id
          }
        }
      }
    })
    .then((data) => {
      let result = {};

      for (let val of data.hits.hits) {
        val._source._id = val._id;
        result = val._source;
      }

      return result;
    })
    .catch((error) => {
      return false;
    }),
  getESConfig: id => elasticClient
    .search({
      index: 'dcast_es_config',
      type: '_doc',
      body: {
        query: {
          term: {
            _id: id
          }
        }
      }
    })
    .then((r) => {
      let result = {};

      for (let val of r.hits.hits) {
        val._source._id = val._id;
        result = val._source;
      }
      return result;
    })
    .catch((e) => {
      return false;
    })
  /** -----  DANGER AREA [RESTRICTED USE] ----- */
};
