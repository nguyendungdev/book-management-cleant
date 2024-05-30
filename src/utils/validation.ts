import * as yup from 'yup';

const schemaSignInValidation = yup.object().shape({
  email: yup.string().required('Email không được bỏ trống!').email('Email không hợp lệ!'),
  password: yup
    .string()
    .required('Mật khẩu không được bỏ trống!')
    .min(3, 'Mật khẩu phải ít nhất 3 kí tự!'),
});

const schemaSignUpValidation = yup.object().shape({
  email: yup.string().required('Email không được bỏ trống!').email('Email không hợp lệ!'),
  password: yup
    .string()
    .required('Mật khẩu không được bỏ trống!')
    .min(3, 'Mật khẩu phải ít nhất 3 kí tự!'),
  firstName: yup.string().required('Tên không được bỏ trống!'),
  lastName: yup.string().required('Họ không được bỏ trống!'),
  confirmPassword: yup
    .string()
    .required('Mật khẩu không được bỏ trống!')
    .min(3, 'Mật khẩu phải ít nhất 3 kí tự!'),
});

const schemaChangeProfileInfoValidation = yup.object().shape({
  firstName: yup.string().required('Tên không được bỏ trống!'),
  lastName: yup.string().required('Họ không được bỏ trống!'),
});

const schemaChangePasswordValidation = yup.object().shape({
  password: yup
    .string()
    .required('Mật khẩu mới không được bỏ trống!')
    .min(3, 'Mật khẩu mới phải ít nhất 3 kí tự!'),
  confirmPassword: yup
    .string()
    .required('Mật khẩu xác nhận không được bỏ trống!')
    .min(3, 'Mật khẩu xác nhận phải ít nhất 3 kí tự!'),
  oldPassword: yup
    .string()
    .required('Mật khẩu cũ không được bỏ trống!')
    .min(3, 'Mật khẩu cũ phải ít nhất 3 kí tự!'),
});

const schemaForgotPasswordValidation = yup.object().shape({
  email: yup.string().required('Email không được bổ trống!').email('Email không hợp lệ'),
});

const schemaResetPasswordValidation = yup.object().shape({
  password: yup
    .string()
    .required('Mật khẩu mới không được bỏ trống!')
    .min(3, 'Mật khẩu mới phải ít nhất 3 kí tự!'),
  confirmPassword: yup
    .string()
    .required('Mật khẩu xác nhận không được bỏ trống!')
    .min(3, 'Mật khẩu xác nhận phải ít nhất 3 kí tự!'),
});

const schemeUploadPostValidation = yup.object().shape({
  name: yup.string().required("Tiêu đề không được bỏ trống!"),
  description: yup.string().required("Mô tả không được bỏ trống!"),
  ingredients: yup.string().required("Nguyên liệu không được bỏ trống!")
});

const schemaCreateReviewPostValidation = yup.object().shape({
  title: yup.string().required("Tiêu đề đánh giá không được bỏ trống!").min(3, "Tiêu đề đánh giá phải hơn 3 kí tự"),
  description: yup.string().required("Mô tả đánh giá không được bỏ trống!").min(5, "Mô tả đánh giá phải hơn 5 kí tự")
})

export {
  schemaChangePasswordValidation,
  schemaChangeProfileInfoValidation,
  schemaCreateReviewPostValidation,
  schemaForgotPasswordValidation,
  schemaResetPasswordValidation,
  schemaSignInValidation,
  schemaSignUpValidation,
  schemeUploadPostValidation
};

