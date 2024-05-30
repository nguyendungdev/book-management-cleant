import { CreateReviewPayload, GetAllReviewResponse, UpdateReviewPayload } from "@/typings/review";
import env from "@/utils/env";
import axios, { AxiosInstance } from "axios";
import { from } from "rxjs";
import { createAxiosClient } from "../interceptors/PrivateAxios";

class ReviewRepository {
	private static _instance: ReviewRepository;
	private authClient: AxiosInstance;
	private client: AxiosInstance;

	constructor() {
		this.authClient = createAxiosClient({
			options: {
				baseURL: `${env.apiUrl}/review-post`
			}
		});

		this.client = axios.create({
			baseURL: `${env.apiUrl}/review-post`
		})
	}

	getAllReviewByPostID(postID: string, page = 1, limit = 24) {
		return from(this.client.get<GetAllReviewResponse>("/post/" + postID, {
			params: {
				limit,
				page
			}
		}))
	}

	createReview(postID: string, createReviewPayload: CreateReviewPayload) {
		return from(this.authClient.post("/", {
			...createReviewPayload,
			postID
		}))
	}

	checkReviewByReviewerAndPostID(postID: string, reviewerID: number) {
		return from(this.authClient.get(`/reviewer/${reviewerID}/post/${postID}`));
	}

	updateReview(reviewID: number, updateReviewPayload: UpdateReviewPayload) {
		return from(this.authClient.patch("/" + reviewID, {
			...updateReviewPayload
		}))
	}

	deleteReview(reviewID: number) {
		return from(this.authClient.delete("/" + reviewID));
	}

	static getInstance() {
		if (!this._instance) {
			this._instance = new ReviewRepository();
		}

		return this._instance;
	}
}

export default ReviewRepository.getInstance();
