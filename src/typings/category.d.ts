
export type CreateCategoryPayload = {
	name: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;

export type GetAllCategoriesResponse = Category[]

export interface Category {
	id: number
	name: string
	createdAt: string
	updatedAt: string
	deletedAt: any
	__entity: string
}

export interface Meta {
	totalItems: number
	itemCount: number
	itemsPerPage: number
	totalPages: number
	currentPage: number
}
