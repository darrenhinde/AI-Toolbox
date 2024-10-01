import { Client } from '@notionhq/client';

export type DatabaseProperty = Client['databases']['create']['parameters']['properties'][string];
