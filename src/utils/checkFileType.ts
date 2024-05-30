
export enum FileType {
	IMAGE = "image",
	DOCUMENT = "document"
}

export default function checkFileType(file: string) {
	const fileExtension = file.split(".").at(-1);

	return (fileExtension === "jpg" || fileExtension === "png" || fileExtension === "jpeg") ? FileType.IMAGE : FileType.DOCUMENT
}
