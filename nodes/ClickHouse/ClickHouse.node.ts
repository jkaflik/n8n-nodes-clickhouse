import type {
	IExecuteFunctions,
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { createClient, ClickHouseClientConfigOptions } from '@clickhouse/client'

export class ClickHouse implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ClickHouse',
		name: 'clickhouse',
		icon: 'file:clickhouse.svg',
		group: ['input'],
		version: 1,
		description: 'Query and ingest data into ClickHouse',
		defaults: {
			name: 'clickhouse',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'clickhouse',
				required: true,
				testedBy: 'clickhouseConnectionTest',
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Query',
						value: 'query',
						description: 'Execute an SQL query',
						action: 'Execute a SQL query',
					},
					{
						name: 'Insert',
						value: 'insert',
						description: 'Insert rows in database',
						action: 'Insert rows in database',
					},
				],
				default: 'insert',
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['query'],
					},
				},
				default: '',
				placeholder: 'SELECT id, name FROM product WHERE quantity > {quantity:Int32} AND price <= {price:Int32}',
				required: true,
				description:
					'The SQL query to execute. You can use n8n expressions or ClickHouse query parameters.',
			},
			{
				displayName: 'Table name',
				name: 'table',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['insert'],
					},
				},
				default: '',
				placeholder: 'product',
				required: true,
				description:
					'The table name to insert data. You can use n8n expressions.',
			},
			// {
			// 	displayName: 'Query parameters',
			// 	name: 'queryParams',
			// 	type: 'collection',
			// 	placeholder: 'Add parameter',
			// 	default: {},
			// 	options: [
			// 		{
			// 			displayName: 'Name',
			// 			name: 'name',
			// 			type: 'string',
			// 			displayOptions: {
			// 				show: {
			// 					operation: ['query', 'insert'],
			// 				},
			// 			},
			// 			default: '',
			// 			placeholder: 'SELECT id, name FROM product WHERE quantity > {quantity:Int32} AND price <= {price:Int32}',
			// 			required: true,
			// 		},
			// 		{
			// 			displayName: 'Value',
			// 			name: 'value',
			// 			type: 'string',
			// 			displayOptions: {
			// 				show: {
			// 					operation: ['query', 'insert'],
			// 				},
			// 			},
			// 			default: '',
			// 			required: true,
			// 		},
			// 	],
			// },
		],
	};

	methods = {
		credentialTest: {
			async clickhouseConnectionTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const credentials = credential.data as IDataObject;
				try {
					const config: ClickHouseClientConfigOptions = {
						host: credentials.url as string,
						database: credentials.database as string,
						username: credentials.user as string,
						password: credentials.password as string,
					};

					createClient(config);
				} catch (error) {
					return {
						status: 'Error',
						message: error.message,
					};
				}
				return {
					status: 'OK',
					message: 'Connection successful!',
				};
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials('clickhouse');

		const config: ClickHouseClientConfigOptions = {
			host: credentials.url as string,
			database: credentials.database as string,
			username: credentials.user as string,
			password: credentials.password as string,
		};

		const client = createClient(config);

		const operation = this.getNodeParameter('operation', 0);
		const queryParams = {} as Record<string, unknown>;

		let returnItems: INodeExecutionData[] = [];

		if (operation === 'query') {
			const query = this.getNodeParameter('query', 0) as string;

			const result = await client.query({
				query: query,
				format: 'JSONEachRow',
				query_params: queryParams,
			})


			const rows = (await result.json()) as object[]
			console.log('received CH rows', rows);

			returnItems = rows.map(row => ({json: row} as INodeExecutionData))
		} else if (operation === 'insert') {
			const items = this.getInputData().map(value => value.json);
			const table = this.getNodeParameter('table', 0) as string;

			console.log('insert CH rows', items);

			await client.insert({
				table: table,
				format: 'JSONEachRow',
				values: items,
				query_params: queryParams,
			})
		}

		await client.close()

		return this.prepareOutputData(returnItems);
	}
}
