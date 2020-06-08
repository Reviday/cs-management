module.exports = {
  size: 0,
  from: 0,
  query: {
    bool: {
      must: [
        {
          match: {
            'owner.keyword': null
          }
        }
      ]
    }
  },
  sort: [
    {
      create_date: {
        order: 'desc'
      }
    }
  ]
};
