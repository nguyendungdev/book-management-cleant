import PostRepository from "@/api/repositories/PostRepository";
import AppCard from "@/components/common/AppCard";
import { useCallApi } from "@/hooks/useCallApi";
import { GetAllPostResponse } from "@/typings/post";
import { Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { map } from "rxjs";

const ListPostPage = () => {
	const [posts, setPosts] = useState<GetAllPostResponse | undefined>();
	const [page, setPage] = useState(1);

	const { run: getPosts } = useCallApi((page: number) => {
		return PostRepository.getPosts(page, 8).pipe(map(response => {
			if (response.status === 200) {
				setPosts(response.data);
			}
		}))
	})

	useEffect(() => {
		getPosts(page);
	}, [page]);

	return (
		<div className='mt-5'>
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

export default ListPostPage;
