import * as yup from 'yup';

export const registerSchema = yup.object().shape({
    name: yup.string().min(5, "Minimum of 5 characters required")
    .required("Name required"),
    email: yup.string().email("Email not valid").required("Email required"),
    password: yup.string().min(6, "Password require minimum of 6 characters")
    .required("Password required")
});


export const loginSchema = yup.object().shape({
    email: yup.string().email("Email not valid").required("Email required"),
    password: yup.string().min(6, "Password require minimum of 6 characters")
    .required("Password required")
});


export const categorySchema = yup.object().shape({
    name: yup.string().min(5, "Minimum of 5 characters required")
    .required("Name required"),
    description: yup.string().min(15, "Minimum of 15 characters required")
    .required("Description required"),
});


export const postSchema = yup.object().shape({
    title: yup.string().min(5, "Minimum character of 5 required!").required("Title is required!"),
    // slug: yup.string().min(5, "Minimum character of 5 required!").required("Slug is required!"),
    body: yup.string().min(15, "Minimum character of 15 required!").required("Body is required!"),
    categories: yup.string().min(5, "Minimum character of 5 required!").required("Category is required!"),
    author: yup.string().min(24, "Minimum character of 24 HEXADECIMAL values required!").required("author is required!"),
});