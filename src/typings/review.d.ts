
export type CreateReviewPayload = {
	title: string;
	description: string;
	rating: number;
}

export type UpdateReviewPayload = Partial<CreateReviewPayload> & {
	postID: string;
};

export interface GetAllReviewResponse {
	items: Review[]
	meta: Meta
}

export interface Review {
	id: number
	title: string
	rating: number
	description: string
	postID: string
	reviewerID: number
	createdAt: string
	updatedAt: string
	deletedAt: any
	reviewer: Reviewer
	__entity: string
}

export interface Reviewer {
	id: number
	firstName: string
	lastName: string
	createdAt: string
	updatedAt: string
	deletedAt: any
	photo: any
	role: Role
	status: Status
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

