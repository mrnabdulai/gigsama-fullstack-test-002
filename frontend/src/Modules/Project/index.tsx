import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatAndShowAxiosError } from "Shared/utils/errors";
import { doAskQuestion, doGenerateSchema, getProject } from "./fetch";
import InputField from "Shared/components/input-field";
import { useFormik } from "formik";
import _ from "lodash";
import { IProject } from "./typings";
import { showToast } from "Shared/utils/alert";
import JsonSchemaDisplay from "Shared/components/schema-viewer";

const ProjectChatPage: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useFormik<{ answer: string }>({
    initialValues: {
      answer: "",
    },
    onSubmit: (values) => {
      queryClient.setQueryData(
        ["project", slug],
        (data: AxiosResponse<IProject>) => {
          return {
            ...data,
            data: {
              ...data.data,
              aiSessions: [
                ...data.data.aiSessions.slice(0, -1),
                {
                  question:
                    data.data.aiSessions[data.data.aiSessions.length - 1]
                      .question,
                  answer: values.answer,
                  createdAt: new Date(),
                },
              ],
            },
          };
        }
      );
      submitAnswerMutation.mutate({
        answer: values.answer,
        projectId: query.data?.data._id!,
      });
    },
  });
  const submitAnswerMutation = useMutation({
    mutationFn: doAskQuestion,
    onSuccess: (data) => {
      navigate(`/projects/${data.data.slug}`);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.data.slug] });
      form.setFieldValue("answer", "");
      if (data.data.isComplete) {
        generateSchemaMutation.mutate({
          projectId: query.data?.data._id!,
        });
      }
    },
    onError: (error) => {
      formatAndShowAxiosError(error);
      queryClient.setQueryData(
        ["project", slug],
        (data: AxiosResponse<IProject>) => {
          return {
            ...data,
            data: {
              ...data.data,
              aiSessions: [
                ...data.data.aiSessions.slice(0, -1),
                {
                  question:
                    data.data.aiSessions[data.data.aiSessions.length - 1]
                      .question,
                  answer: "",
                  createdAt: new Date(),
                },
              ],
            },
          };
        }
      );
    },
  });
  const { slug } = useParams();
  const query = useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProject(slug!),
    enabled: !!slug,
    throwOnError: (error: AxiosError | any) => {
      formatAndShowAxiosError(error);
      return false;
    },
  });

  const generateSchemaMutation = useMutation({
    mutationFn: doGenerateSchema,
    onSuccess: (_) => {
      showToast({
        type: "success",
        title: "Schema Generated Successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["project", slug] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      formatAndShowAxiosError(error, {}, "Failed to generate schema");
    },
  });

  useEffect(() => {
    if (!slug) {
      navigate("/");
    }
  }, [slug]);

  if (query.isLoading) {
    return (
      <div className='flex font-semibold text-2xl my-40 w-full justify-center items-center'>
        Loading...
      </div>
    );
  }
  return (
    <main>
      <div className=''>
        {/* The schema goes here */}
        <div className='min-h-[360px] overflow-y-auto max-w-[1000px] rounded mb-5 mx-auto'>
          <div className='bg-white rounded-lg p-4'>
            {generateSchemaMutation.isPending ? (
              <div className='flex items-center flex-col gap-5 justify-center h-full mt-10'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-black'></div>
                <p className='text-sm'>Generating schema...</p>
              </div>
            ) : !query.data?.data?.schemaJson ? (
              <div className='flex items-center flex-col gap-5 justify-center h-full mt-10'>
                <p className='text-sm text-gray-500'></p>
              </div>
            ) : (
              <div className='flex flex-col'>
                <JsonSchemaDisplay
                  schemaData={{
                    schemaJson: query.data?.data?.schemaJson,
                    schemaText: query.data?.data?.schemaText,
                  }}
                />
                <div className='flex justify-center md:justify-end mt-4'>
                  <button
                    type='button'
                    onClick={() => {
                      // Create a blob with the schema JSON
                      const jsonString = JSON.stringify(
                        query.data?.data?.schemaJson || {},
                        null,
                        2
                      );
                      const blob = new Blob([jsonString], {
                        type: "application/json",
                      });
                      // Create a URL for the blob
                      const url = URL.createObjectURL(blob);
                      // Create a temporary anchor element
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${
                        query.data?.data?.title || "schema"
                      }.json`;
                      // Trigger the download
                      document.body.appendChild(a);
                      a.click();
                      // Clean up
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className='px-4 py-2 bg-black text-white rounded-md hover:bg-black/80 transition-colors flex items-center gap-2 text-sm w-[90%] md:justify-start justify-center md:w-auto'
                  >
                    Save
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                    
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke='currentColor'
                      className='size-4'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='max-w-[800px] max-h-[360px] overflow-y-auto mx-auto space-y-4 mb-[40px] flex flex-col justify-center items-center'>
          {query.data?.data?.aiSessions &&
            query.data.data.aiSessions.length > 0 && (
              <>
                {/* Show answer from second-to-last session if last session has no answer */}
                {query.data.data.aiSessions.length > 1 &&
                  !_.last(query.data.data.aiSessions)?.answer &&
                  query.data.data.aiSessions[
                    query.data.data.aiSessions.length - 2
                  ]?.answer && (
                    <div className='px-5 py-2.5 bg-[#e8e8e8]/50 rounded-2xl inline-flex justify-center items-center gap-2.5 mb-5'>
                      <p className='justify-center text-[#0d0d0d] text-sm font-normal leading-normal'>
                        {
                          query.data.data.aiSessions[
                            query.data.data.aiSessions.length - 2
                          ].answer
                        }
                      </p>
                    </div>
                  )}
                {/* Show last session's question if it exists */}
                {_.last(query.data.data.aiSessions)?.question && (
                  <div className='px-3 py-2 inline-flex justify-start items-center gap-2.5'>
                    <p className=' justify-center text-[#0d0d0d] text-sm font-normal leading-7'>
                      {_.last(query.data.data.aiSessions)?.question}
                    </p>
                  </div>
                )}
                {_.last(query.data?.data?.aiSessions)?.answer && (
                  <div className='px-5 py-2.5 bg-[#e8e8e8]/50 rounded-2xl inline-flex justify-center items-center gap-2.5 mb-5'>
                    <p className='justify-center text-[#0d0d0d] text-sm font-normal leading-normal'>
                      {_.last(query.data?.data?.aiSessions)?.answer}
                    </p>
                  </div>
                )}
              </>
            )}
        </div>

        <form
          onSubmit={form.handleSubmit}
          className=' flex justify-center items-center -mx-10 sticky bottom-0 bg-white'
        >
          <InputField
            id='answer'
            {...form.getFieldProps("answer")}
            submitting={submitAnswerMutation.isPending}
            disabled={
              submitAnswerMutation.isPending ||
              generateSchemaMutation.isPending ||
              query.isLoading
            }
          />
        </form>
      </div>
    </main>
  );
};

export default ProjectChatPage;
