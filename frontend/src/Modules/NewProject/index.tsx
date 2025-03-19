import InputField from "Shared/components/input-field";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { doStartProjectSession } from "./fetch";
import { useNavigate } from "react-router-dom";
import { formatAndShowAxiosError } from "Shared/utils/errors";

function NewProjectPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useFormik<{ title: string }>({
    initialValues: {
      title: "",
    },
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });
  const mutation = useMutation({
    mutationFn: doStartProjectSession,
    onSuccess: (data) => {
      navigate(`/projects/${data.data.slug}`);
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', data.data.slug] });
    },
    onError: (error) => formatAndShowAxiosError(error),
  });
  return (
    <main>
      <section className='flex justify-center max-w-[800px] mx-auto mt-80'>
        <div className='text-3xl tracking-tighter leading-9 text-center text-neutral-950 max-sm:text-2xl max-sm:leading-8'>
          <span>Welcome,</span>
          <span className='text-neutral-950'>User</span>
          <span>.</span>
          <p className='mt-1 text-zinc-500'>What are we building today?</p>
        </div>
      </section>
      <form
        onSubmit={form.handleSubmit}
        className='fixed bottom-20 w-screen flex justify-center items-center -mx-10'
      >
        <InputField
          id='title'
          {...form.getFieldProps("title")}
          submitting={mutation.isPending}
        />
      </form>
    </main>
  );
}

export default NewProjectPage;
