export default {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.YSIS_DB_HOST,
      database: 'youSayISay',
      user: process.env.YSIS_DB_USER,
      password: process.env.YSIS_DB_PASSWORD,
      charset: 'utf8mb4'
    },
    migrations: {
      directory: './migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'mysql',
    connection: {
      host: process.env.YSIS_DB_HOST_PRODUCTION,
      database: 'youSayISay',
      user: process.env.YSIS_DB_USER,
      password: process.env.YSIS_DB_PASSWORD,
      charset: 'utf8mb4'
    },
    migrations: {
      directory: './migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
}
