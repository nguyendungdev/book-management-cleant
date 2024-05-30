import { useState } from 'react';

const useControllerInput = (initialValue: string = "") => {
	const [value, setValue] = useState(initialValue);

	const onChangeValue = (value: string) => {
		setValue(value);
	}

	return { value, onChangeValue }
};

export default useControllerInput;
