import CategoryRepository from "@/api/repositories/CategoryRepository";
import { Category } from "@/typings/category";
import { map } from "rxjs";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface CategoriesStore {
	categories?: Category[];
	setCategories: (categories: Category[]) => void;
	refreshCategories: () => void;
}

const useCategoriesStore = create<CategoriesStore>()(
	devtools(
		persist(
			(set) => ({
				categories: undefined,
				setCategories: (payload) => set(() => ({
					categories: payload
				})),
				refreshCategories: () => {
					getAllCategories();
				},
			}),
			{
				name: 'categoriesStore',
				storage: createJSONStorage(() => localStorage),
			},
		),
	),
)

function getAllCategories() {
	const categories$ = CategoryRepository.getAllCategories();

	categories$.pipe(map(response => {
		const categories = response.data;
		useCategoriesStore.getState().setCategories(categories);
	})).subscribe();
}

getAllCategories();

export default useCategoriesStore;
