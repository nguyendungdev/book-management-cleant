import PostRepository from "@/api/repositories/PostRepository";
import AppCard from "@/components/common/AppCard";
import { useCallApi } from "@/hooks/useCallApi";
import { GetAllPostResponse } from "@/typings/post";
import { Input, Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { map } from "rxjs";

const SearchPostPage = () => {
	const [posts, setPosts] = useState<GetAllPostResponse | undefined>();
	const [page, setPage] = useState(1);
	const [keyword, setKeyword] = useState("");

	const { run: getPosts } = useCallApi((keyword: string, page: number) => {
		return PostRepository.searchPostByKeyword(keyword, page, 8).pipe(map(response => {
			if (response.status === 200) {
				setPosts(response.data);
			}
		}))
	})

	useEffect(() => {
		getPosts(keyword, page);
	}, [page, keyword]);

	return (
		<div className="mt-5">
			<h1 className="font-semibold text-[24px] mb-3">Tìm kiếm công thức</h1>

			<div className="mb-5 flex items-center gap-x-2 p-5 bg-white rounded-md shadow-sm">
				<Input placeholder="Bạn có nguyên liệu gì ... ?" onChange={(e) => setKeyword(e.target.value)} />
			</div>

			<div className='grid grid-cols-4 gap-4'>
				{
					posts && posts.items.length !== 0 ? posts.items.map(post => {
						return <AppCard post={post} />
					}) : null
				}
			</div>

			<div className='mt-5 flex items-center justify-center'>
				<Pagination total={posts?.meta.totalPages ?? 1} initialPage={page} onChange={page => setPage(page)} />
			</div>
		</div>
	);
};

export default SearchPostPage;
