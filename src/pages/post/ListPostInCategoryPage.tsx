import PostRepository from "@/api/repositories/PostRepository";
import AppCard from "@/components/common/AppCard";
import { useCallApi } from "@/hooks/useCallApi";
import useCategoriesStore from "@/stores/useCategoriesStore";
import { GetAllPostResponse } from "@/typings/post";
import { Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { map } from "rxjs";

const ListPostInCategoryPage = () => {
	const [posts, setPosts] = useState<GetAllPostResponse | undefined>();
	const [page, setPage] = useState(1);
	const { id } = useParams();
	const { categories } = useCategoriesStore();

	const cate = categories?.find(c => c.id === parseInt(id ?? "1"));

	const { run: getPosts } = useCallApi((categories: number[], page: number) => {
		return PostRepository.getPostsByCategories(categories, page, 8).pipe(map(response => {
			if (response.status === 200) {
				setPosts(response.data);
			}
		}))
	})

	useEffect(() => {
		getPosts([parseInt(id ?? "1")], page);
	}, [page, id]);

	return (
		<div className='mt-5'>
			<h1 className="font-semibold text-[24px] mb-3">Thể loại: {cate?.name}</h1>
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

export default ListPostInCategoryPage;
