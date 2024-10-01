import { Client } from '@notionhq/client';

export type Page = Client['pages']['retrieve']['response'];
export type PageProperties = Client['pages']['create']['parameters']['properties'];
