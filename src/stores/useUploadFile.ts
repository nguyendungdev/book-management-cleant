import FileRepository from '@/api/repositories/FileRepository';
import { useCallApi } from '@/hooks/useCallApi';
import { FileUploadResponse } from '@/typings/profile';
import { toast } from 'react-toastify';
import { catchError, map, of } from 'rxjs';

const useUploadFile = () => {
	const { run: uploadFile } = useCallApi((file: File, callback?: (file: FileUploadResponse) => void) => {
		const toastLoading = toast.loading("Đang tải file lên...");

		return FileRepository.uploadFile(file).pipe(
			map(response => {
				toast.dismiss(toastLoading);
				if (response.status === 201) {
					toast.success("Tải file lên thành công!");
					callback && callback(response.data);
				}
			}),
			catchError(errors => {
				toast.dismiss(toastLoading);

				toast.error("Có lỗi xảy ra vui lòng thử lại!");

				return of(errors);
			})
		)
	});

	async function uploadFileWrapper(file: File) {
		return new Promise<FileUploadResponse>((resolve) => {
			uploadFile(file, (res) => {
				resolve(res);
			})
		})
	}

	return uploadFileWrapper;
};

export default useUploadFile;
