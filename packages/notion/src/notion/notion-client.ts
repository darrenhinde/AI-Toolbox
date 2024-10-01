import { Client } from "@notionhq/client";

export class NotionClient {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client({ auth: apiKey });
  }

  getClient(): Client {
    return this.client;
  }
}
