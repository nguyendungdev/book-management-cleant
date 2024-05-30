
export type UpdatePostPayload = Partial<{
	name: string;
	description: string;
	ingredients: string;
	thumbnail: {
		id: string;
	};
	category: number[];
}>

export type CreatePostPayload = UpdatePostPayload;

export interface GetAllPostResponse {
	items: Post[]
	meta: Meta
}

export interface Post {
	id: string
	name: string
	description: string
	authorID: number
	ingredients: string
	createdAt: string
	updatedAt: string
	deletedAt: any
	category: Category[]
	thumbnail: File
	author: Author
	__entity: string
}

export interface Category {
	id: number
	name: string
	createdAt: string
	updatedAt: string
	deletedAt: any
	__entity: string
}

export interface File {
	id: string
	path: string
	__entity: string
}

export interface File {
	id: string
	path: string
	__entity: string
}

export interface Author {
	id: number
	firstName: string
	lastName: string
	photoID: string
	createdAt: string
	updatedAt: string
	deletedAt: any
	photo: Photo
	role: Role
	status: Status
	__entity: string
}

export interface Photo {
	id: string
	path: string
	__entity: string
}

export interface Role {
	id: number
	name: string
	__entity: string
}

export interface Status {
	id: number
	name: string
	__entity: string
}

export interface Meta {
	totalItems: number
	itemCount: number
	itemsPerPage: number
	totalPages: number
	currentPage: number
}

