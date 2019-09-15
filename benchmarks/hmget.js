module.exports = ({ TEST_DATA, nodeRedis, ioredis, type }) => {
  const NODE_REDIS_KEY = `node_redis:${type}`;
  const IOREDIS_KEY = `ioredis:${type}`;
  const baseHashKeys = Object.keys(TEST_DATA.hash);
  const hashKeys = [];
  [...new Array(10)].forEach((_, i) => {
    baseHashKeys.forEach(key => {
      hashKeys.push(`${key}${i}`);
    });
  });

  return [
    {
      name: "node_redis hmget",
      loop: () => new Promise(resolve => nodeRedis.hmget(NODE_REDIS_KEY, hashKeys, resolve))
    },
    {
      name: "node_redis hmget with multi",
      beforeLoop: ctx => (ctx.multi = nodeRedis.multi()),
      loop: ctx => ctx.multi.hmget(NODE_REDIS_KEY, hashKeys),
      afterLoop: ctx => new Promise(resolve => ctx.multi.exec(resolve))
    },
    {
      name: "node_redis hmget with batch",
      beforeLoop: ctx => (ctx.batch = nodeRedis.batch()),
      loop: ctx => ctx.batch.hmget(NODE_REDIS_KEY, hashKeys),
      afterLoop: ctx => new Promise(resolve => ctx.batch.exec(resolve))
    },
    {
      name: "ioredis hmget",
      loop: () => ioredis.hmget(IOREDIS_KEY, hashKeys)
    },
    {
      name: "ioredis hmget with multi",
      beforeLoop: ctx => (ctx.multi = ioredis.multi()),
      loop: ctx => ctx.multi.hmget(IOREDIS_KEY, hashKeys),
      afterLoop: ctx => ctx.multi.exec()
    },
    {
      name: "ioredis hmget with pipeline",
      beforeLoop: ctx => (ctx.pipeline = ioredis.pipeline()),
      loop: ctx => ctx.pipeline.hmget(IOREDIS_KEY, hashKeys),
      afterLoop: ctx => ctx.pipeline.exec()
    }
  ];
};
