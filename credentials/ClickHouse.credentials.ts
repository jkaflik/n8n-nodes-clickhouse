import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ClickHouse implements ICredentialType {
	name = 'clickhouse';

	displayName = 'ClickHouse';

	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: 'http://localhost:8123',
		},
		{
			displayName: 'Database',
			name: 'database',
			type: 'string',
			default: 'default',
		},
		{
			displayName: 'User',
			name: 'user',
			type: 'string',
			default: 'default',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Ignore SSL Issues',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			default: false,
			description: 'Whether to connect even if SSL certificate validation is not possible',
		},
	];
}
