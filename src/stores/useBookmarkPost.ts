import { Post } from "@/typings/post";
import { toast } from "react-toastify";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface BookmarkStore {
	post: Post[];
	setPosts: (posts: Post[]) => void;
	addPostInBookmark: (post: Post) => void;
}

const useBookmarkStore = create<BookmarkStore>()(
	devtools(
		persist(
			(set) => ({
				post: [],
				setPosts: (payload) => set(() => ({
					post: payload
				})),
				addPostInBookmark: (post) => set((state) => {
					const isExisted = state.post.find(p => p.id === post.id);

					if (!isExisted) {
						toast.info(`Đã thêm công thức vào danh sách yêu thích!`);
					} else {
						toast.info("Đã xoá công thức ra khỏi danh sách yêu thích!");

						const clonePostArray = structuredClone(state.post);
						const newArray = clonePostArray.filter(p => p.id !== post.id);

						return {
							post: newArray
						}
					}

					return {
						post: isExisted ? state.post : [...state.post, post]
					}
				})
			}),
			{
				name: "bookmarkStore",
				storage: createJSONStorage(() => localStorage)
			}
		)
	)
)

export default useBookmarkStore;
