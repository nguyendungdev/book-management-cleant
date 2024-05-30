import PostRepository from "@/api/repositories/PostRepository";
import ReviewRepository from "@/api/repositories/ReviewRepository";
import { useCallApi } from "@/hooks/useCallApi";
import useAuthStore from "@/stores/useAuthStore";
import useBookmarkStore from "@/stores/useBookmarkPost";
import { Post } from "@/typings/post";
import { GetAllReviewResponse, Review } from "@/typings/review";
import makeID from "@/utils/makeID";
import { schemaCreateReviewPostValidation } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Avatar, Button, Chip, Image, Input, Pagination, ScrollShadow, Textarea } from "@nextui-org/react";
import { IconStarFilled } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { catchError, map, of } from "rxjs";

interface CreateReview {
	title: string;
	description: string;
}

const PostDetailPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState<Post | undefined>(undefined);
	const [reviews, setReviews] = useState<GetAllReviewResponse | undefined>(undefined);
	const [reviewInPost, setReviewInPost] = useState<Review | undefined>(undefined);
	const [pageReview, setPageReview] = useState(1);
	const { post: postInBookmark, addPostInBookmark } = useBookmarkStore();
	const { authState } = useAuthStore();
	const [hoverIndex, setHoverIndex] = useState(0);

	const isExistsInBookmark = postInBookmark.find(p => p.id === id);

	const { register, handleSubmit, formState: { errors } } = useForm({
		mode: "onChange",
		resolver: yupResolver(schemaCreateReviewPostValidation)
	});

	const { register: registerModifyReview, handleSubmit: handleSubmitModifyReview, formState: { errors: errorsModifyReview } } = useForm({
		mode: "onChange",
		defaultValues: {
			title: reviewInPost?.title ?? "",
			description: reviewInPost?.description ?? ""
		},
		values: {
			title: reviewInPost?.title ?? "",
			description: reviewInPost?.description ?? ""
		},
		resolver: yupResolver(schemaCreateReviewPostValidation)
	});

	const onSubmitCreateReviewPost: SubmitHandler<CreateReview> = (value) => {
		if (!id) return;

		createReviewPost(id, value);
	}

	const onSubmitUpdateReviewPost: SubmitHandler<CreateReview> = value => {
		if (!id || !reviewInPost?.id) return;

		updateReview(reviewInPost.id, id, value);
	}

	const { run: getPostByID } = useCallApi((id: string) => {
		return PostRepository.getPostByID(id).pipe(map(response => {
			if (response.status === 200) {
				setPost(response.data);
			}
		}), catchError(errors => {
			toast.error(errors);

			return of(errors)
		}))
	});

	const { run: getAllReviewInPost } = useCallApi((id: string, page = 1, limit = 24) => {
		return ReviewRepository.getAllReviewByPostID(id, page, limit).pipe(
			map(response => {
				if (response.status === 200) {
					setReviews(response.data);
				}
			})
		)
	});

	const { run: createReviewPost } = useCallApi((postID: string, createReviewPayload: CreateReview) => {
		const toastLoading = toast.loading("Đăng đánh giá...");

		return ReviewRepository.createReview(postID, {
			title: createReviewPayload.title,
			description: createReviewPayload.description,
			rating: hoverIndex + 1
		}).pipe(
			map(response => {
				toast.dismiss(toastLoading);

				if (response.status === 201) {
					toast.success("Đăng đánh giá thành công!");
					getAllReviewInPost(id ?? "", pageReview, 5)
					getReviewByReviewerAndPost(id ?? "", authState?.user?.id ?? 1);
				}
			}),
			catchError(errors => {
				toast.dismiss(toastLoading);

				toast.error("Có lỗi xảy ra vui lòng thử lại sau ít phút!");

				return of(errors);
			})
		)
	});

	const { run: updateReview } = useCallApi((reviewID: number, postID: string, updateReviewPayload: CreateReview) => {
		const toastLoading = toast.loading("Sửa đánh giá...");

		return ReviewRepository.updateReview(reviewID, {
			title: updateReviewPayload.title,
			description: updateReviewPayload.description,
			rating: hoverIndex + 1,
			postID
		}).pipe(
			map(response => {
				toast.dismiss(toastLoading);

				if (response.status === 200) {
					toast.success("Sửa đánh giá thành công!");
					getAllReviewInPost(id ?? "", pageReview, 5)
					getReviewByReviewerAndPost(id ?? "", authState?.user?.id ?? 1);
				}
			}),
			catchError(errors => {
				toast.dismiss(toastLoading);
				toast.error("Có lỗi xảy ra vui lòng thử lại sau ít phút!");

				return of(errors);
			})
		)
	});

	const { run: removeReview } = useCallApi((reviewID: number) => {
		const toastLoading = toast.loading("Xoá đánh giá...");

		return ReviewRepository.deleteReview(reviewID).pipe(
			map(response => {
				toast.dismiss(toastLoading);

				if (response.status === 204) {
					toast.success("Xoá đánh giá thành công!");
					getAllReviewInPost(id ?? "", pageReview, 5)
					setReviewInPost(undefined);
				}
			}),
			catchError(errors => {
				toast.dismiss(toastLoading);
				toast.error("Có lỗi xảy ra vui lòng thử lại sau ít phút!");

				return of(errors);
			})
		)
	})

	const { run: getReviewByReviewerAndPost } = useCallApi((postID: string, reviewerID: number) => {
		return ReviewRepository.checkReviewByReviewerAndPostID(postID, reviewerID).pipe(
			map(response => {
				if (response.status === 200) {
					response.data !== "" && setReviewInPost(response.data)
				}
			})
		)
	})

	useEffect(() => {
		if (!reviewInPost) return;

		setHoverIndex(reviewInPost.rating - 1);
	}, [reviewInPost])

	useEffect(() => {
		if (!authState?.user?.id || !id) return;

		getReviewByReviewerAndPost(id, authState.user.id);
	}, [authState?.user?.id, id]);

	useEffect(() => {
		if (!id) return;

		getAllReviewInPost(id, pageReview, 5);
	}, [pageReview, id])

	useEffect(() => {
		if (!id) return;

		getPostByID(id);
	}, [id]);

	return (
		<div className="mt-5">
			<>
				{
					post ? (
						<div className="flex flex-col gap-y-2">
							<div className="flex items-end">
								<div className="flex-1 flex flex-col gap-y-1">
									<h1 className="font-medium text-[42px]">{post?.name}</h1>
									<div className="flex items-center gap-x-1">
										{
											post.category.map(cate => {
												return <Chip className="cursor-pointer" onClick={() => navigate("/category/" + cate.id)} variant="solid">{cate.name}</Chip>
											})
										}
									</div>

									<div className="flex items-center gap-x-2 mt-3">
										{post.author.photo?.path ? <Avatar src={post.author.photo.path} size="sm" /> : <Avatar size="sm">{post.author.firstName} {post.author.lastName}</Avatar>}
										<span className="font-medium">{post.author.firstName} {post.author.lastName}</span>
									</div>
								</div>

								<div className="flex gap-x-2 flex-col gap-y-[50px]">
									<p className="text-end">Ngày đăng: {dayjs(post.createdAt).format("DD/MM/YYYY")}</p>
									<div className="flex items-center gap-x-2">
										<Button color="secondary" onClick={() => addPostInBookmark(post)}>{isExistsInBookmark ? "Xóa yêu thích" : "Yêu thích"}</Button>
										<Button color="primary">Tải xuống</Button>
									</div>
								</div>
							</div>

							<div className="mt-5 flex justify-center items-center">
								<Image src={post.thumbnail.path} />
							</div>
							<div className="flex flex-col gap-y-2 mt-5">
								<h2 className="font-semibold text-[24px]">Nguyên liệu:</h2>
								<p className="leading-8 text-lg" >{post.ingredients}</p>
							</div>
							<div className="flex flex-col gap-y-2 mt-5">
								<h2 className="font-semibold text-[24px]">Mô tả công thức:</h2>
								<p className="leading-8 text-lg" >{post.description}</p>
							</div>

						</div>
					) : null
				}
			</>

			<div className="mt-10">
				<h2 className="font-semibold text-[24px]">Đánh giá công thức:</h2>

				{
					!authState?.user ? (
						<div className="my-3 bg-white p-5 rounded-sm shadow-sm flex items-center justify-center font-medium">
							Vui lòng đăng nhập để đánh giá!
						</div>
					) : reviewInPost ? (
						<div className="my-3 bg-white p-5 rounded-sm shadow-sm flex flex-col gap-y-2">
							<p className="mb-2 font-medium">Sửa lại đánh giá:</p>
							<form className="flex flex-col gap-y-4" onSubmit={handleSubmitModifyReview(onSubmitUpdateReviewPost)}>
								<Input label="Tiêu đề đánh giá" placeholder="Điền tiêu đề đáng giá" {...registerModifyReview("title", {
									required: true
								})} errorMessage={errorsModifyReview.title?.message} />
								<Textarea label="Mô tả đánh giá" {...registerModifyReview("description", {
									required: true
								})} errorMessage={errorsModifyReview.description?.message} />

								<div className="flex gap-x-1">
									<p className="font-medium">Rating: </p>
									<div className="flex items-center gap-x-1">
										{
											new Array(5).fill(0).map((_, index) => {
												return (
													<IconStarFilled key={makeID(10)} className={`duration-150 ${index <= hoverIndex ? "text-yellow-500" : ""}`} onClick={() => setHoverIndex(index)} />
												)
											})
										}
									</div>
								</div>

								<div className="flex justify-end gap-x-2">
									<Button type="button" color="danger" onClick={() => removeReview(reviewInPost.id)}>Xoá đánh giá</Button>
									<Button type="submit" color="primary">Sửa lại đánh giá</Button>
								</div>
							</form>
						</div>
					) : (
						<div className="my-3 bg-white p-5 rounded-sm shadow-sm flex flex-col gap-y-2">
							<p className="mb-2 font-medium">Để lại đánh giá về công thức:</p>
							<form className="flex flex-col gap-y-4" onSubmit={handleSubmit(onSubmitCreateReviewPost)}>
								<Input label="Tiêu đề đánh giá" {...register("title", {
									required: true
								})} errorMessage={errors.title?.message} />
								<Textarea label="Mô tả đánh giá" {...register("description", {
									required: true
								})} errorMessage={errors.description?.message} />

								<div className="flex gap-x-1">
									<p className="font-medium">Rating: </p>
									<div className="flex items-center gap-x-1">
										{
											new Array(5).fill(0).map((_, index) => {
												return (
													<IconStarFilled key={makeID(10)} className={`duration-150 ${index <= hoverIndex ? "text-yellow-500" : ""}`} onClick={() => setHoverIndex(index)} />
												)
											})
										}
									</div>
								</div>

								<div className="flex justify-end">
									<Button type="submit" color="primary">Gửi đánh giá</Button>
								</div>
							</form>
						</div>
					)
				}

				{
					reviews?.items.length !== 0 ? (
						<>
							<ScrollShadow className="mt-2 max-h-[400px]">
								{
									reviews?.items.map(review => {
										return (
											<div className="p-3 flex items-center gap-x-10 bg-white rounded-md shadow-sm my-3">
												<div className="flex gap-x-2 items-center w-[20%]">
													{!review.reviewer.photo ? (
														<Avatar size="lg" name={review.reviewer.firstName} />
													) : (
														<Avatar size="lg" src={review.reviewer.photo.path} />
													)}

													<p className="font-semibold text-[18px]">{review.reviewer.firstName} {review.reviewer.lastName}</p>
												</div>

												<div className="flex flex-col gap-y-2">
													<h3 className="font-semibold text-large">{review.title}</h3>

													<p className="line-clamp-4 text-sm py-3">{review.description}</p>

													<div className="flex gap-x-3 items-center">
														<p className="text-[12px]">
															Đánh giá ngày: {dayjs(review.createdAt).format("DD/MM/YYYY")}
														</p>

														<div className="flex items-center gap-x-[2px]">
															{
																new Array(review.rating).fill(0).map(() => {
																	return <IconStarFilled size={"16"} key={makeID(10)} className="text-yellow-400" />
																})
															}
															{
																new Array(5 - review.rating).fill(0).map(() => {
																	return <IconStarFilled size={"16"} key={makeID(10)} />
																})
															}
														</div>
													</div>
												</div>
											</div>
										)
									})
								}
							</ScrollShadow>

							<div className='mt-2 flex items-center justify-end'>
								<Pagination total={reviews?.meta.totalPages ?? 1} initialPage={pageReview} onChange={page => setPageReview(page)} />
							</div>
						</>
					) : (
						<div className="p-5 bg-white rounded-md items-center justify-center flex my-5 shadow-sm">
							Hiện chưa có ai đánh giá công thức này
						</div>
					)
				}
			</div>
		</div>
	);
};

export default PostDetailPage;
