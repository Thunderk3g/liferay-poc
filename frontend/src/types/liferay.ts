// Liferay API Response Types

export interface LiferayContentFieldValue {
  data?: string;
}

export interface LiferayContentField {
  name: string;
  contentFieldValue?: LiferayContentFieldValue;
  dataType: string;
}

export interface LiferayCreator {
  name: string;
  id: number;
}

export interface LiferayStructuredContent {
  id: number;
  title: string;
  description?: string;
  contentFields: LiferayContentField[];
  dateCreated: string;
  dateModified: string;
  creator?: LiferayCreator;
}

export interface LiferayAPIResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface LiferayDocument {
  id: number;
  title: string;
  description?: string;
  contentUrl: string;
  encodingFormat: string;
  fileExtension: string;
  sizeInBytes: number;
  dateCreated: string;
  dateModified: string;
}
