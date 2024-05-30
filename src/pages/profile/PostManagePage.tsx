import PostRepository from "@/api/repositories/PostRepository";
import { useCallApi } from "@/hooks/useCallApi";
import { GetAllPostResponse } from "@/typings/post";
import { Chip, Image, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { catchError, map, of } from "rxjs";

const PostManagePage = () => {
	const [page, setPage] = useState(1);
	const [posts, setPosts] = useState<GetAllPostResponse | undefined>();
	const navigate = useNavigate();

	const { run: getAllMyPosts } = useCallApi((page: number) => {
		return PostRepository.getAllMyPosts(page, 8).pipe(
			map(response => {
				if (response.status === 200) {
					setPosts(response.data);
				}
			})
		)
	});

	const { run: deletePost } = useCallApi((postID: string) => {
		const toastLoading = toast.loading("Xoá công thức!");

		return PostRepository.deletePost(postID).pipe(
			map(response => {
				toast.dismiss(toastLoading);

				if (response.status === 204) {
					toast.success("Đã xoá công thức!");
					getAllMyPosts(page);
				}
			}),
			catchError(errors => {
				toast.dismiss(toastLoading);

				return of(errors);
			})
		)
	})

	useEffect(() => {
		getAllMyPosts(page);
	}, [page]);

	return (
		<div className='mt-5'>
			<h1 className="mb-5 font-semibold">Quản lý công thức đăng tải</h1>

			<Table>
				<TableHeader>
					<TableColumn>Hình ảnh</TableColumn>
					<TableColumn>Tiêu đề</TableColumn>
					<TableColumn>Thể loại</TableColumn>
					<TableColumn>Chỉnh sửa</TableColumn>
				</TableHeader>
				<TableBody emptyContent="Bạn chưa đăng tải công thức nào">
					{
						posts?.items ? posts.items.map(post => {
							return (
								<TableRow key={post.id}>
									<TableCell>
										<Image className="w-[100px] h-[100px] min-w-[100px] min-h-[100px]" src={post.thumbnail.path} />
									</TableCell>

									<TableCell>
										<p className="font-semibold underline cursor-pointer hover:text-blue-500 line-clamp-1" onClick={() => navigate("/post/" + post.id)}>{post.name}</p>
									</TableCell>

									<TableCell>
										<div className="flex gap-x-1">
											{
												post.category.map(cate => {
													return (
														<Chip className="cursor-pointer" size="sm" onClick={() => navigate("/category/" + cate.id)}>{cate.name}</Chip>
													)
												})
											}
										</div>
									</TableCell>

									<TableCell>
										<div className="flex gap-x-2">
											<Tooltip content="Chỉnh sửa">
												<span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => navigate("/post-manager/edit/" + post.id)}>
													<IconEdit />
												</span>
											</Tooltip>

											<Tooltip content="Xoá bài viết">
												<span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => deletePost(post.id)}>
													<IconTrash />
												</span>
											</Tooltip>
										</div>
									</TableCell>
								</TableRow>
							)
						}) : (
							[]
						)
					}
				</TableBody>
			</Table>

			<div className='mt-5 flex items-center justify-center'>
				<Pagination total={posts?.meta.totalPages ?? 1} initialPage={page} onChange={page => setPage(page)} />
			</div>
		</div>
	);
};

export default PostManagePage;
