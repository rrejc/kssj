var config = {
    connectionString: process.env.PG_CONN,
    solrServer: 'localhost',
    solrPort: 8983,
    solrPath: '/solr/kssj',
}

module.exports = config;