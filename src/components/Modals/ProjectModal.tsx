import { useCreateProject, useUpdateProject } from "@/hooks/projectHooks/projectHooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ModalProps {
  onClose: () => void;
  initialData?: ProjectFormValues & { id?: number };
  isEdit?: boolean;
}

const projectSchema = z.object({
  name:        z.string().min(1, "Name is required").max(60),
  description: z.string().min(1, "Description is required").max(200),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

function ProjectModal({ onClose, initialData, isEdit = false }: ModalProps) {
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name:        initialData?.name        ?? "",
      description: initialData?.description ?? "",
    },
  });

  const nameLen = watch("name")?.length        ?? 0;
  const descLen = watch("description")?.length ?? 0;

  const onSubmit = async (data: ProjectFormValues) => {
    if (isEdit && initialData?.id) {
      updateProject({ id: initialData.id, ...data });
    } else {
      createProject(data);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-2
                      rounded-2xl border border-neutral-200 bg-white duration-200">

        {/* Header */}
        <div className="flex items-start gap-3 px-5 pb-0 pt-5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                          ${isEdit ? "bg-amber-50" : "bg-blue-50"}`}>
            {isEdit ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 1.5l3 3-9.5 9.5H2v-3L11.5 1.5z"
                  stroke="#854F0B" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="#185FA5" strokeWidth="1.3"/>
                <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="#185FA5" strokeWidth="1.3"/>
                <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="#185FA5" strokeWidth="1.3"/>
                <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="#185FA5" strokeWidth="1.3"/>
              </svg>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-sm font-medium text-neutral-900">
              {isEdit ? "Edit project" : "New project"}
            </h2>
            <p className="text-xs text-neutral-400">
              {isEdit ? "Update your project details" : "Fill in the details to get started"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                       border border-neutral-200 text-neutral-400 transition-colors
                       hover:bg-neutral-50 hover:text-neutral-600"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="mx-5 my-4 border-t border-neutral-100" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 px-5 pb-4">

            {/* Name field */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-600">
                  Project name <span className="text-red-600">*</span>
                </label>
                <span className="text-xs text-neutral-400">{nameLen} / 60</span>
              </div>
              <input
                {...register("name")}
                placeholder="e.g. Acme Dashboard"
                className={`w-full rounded-lg border px-3 py-2 text-sm text-neutral-900
                            placeholder-neutral-400 outline-none transition-all
                            focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10
                            ${errors.name
                              ? "border-red-400 ring-2 ring-red-400/10"
                              : "border-neutral-200 hover:border-neutral-300"}`}
              />
              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description field */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-600">
                  Description <span className="text-red-600">*</span>
                </label>
                <span className="text-xs text-neutral-400">{descLen} / 200</span>
              </div>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="What is this project about?"
                className={`w-full resize-none rounded-lg border px-3 py-2 text-sm
                            text-neutral-900 placeholder-neutral-400 outline-none
                            transition-all focus:border-blue-500 focus:ring-2
                            focus:ring-blue-500/10
                            ${errors.description
                              ? "border-red-400 ring-2 ring-red-400/10"
                              : "border-neutral-200 hover:border-neutral-300"}`}
              />
              {errors.description && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-neutral-100 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm
                         font-medium text-neutral-500 transition-colors
                         hover:bg-neutral-50 hover:text-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2
                         text-sm font-medium text-white transition-opacity
                         hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSubmitting ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2
                                border-white/30 border-t-white" />
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
              {isSubmitting
                ? (isEdit ? "Saving…" : "Creating…")
                : (isEdit ? "Save changes" : "Create project")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectModal;