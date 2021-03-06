import AJAX from 'utils/ajax';
import {buildInfluxUrl, proxy} from 'utils/queryUrlGenerator';

export const showDatabases = async (source) => {
  const query = `SHOW DATABASES`
  return await proxy({source, query})
}

export const showRetentionPolicies = async (source, databases) => {
  let query
  if (Array.isArray(databases)) {
    query = databases.map((db) => `SHOW RETENTION POLICIES ON "${db}"`).join(';')
  } else {
    query = `SHOW RETENTION POLICIES ON "${databases}"`
  }

  return await proxy({source, query})
}

export function showQueries(source, db) {
  const query = 'SHOW QUERIES';

  return proxy({source, query, db});
}

export function killQuery(source, queryId) {
  const query = `KILL QUERY ${queryId}`;

  return proxy({source, query});
}

export function showMeasurements(source, db) {
  const query = 'SHOW MEASUREMENTS';

  return proxy({source, db, query});
}

export function showTagKeys({source, database, retentionPolicy, measurement}) {
  const query = `SHOW TAG KEYS FROM "${measurement}"`;

  return proxy({source, db: database, rp: retentionPolicy, query});
}

export function showTagValues({source, database, retentionPolicy, measurement, tagKeys}) {
  const keys = tagKeys.sort().map((k) => `"${k}"`).join(', ');
  const query = `SHOW TAG VALUES FROM "${measurement}" WITH KEY IN (${keys})`;

  return proxy({source, db: database, rp: retentionPolicy, query});
}

export function showShards() {
  return AJAX({
    url: `/api/int/v1/show-shards`,
  });
}

export function createRetentionPolicy({host, database, rpName, duration, replicationFactor, clusterID}) {
  const statement = `CREATE RETENTION POLICY "${rpName}" ON "${database}" DURATION ${duration} REPLICATION ${replicationFactor}`;
  const url = buildInfluxUrl({host, statement});

  return proxy(url, clusterID);
}

export function dropShard(host, shard, clusterID) {
  const statement = `DROP SHARD ${shard.shardId}`;
  const url = buildInfluxUrl({host, statement});

  return proxy(url, clusterID);
}

export function showFieldKeys(source, db, measurement, rp) {
  const query = `SHOW FIELD KEYS FROM "${rp}"."${measurement}"`;

  return proxy({source, query, db});
}
