"use client"

import { CreatePost } from "@/model/createPost";
import { Post } from "@/model/post";
import { url } from "@/util/url";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { toast } from "react-toastify";
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('title is required'),
  body: Yup.string().required('body is required'),
});

export default function Home() {
  const queryClient = useQueryClient();
  const key = 'posts';

  const formik = useFormik({
    initialValues: { title: '', body: '' },
    validationSchema: validationSchema,
    onSubmit: (newPost: CreatePost) => {
      mutation.mutate(newPost);
    },
  });

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: [key],
    queryFn: () => axios.get(url),
    staleTime: 60 * 1000,
  })

  const mutation = useMutation({
    mutationFn: (newPost: CreatePost) => {
      return axios.post(url, newPost);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: [key] })
      formik.resetForm();
      toast.success("Post sent")
    },
    onError: (error, variables, context) => {
      console.log(`rolling back optimistic update with id ${error.message}`)
      toast.error("something went wrong, please try again")
      formik.setSubmitting(false)
    }
  })

  const isDisable = (formik.touched.body && formik.touched.title && !formik.isValid) || formik.isSubmitting;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-20 flex flex-col items-center w-full max-w-lg">
        <h1 className="text-2xl w-100 mb-3">
          Create New Post
        </h1>
        <form className="w-full" onSubmit={formik.handleSubmit}>
          <div className="flex flex-col pb-3 mb-3 relative">
            <label htmlFor="title">title</label>
            <input
              className="bg-transparent mb-3 border rounded p-3"          
              name="title"
              id="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} />
              {formik.touched.title && formik.errors.title && (
                <small className="text-red-500 absolute bottom-0">{formik.errors.title}</small>
              )}
          </div>
          <div className="flex flex-col pb-3 mb-3 relative">
            <label htmlFor="body">body</label>
            <textarea 
              className="bg-transparent mb-3 border rounded p-3 h-40"          
              name="body"
              id="body"
              value={formik.values.body}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}>
            </textarea>
            {formik.touched.body && formik.errors.body && (
              <small className="text-red-500 absolute bottom-0">
                {formik.errors.body}
              </small>
            )}
          </div>
          
          <button 
            disabled={isDisable}
            type="submit"
            className={`w-full bg-blue-500 rounded p-3 transition ${
              isDisable
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-700'
            }`}>
              {mutation.isPending ? 'Submiting' : 'Submit'}
          </button>
        </form>
      </div>

      <div className="max-w-3xl">
        <h1 className="text-2xl w-100 text-center mb-3">
          Posts
        </h1>
        <div className="text-center">
          {(isPending || isFetching) && 'Loading...'}
          {(error && 'An error has occurred: ' + error?.message)}
          {
            // data?.data && console.log(data)
            data?.data &&

            data?.data.map((d: Post) =>
              <Link 
                key={d.id}
                href={d.id.toString()}
                className="border rounded transition flex justify-between mb-3 p-3 hover:border-sky-500">
                <p>
                  {d.title}
                </p>

                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </Link>
            )
          }
        </div>
      </div>
    </div>
  )
}
