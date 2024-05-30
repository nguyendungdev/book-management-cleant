import PostRepository from "@/api/repositories/PostRepository";
import { useCallApi } from "@/hooks/useCallApi";
import useCategoriesStore from "@/stores/useCategoriesStore";
import useUploadFile from "@/stores/useUploadFile";
import { Post } from "@/typings/post";
import { schemeUploadPostValidation } from "@/utils/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useEffect, useState } from "react";
import FileUploading from 'react-files-uploading';
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { catchError, map, of } from "rxjs";

interface EditPost {
	name: string;
	description: string;
	ingredients: string;

}

const EditPostPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const uploadFile = useUploadFile();
	const [categories, setCategories] = useState<any>([]);
	const [thumbnail, setThumbnails] = useState<File[]>([]);
	const { categories: categoriesList } = useCategoriesStore();
	const [defaultPost, setDefaultPost] = useState<Post | undefined>(undefined);

	const { register, handleSubmit, formState: { errors } } = useForm({
		mode: "onChange",
		defaultValues: {
			name: defaultPost ? defaultPost.name : "",
			description: defaultPost ? defaultPost.description : "",
			ingredients: defaultPost ? defaultPost.description : "",

		},
		values: {
			name: defaultPost ? defaultPost.name : "",
			description: defaultPost ? defaultPost.description : "",
			ingredients: defaultPost ? defaultPost.description : "",
		},
		resolver: yupResolver(schemeUploadPostValidation)
	});

	const onSubmitEditPost: SubmitHandler<EditPost> = async (value) => {
		if (!id) return;

		let thumbnailID: string | undefined = undefined;
		const thumbnailInArr = thumbnail.at(0);


		if (thumbnail.length !== 0 && thumbnailInArr) {
			thumbnailID = (await uploadFile(thumbnailInArr)).id
		}

		editPost(id, value, thumbnailID);
	}

	const { run: getDefaultPost } = useCallApi((id: string) => {
		return PostRepository.getPostByID(id).pipe(
			map(response => {
				if (response.status === 200) {
					setDefaultPost(response.data);
				}
			})
		)
	});

	const { run: editPost } = useCallApi((id: string, editPost: EditPost, thumbnailID?: string) => {
		const toastLoading = toast.loading("Chỉnh sửa bài đăng...");

		return PostRepository.updatePost(id, {
			...editPost,
			category: categories.length !== 0 ? Array.from(categories).map(i => Number(i)) : undefined,

			thumbnail: thumbnailID ? {
				id: thumbnailID
			} : undefined
		}).pipe(
			map(response => {
				toast.dismiss(toastLoading);
				if (response.status === 200) {
					toast.success("Chỉnh sửa bài đăng thành công!");

					return navigate("/post-manager")
				}
			}),
			catchError(errors => {
				toast.dismiss(toastLoading);

				return of(errors);
			})
		)
	})

	useEffect(() => {
		if (!id) return;

		getDefaultPost(id);
	}, [id]);

	return (
		<form onSubmit={handleSubmit(onSubmitEditPost)}>
			<div className="flex flex-col bg-white p-5 mt-5 gap-y-3">
				<h1 className="mt-5 font-semibold">Chỉnh sửa công thức</h1>
				<div className="flex gap-y-2 flex-col">
					<Input label="Tiêu đề công thức" placeholder="Điền tiêu đề công thức" variant="flat" className="text-black" {...register("name", { required: true })} errorMessage={errors.name?.message} />
					<Textarea label="Mô tả công thức" variant="flat" className="text-black" {...register("description", { required: true })} errorMessage={errors.description?.message} />
					<Textarea label="Nguyên liệu" variant="flat" className="text-black" {...register("ingredients", { required: true })} errorMessage={errors.ingredients?.message} />
					<Select
						label="Thể loại"
						selectionMode="multiple"
						placeholder="Chọn thể loại món ăn"
						selectedKeys={categories}
						onSelectionChange={(key) => setCategories(key)}
					>
						{categoriesList ? categoriesList.map((cate) => (
							<SelectItem key={cate.id} value={cate.id}>
								{cate.name}
							</SelectItem>
						)) : []}
					</Select>
				</div>

				<div className="mt-3 flex gap-x-2">
					<FileUploading
						multiple={false}
						value={thumbnail ?? []}
						onChange={files => setThumbnails(files)}
					>
						{({ fileList, onFileUpload, onFileRemoveAll, dragProps }) => {
							return (
								<Button
									onClick={fileList.length === 0 ? onFileUpload : onFileRemoveAll}
									color='primary'
									{...dragProps}
								>
									{fileList.length === 0 ? 'Upload thumbnail' : 'Xoá thay đổi'}
								</Button>
							);
						}}
					</FileUploading>


				</div>

				<div className="flex items-center justify-end">
					<Button type="submit" color="secondary">Tải lên</Button>
				</div>
			</div>
		</form>
	);
};

export default EditPostPage;
