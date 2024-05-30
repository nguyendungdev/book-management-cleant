export interface GetFilesRespsonse {
  items: File[];
  meta: Meta;
}

export interface File {
  id: string;
  path: string;
  uploaderId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  __entity: string;
}

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
