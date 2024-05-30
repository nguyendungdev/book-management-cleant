import { CreatePostPayload, GetAllPostResponse, Post, UpdatePostPayload } from "@/typings/post";
import env from "@/utils/env";
import axios, { AxiosInstance } from "axios";
import { from } from "rxjs";
import { createAxiosClient } from "../interceptors/PrivateAxios";

class PostRepository {
	private static _instance: PostRepository;
	private authClient: AxiosInstance;
	private client: AxiosInstance;

	private constructor() {
		this.authClient = createAxiosClient({
			options: {
				baseURL: `${env.apiUrl}/recipe`
			}
		});

		this.client = axios.create({
			baseURL: `${env.apiUrl}/recipe`
		})
	}

	getPostByID(id: string) {
		return from(this.client.get<Post>(`/${id}`))
	}

	getPosts(page = 1, limit = 24) {
		return from(this.client.get<GetAllPostResponse>("/", {
			params: {
				page,
				limit
			}
		}))
	}

	getPostsByCategories(categories: number[], page = 1, limit = 24) {
		return from(this.client.get<GetAllPostResponse>("/categories", {
			params: {
				page,
				limit,
				categories: categories.join(",")
			}
		}))
	}

	getAllMyPosts(page = 1, limit = 24) {
		return from(this.authClient.get<GetAllPostResponse>("/me", {
			params: {
				page,
				limit
			}
		}))
	}
	getRandomPost(page = 1, limit = 24) {
		return from(this.client.get<GetAllPostResponse>("/", {
			params: {
				page,
				limit
			}
		}))
	}

	searchPostByKeyword(keyword: string, page = 1, limit = 24) {
		return from(this.client.get<GetAllPostResponse>("/search", {
			params: {
				q: keyword,
				page,
				limit
			}
		}))
	}




	createPost(createPostPayload: CreatePostPayload) {
		return from(this.authClient.post("/", createPostPayload));
	}

	updatePost(postID: string, updatePostPayload: UpdatePostPayload) {
		return from(this.authClient.patch(`/${postID}`, updatePostPayload));
	}

	deletePost(id: string) {
		return from(this.authClient.delete(`/${id}`))
	}

	static getInstance() {
		if (!this._instance) {
			this._instance = new PostRepository();
		}

		return this._instance;
	}
}

export default PostRepository.getInstance();
