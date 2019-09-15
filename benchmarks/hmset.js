module.exports = ({ TEST_DATA, nodeRedis, ioredis, type }) => {
  const NODE_REDIS_KEY = `node_redis:${type}`;
  const IOREDIS_KEY = `ioredis:${type}`;
  const testHash  = {};
  Object.keys(TEST_DATA.hash).forEach(key => {
    [...new Array(20)].forEach((_, i) => {
      testHash[`${key}${i}`] = TEST_DATA.hash[key];
    });
  });

  return [
    {
      name: 'node_redis hmset',
      loop: () => new Promise(resolve => nodeRedis.hmset(NODE_REDIS_KEY, testHash, resolve))
    },
    {
      name: 'node_redis hmset with multi',
      beforeLoop: ctx => ctx.multi = nodeRedis.multi(),
      loop: ctx => ctx.multi.hmset(NODE_REDIS_KEY, testHash),
      afterLoop: ctx => new Promise(resolve => ctx.multi.exec(resolve))
    },
    {
      name: 'node_redis hmset with batch',
      beforeLoop: ctx => ctx.batch = nodeRedis.batch(),
      loop: ctx => ctx.batch.hmset(NODE_REDIS_KEY, testHash),
      afterLoop: ctx => new Promise(resolve => ctx.batch.exec(resolve))
    },
    {
      name: 'ioredis hmset',
      loop: () => ioredis.hmset(IOREDIS_KEY, testHash)
    },
    {
      name: 'ioredis hmset with multi',
      beforeLoop: ctx => ctx.multi = ioredis.multi(),
      loop: ctx => ctx.multi.hmset(IOREDIS_KEY, testHash),
      afterLoop: ctx => ctx.multi.exec()
    },
    {
      name: 'ioredis hmset with pipeline',
      beforeLoop: ctx => ctx.pipeline = ioredis.pipeline(),
      loop: ctx => ctx.pipeline.hmset(IOREDIS_KEY, testHash),
      afterLoop: ctx => ctx.pipeline.exec()
    },
  ];
};
