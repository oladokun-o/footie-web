export interface RequestResponse {
  result: 'success' | 'error';
  message: string;
  data: any;
  statusCode?: number;
  error?: string;
}

export enum Languages {
  ENGLISH = 'en',
  FRENCH = 'fr',
  RUSSIAN = 'ru',
}

export interface Tab {
  title: string;
  active: boolean;
  disabled: boolean;
  content: string;
}
