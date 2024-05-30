import AppCard from "@/components/common/AppCard";
import useBookmarkStore from "@/stores/useBookmarkPost";

const ListPostInBookmarkPage = () => {
	const { post } = useBookmarkStore();

	return (
		<div className='mt-5'>
			{
				post.length !== 0 ? (
					<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
						{
							post.length !== 0 ? post.map(post => {
								return <AppCard post={post} />
							}) : null
						}
					</div>
				) : (
					<div className="mt-10 flex items-center justify-center">Hiện tại bạn chưa đánh dấu công thức nào!</div>
				)
			}
		</div>
	);
};

export default ListPostInBookmarkPage;
