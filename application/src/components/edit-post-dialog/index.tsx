import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { editPost } from "../../slices/postsSlice";
import { Post } from "../../slices/postsSlice";
import { toast } from "sonner";
import { XCircleIcon } from "lucide-react";

interface EditPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

const EditPostDialog: FC<EditPostDialogProps> = ({ isOpen, onClose, post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    post.imageUrl ? `http://localhost:3000${post.imageUrl}` : null
  );

  const initialValues = {
    title: post.title,
    description: post.description,
    tags: post.tags,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required").min(10),
    tags: Yup.string().required("Tags are required"),
  });

  const handleSubmit = async (
    values: typeof initialValues,
    { resetForm }: FormikHelpers<typeof initialValues>
  ) => {
    setLoading(true);

    const updatedData = {
      postId: post._id,
      title: values.title,
      description: values.description,
      tags: values.tags,
      image: file || undefined,
    };

    dispatch(editPost(updatedData))
      .unwrap()
      .then(() => {
        toast.success("Post updated successfully!");
        resetForm();
        setFile(null);
        setPreview(`http://localhost:3000${post.imageUrl}`);
        onClose();
      })
      .catch(() => toast.error("Failed to update post"))
      .finally(() => setLoading(false));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <DialogTitle className="text-2xl font-semibold text-center">
          Edit Post
        </DialogTitle>
        <DialogDescription className="text-center text-gray-500 mb-6">
          Modify the fields below to update your post.
        </DialogDescription>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-5">
            <div>
              <Field
                name="title"
                type="text"
                placeholder="Title"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="description"
                as="textarea"
                placeholder="Description"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="tags"
                type="text"
                placeholder="Tags (comma-separated)"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage
                name="tags"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Image
              </label>
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    aria-label="Remove image"
                  >
                    <XCircleIcon size={24} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-50">
                  <span>Click to upload an image</span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className={`${
                  loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
                } w-full sm:w-auto text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Post"}
              </button>
            </div>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default EditPostDialog;
