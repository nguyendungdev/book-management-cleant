import useBookmarkStore from "@/stores/useBookmarkPost";
import { Post } from "@/typings/post";
import { Avatar, Card, CardBody, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { IconBookmarkPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

interface AppCardProps {
	post: Post;
}

const AppCard = ({ post }: AppCardProps) => {
	const navigate = useNavigate();
	const { addPostInBookmark, post: postInBookmark } = useBookmarkStore();

	return (
		<Card className="py-2" isPressable>
			<CardHeader className="pb-0 pt-2 px-4 flex-col items-start gap-y-2" onClick={() => navigate("/post/" + post.id)}>
				<p className="text-large uppercase font-bold line-clamp-1">{post.name}</p>
				<small className="text-default-500">{dayjs(post.createdAt).format("DD/MM/YYYY HH:mm")}</small>
				<span className="text-sm line-clamp-2">{post.description}</span>
			</CardHeader>
			<CardBody className="overflow-visible py-2 flex items-center justify-center" onClick={() => navigate("/post/" + post.id)}>
				<Image
					alt="Card background"
					className="object-cover rounded-xl w-[250px] h-[250px]"
					src={post.thumbnail.path}
					width={250}
					height={250}
				/>
			</CardBody>
			<CardFooter className="flex items-center px-4 justify-between">
				<div className="flex items-center gap-x-2">
					{post.author.photo?.path ? <Avatar src={post.author.photo.path} size="sm" /> : <Avatar size="sm">{post.author.firstName} {post.author.lastName}</Avatar>}
					<span className="font-medium">{post.author.firstName} {post.author.lastName}</span>
				</div>

				<div className="flex items-center">
					<IconBookmarkPlus className={`w-6 h-6 ${postInBookmark.findIndex(p => p.id === post.id) > -1 ? "text-yellow-500" : ""}`} onClick={() => addPostInBookmark(post)} />
				</div>
			</CardFooter>
		</Card>
	)
};

export default AppCard;
