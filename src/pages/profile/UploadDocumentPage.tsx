import FileRepository from "@/api/repositories/FileRepository";
import PostRepository from "@/api/repositories/PostRepository";
import { useCallApi } from "@/hooks/useCallApi";
import useCategoriesStore from "@/stores/useCategoriesStore";
import { schemeUploadPostValidation } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useState } from "react";
import FileUploading from 'react-files-uploading';
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { catchError, map, of, switchMap } from "rxjs";
interface UploadPost {
	name: string;
	description: string;
	ingredients: string;
}

const UploadDocumentPage = () => {
	const [thumbnail, setThumbnail] = useState<File[]>([]);
	const [categories, setCategories] = useState<any>([]);
	const { categories: categoriesList } = useCategoriesStore();

	const { register, handleSubmit, formState: { errors } } = useForm({
		mode: "onChange",
		resolver: yupResolver(schemeUploadPostValidation),
	});

	const onSubmitUploadPost: SubmitHandler<UploadPost> = (value) => {
		const thumbnailFile = thumbnail[0];
		if (!thumbnailFile) return;
		createPost(value, thumbnailFile);
	};

	const { run: createPost } = useCallApi((infoPost: UploadPost, thumbnail: File) => {
		const toastLoading = toast.loading('Đăng bài...');
		return FileRepository.uploadFile(thumbnail).pipe(
			map((response) => {
				return response.data.id;
			}),
			switchMap((thumbnailRes) => {
				return PostRepository.createPost({
					category: Array.from(categories).map((i) => Number(i)),
					name: infoPost.name,
					description: infoPost.description,
					ingredients: infoPost.ingredients,
					thumbnail: {
						id: thumbnailRes,
					},
				}).pipe(
					map((response) => {
						toast.dismiss(toastLoading);
						if (response.status === 201) {
							toast.success("Đăng bài thành công!");
						}
					})
				);
			}),
			catchError((errors) => {
				toast.dismiss(toastLoading);
				toast.error("Có lỗi xảy ra vui lòng thử lại!");

				return of(errors);
			})
		);
	});

	return (
		<form onSubmit={handleSubmit(onSubmitUploadPost)}>
			<div className="flex flex-col bg-white p-5 mt-5 gap-y-3">
				<h1 className="mt-5 font-semibold">Tạo & chia sẻ công thức</h1>
				<div className="flex gap-y-2 flex-col">
					<Input label="Tiêu đề" variant="flat" className="text-black" {...register("name", { required: true })} errorMessage={errors.name?.message} />
					<Textarea label="Mô tả công thức" variant="flat" className="text-black" {...register("description", { required: true })} errorMessage={errors.description?.message} />
					<Textarea label="Nguyên liệu" variant="flat" className="text-black" {...register("ingredients", { required: true })} errorMessage={errors.ingredients?.message} />

					<Select
						label="Thể loại"
						selectionMode="multiple"
						placeholder="Chọn thể loại món ăn"
						selectedKeys={categories}
						onSelectionChange={(key) => setCategories(key)}
					>
						{categoriesList
							? categoriesList.map((cate) => (
								<SelectItem key={cate.id} value={cate.id}>
									{cate.name}
								</SelectItem>
							))
							: []}
					</Select>
				</div>

				<div className="mt-3 flex gap-x-2">
					<FileUploading
						multiple={false}
						value={thumbnail ?? []}
						onChange={(files) => setThumbnail(files)}
					>
						{({ fileList, onFileUpload, onFileRemoveAll, dragProps }) => {
							return (
								<Button
									onClick={fileList.length === 0 ? onFileUpload : onFileRemoveAll}
									color="primary"
									{...dragProps}
								>
									{fileList.length === 0 ? 'Upload hình ảnh' : 'Xoá thay đổi'}
								</Button>
							);
						}}
					</FileUploading>
				</div>

				<div className="flex items-center justify-end">
					<Button type="submit" color="secondary">
						Tải lên
					</Button>
				</div>
			</div>
		</form>
	);
};

export default UploadDocumentPage;
