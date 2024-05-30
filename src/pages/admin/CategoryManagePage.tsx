import CategoryRepository from "@/api/repositories/CategoryRepository";
import { useCallApi } from "@/hooks/useCallApi";
import useCategoriesStore from "@/stores/useCategoriesStore";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { catchError, map, of } from "rxjs";
import * as yup from "yup";

interface UpdateCategory {
	name: string;
}

const CategoryManagePage = () => {
	const { categories, refreshCategories } = useCategoriesStore();
	const navigate = useNavigate();
	const [categoryID, setCategoryID] = useState<number | undefined>(undefined);
	const [isModify, setIsModify] = useState(false);
	const [isCreate, setIsCreate] = useState(false);

	const onSubmitUpdateCategory: SubmitHandler<UpdateCategory> = value => {
		if (!categoryID) return;

		updateCategory(categoryID, value.name);
	}

	const onSubmitCreateCategory: SubmitHandler<UpdateCategory> = value => {
		createCategory(value.name);
	}

	const { register, handleSubmit, formState: { errors } } = useForm({
		mode: "onChange",
		defaultValues: {
			name: categories?.find(cate => cate.id === categoryID)?.name ?? ""
		},
		values: {
			name: categories?.find(cate => cate.id === categoryID)?.name ?? ""
		},
		resolver: yupResolver(yup.object().shape({
			name: yup.string().required("Tên thể loại không được bỏ trống!").min(3, "Tên thể loại không được ít hơn 3 kí tự")
		}))
	})

	const { register: registerCreate, handleSubmit: handleSubmitCreate, formState: { errors: errorCreate } } = useForm({
		mode: "onChange",
		resolver: yupResolver(yup.object().shape({
			name: yup.string().required("Tên thể loại không được bỏ trống!").min(3, "Tên thể loại không được ít hơn 3 kí tự")
		}))
	})

	const { run: createCategory } = useCallApi((name: string) => {
		return CategoryRepository.createCategory({
			name
		}).pipe(
			map(response => {
				if (response.status === 201) {
					toast.success("Thêm thể loại thành công!");
					refreshCategories();
					setIsCreate(false);
				}
			}),
			catchError(errors => {
				toast.error("Có lỗi xảy ra vui lòng thử lại!");

				return of(errors);
			})
		)
	})

	const { run: deleteCategory } = useCallApi((categoryID: number) => {
		return CategoryRepository.deleteCategory(categoryID).pipe(
			map(response => {
				if (response.status === 204) {
					toast.success("Xoá thể loại thành công!");
					refreshCategories();
					setIsModify(false);
				}
			}),
			catchError(errors => {
				toast.error("Có lỗi xảy ra vui lòng thử lại!");

				return of(errors);
			})
		)
	});

	const { run: updateCategory } = useCallApi((categoryID: number, name: string) => {
		return CategoryRepository.updateCategory(categoryID, {
			name
		}).pipe(
			map(response => {
				if (response.status === 200) {
					toast.success("Đã thay đổi thể loại thành công!");
					refreshCategories();
					setIsModify(false);
				}
			}),
			catchError(errors => {
				toast.error("Có lỗi xảy ra vui lòng thử lại!");

				return of(errors);
			})
		)
	})

	return (
		<div className='mt-5'>
			<div className="flex items-center justify-between mb-5">
				<h1 className="mb-5 font-semibold">Quản lý thể loại </h1>
				<Button color="primary" onClick={() => setIsCreate(true)}>Thêm thể loại</Button>
			</div>

			{
				isModify ? (
					<div className="my-5 bg-white rounded-md shadow-sm p-5">
						<form className="flex gap-x-2 items-center" onSubmit={handleSubmit(onSubmitUpdateCategory)}>
							<Input size="sm" label="Tên thể loại" placeholder="Điền tên thể loại" {...register("name", { required: true })} errorMessage={errors.name?.message} />

							<Button type="submit" color="secondary">Đổi tên thể loại</Button>
						</form>
					</div>
				) : null
			}

			{
				isCreate ? (
					<div className="my-5 bg-white rounded-md shadow-sm p-5">
						<form className="flex gap-x-2 items-center" onSubmit={handleSubmitCreate(onSubmitCreateCategory)}>
							<Input size="sm" label="Tên thể loại" placeholder="Điền tên thể loại" {...registerCreate("name", { required: true })} errorMessage={errorCreate.name?.message} />

							<Button type="submit" color="secondary">Thêm thể loại</Button>
						</form>
					</div>
				) : null
			}

			<Table>
				<TableHeader>
					<TableColumn>ID</TableColumn>
					<TableColumn>Thể loại</TableColumn>
					<TableColumn>Chỉnh sửa</TableColumn>
				</TableHeader>
				<TableBody emptyContent="Chưa có thể loại nào">
					{
						categories ? categories.sort((a, b) => a.id - b.id).map(cate => {
							return (
								<TableRow key={cate.id}>
									<TableCell>
										<p className="font-semibold underline cursor-pointer hover:text-blue-500 line-clamp-1" onClick={() => navigate("/category/" + cate.id)}>{cate.id}</p>
									</TableCell>

									<TableCell>
										<div className="flex gap-x-1">
											{cate.name}
										</div>
									</TableCell>

									<TableCell>
										<div className="flex gap-x-2">
											<Tooltip content="Chỉnh sửa thể loại">
												<span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => {
													setCategoryID(cate.id);
													setIsModify(true);
												}}>
													<IconEdit />
												</span>
											</Tooltip>

											<Tooltip content="Xoá thể loại">
												<span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => deleteCategory(cate.id)}>
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
		</div>
	);
};

export default CategoryManagePage;
