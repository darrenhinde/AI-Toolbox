import { Client } from '@notionhq/client';

export type Database = Client['databases']['retrieve']['response'];
export type DatabaseProperties = Client['databases']['create']['parameters']['properties'];
export type DatabaseQuery = Client['databases']['query']['parameters'];
export type DatabaseQueryResult = Client['databases']['query']['response'];
