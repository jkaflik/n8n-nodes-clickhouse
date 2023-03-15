# n8n-nodes-clickhouse

This is an n8n community node. It lets you use [ClickHouse](https://clickhouse.com/) in your n8n workflows.

ClickHouse is a fast open-source column-oriented database management system that allows generating analytical data reports in real-time using SQL queries.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Usage](#usage)  <!-- delete if not using this section -->  
[Resources](#resources)  
[Version history](#version-history)  <!-- delete if not using this section -->

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

### Query

Query SQL has to be provided. Rows are return as items.

### Insert

Items are insert batch into user-specified table.

## Credentials

In order to connect to ClickHouse, you have to configure credentials with HTTP URL (only HTTP protocol is supported) and user credentials.

## Compatibility

Tested with 0.219.x.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [ClickHouse](https://clickhouse.com/)
* [ClickHouse HTTP interface](https://clickhouse.com/docs/en/interfaces/http/)

## TODOs

- [ ] [ClickHouse settings](https://clickhouse.com/docs/en/operations/settings/settings/) ([it's possible to set settings for SELECT query](https://clickhouse.com/docs/en/sql-reference/statements/select/#settings-in-select-query))
- [ ] [query parameters](https://clickhouse.com/docs/en/interfaces/http/#cli-queries-with-parameters)
