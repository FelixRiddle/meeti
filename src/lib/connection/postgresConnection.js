const os = require("os");
const { Sequelize } = require("sequelize");

/**
 * Create postgress connection
 */
function postgressConnection(options = {
    pool: {
        // Per processor
        // Connections per processor is twice as many cpus
        max: os.cpus().length * 2,
        // Ten seconds
        acquire: 10 * 1000,
        // Five seconds of idling
        idle: 5 * 1000,
    }
}) {
    const POSTGRES_DATABASE_NAME = process.env.POSTGRES_DATABASE_NAME ?? "node_app";
    const POSTGRES_USERNAME = process.env.POSTGRES_USERNAME ?? "root";
    const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? "";
    const POSTGRES_HOST = process.env.POSTGRES_HOST ?? "localhost";
	const POSTGRES_PORT = Number(process.env.POSTGRES_PORT) || 5432;
    
	// Create connection
    const postgressConn = new Sequelize(POSTGRES_DATABASE_NAME, POSTGRES_USERNAME, POSTGRES_PASSWORD, {
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
        dialect: "postgres",
        define: {
            timestamps: true,
        },
        pool: {
            ...options.pool
        },
        // This one seems to not exist on ts
        // operatorAliases: false,
        // Disable logging
        logging: false
    });
    
    return postgressConn;
}

module.exports = postgressConnection;
