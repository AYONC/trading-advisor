import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { entities } from '../entities';

dotenv.config({ path: `.env.${process.env.ENVIRONMENT ?? 'local'}` });

let dataSource: DataSource | null = null;

export const getConfig = (): DataSourceOptions => {
	return {
		type: 'mysql',
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT || '3306'),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		entities: entities,
		namingStrategy: new SnakeNamingStrategy(),
		migrations: [`${__dirname}/../migrations/*.{ts,js}`],
		synchronize: process.env.NODE_ENV === 'development',
		logging: process.env.NODE_ENV === 'development',
	};
};

export const getDataSource = async (): Promise<DataSource> => {
	if (!dataSource) {
		dataSource = new DataSource(getConfig());

		if (!dataSource.isInitialized) {
			await dataSource.initialize();
		}
	}

	return dataSource;
};

export default new DataSource(getConfig());
