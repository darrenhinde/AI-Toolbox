import axios from 'axios';

export class NotionAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async request(method: string, endpoint: string, data?: any) {
    try {
      const response = await axios.request({
        method,
        url: `https://api.notion.com/v1${endpoint}`,
        data,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error making request to Notion API:', error);
      throw error;
    }
  }
}
