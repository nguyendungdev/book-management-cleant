import { CreateCategoryPayload, GetAllCategoriesResponse, UpdateCategoryPayload } from "@/typings/category";
import { Category } from "@/typings/post";
import env from "@/utils/env";
import axios, { AxiosInstance } from "axios";
import { from } from "rxjs";
import { createAxiosClient } from "../interceptors/PrivateAxios";

class CategoryRepository {
	private static _instance: CategoryRepository;
	private authClient: AxiosInstance;
	private client: AxiosInstance;

	private constructor() {
		this.authClient = createAxiosClient({
			options: {
				baseURL: `${env.apiUrl}/category`
			}
		});

		this.client = axios.create({
			baseURL: `${env.apiUrl}/category`
		})
	}

	getAllCategories() {
		return from(this.client.get<GetAllCategoriesResponse>("/"))
	}

	createCategory(CreateCategoryPayload: CreateCategoryPayload) {
		return from(this.authClient.post<Category>("/", CreateCategoryPayload))
	}

	updateCategory(categoryID: number, UpdateCategoryPayload: UpdateCategoryPayload) {
		return from(this.authClient.patch<Category>(`/${categoryID}`, UpdateCategoryPayload))
	}

	deleteCategory(categoryID: number) {
		return from(this.authClient.delete(`/${categoryID}`));
	}

	static getInstance() {
		if (!this._instance) {
			this._instance = new CategoryRepository();
		}

		return this._instance;
	}
}

export default CategoryRepository.getInstance();
