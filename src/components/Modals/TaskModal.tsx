import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateTask, useUpdateTask } from "../../hooks/TasksHooks/tasksHooks";

interface TaskModalProps {
  projectId: string;
  task?: any;
  onClose: () => void;
}

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").min(3, "Title must be at least 3 characters"),
  description: z.string(),
  status: z.enum(["todo", "in_progress", "done"] as const),
  priority: z.enum(["low", "medium", "high"] as const),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const STATUS_OPTIONS = [
  { value: "todo",        label: "To do",       dot: "bg-gray-400",    checked: "border-gray-500 bg-gray-50 text-gray-800"   },
  { value: "in_progress", label: "In progress", dot: "bg-blue-500",    checked: "border-blue-600 bg-blue-50 text-blue-800"   },
  { value: "done",        label: "Done",        dot: "bg-emerald-500", checked: "border-emerald-600 bg-emerald-50 text-emerald-800" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "low",    label: "Low",    dot: "bg-emerald-500", checked: "border-emerald-600 bg-emerald-50 text-emerald-800" },
  { value: "medium", label: "Medium", dot: "bg-amber-400",   checked: "border-amber-600 bg-amber-50 text-amber-800"     },
  { value: "high",   label: "High",   dot: "bg-red-500",     checked: "border-red-600 bg-red-50 text-red-800"           },
] as const;

function SegmentGroup({
  name,
  options,
  register,
  watch,
  error,
}: {
  name: "status" | "priority";
  options: typeof STATUS_OPTIONS | typeof PRIORITY_OPTIONS;
  register: any;
  watch: any;
  error?: any;
}) {
  const current = watch(name);
  return (
    <div>
      <div className="grid grid-cols-3 gap-1.5">
        {options.map((opt) => {
          const isChecked = current === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2
                          text-xs font-medium transition-all select-none
                          ${isChecked
                            ? `border-[1.5px] ${opt.checked}`
                            : "border-neutral-200 text-neutral-500 hover:border-neutral-300"}`}
            >
              <input
                type="radio"
                value={opt.value}
                {...register(name)}
                className="sr-only"
              />
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${opt.dot}`} />
              {opt.label}
            </label>
          );
        })}
      </div>
      {error && <span className="mt-1.5 text-xs text-red-500">{error.message}</span>}
    </div>
  );
}


function TaskModal({ projectId, task, onClose }: TaskModalProps) {
  const isEdit = !!task;
  const { mutate: createTask, isPending: creating } = useCreateTask();
  const { mutate: updateTask, isPending: updating  } = useUpdateTask();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: (task ?? { title: "", description: "", status: "todo", priority: "medium" }) as TaskFormValues,
  });

  const onSubmit = (data: TaskFormValues) => {
    if (isEdit) {
      updateTask({ id: task.id, project_id: projectId, data });
    } else {
      createTask({ ...data, project_id: projectId });
    }
    onClose();
  };

  const isSaving = creating || updating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[420px] overflow-hidden rounded-2xl border
                      border-neutral-200 bg-white animate-in fade-in
                      slide-in-from-bottom-2 duration-200">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                          ${isEdit ? "bg-amber-50" : "bg-blue-50"}`}>
            {isEdit ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10.5 1.5l4 4-9 9H2v-4l8.5-9z"
                  stroke="#854F0B" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="5" rx="1.2" stroke="#185FA5" strokeWidth="1.3"/>
                <rect x="9" y="2" width="5" height="5" rx="1.2" stroke="#185FA5" strokeWidth="1.3"/>
                <rect x="2" y="9" width="5" height="5" rx="1.2" stroke="#185FA5" strokeWidth="1.3"/>
                <path d="M9 11.5h5M11.5 9v5" stroke="#185FA5" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">
              {isEdit ? "Edit task" : "New task"}
            </p>
            <p className="text-xs text-neutral-400">
              {isEdit ? "Update task details" : "Add a task to this project"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                       border border-neutral-200 text-neutral-400 transition-colors
                       hover:bg-neutral-50 hover:text-neutral-600 cursor-pointer"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 1l9 9M10 1L1 10" stroke="currentColor"
                strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 px-5 py-5">

            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">
                Task title
              </label>
              <input
                {...register("title")}
                placeholder="e.g. Fix auth token expiry"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm
                           text-neutral-900 placeholder-neutral-400 outline-none
                           transition-all hover:border-neutral-300
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
              {errors.title && <span className="mt-1 block text-xs text-red-500">{errors.title.message}</span>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-500">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={2}
                placeholder="What needs to be done?"
                className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2
                           text-sm leading-relaxed text-neutral-900 placeholder-neutral-400
                           outline-none transition-all hover:border-neutral-300
                           focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
              />
              {errors.description && <span className="mt-1 block text-xs text-red-500">{errors.description.message}</span>}
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-medium text-neutral-500">Status</span>
              <SegmentGroup name="status" options={STATUS_OPTIONS} register={register} watch={watch} error={errors.status} />
            </div>

            <div>
              <span className="mb-1.5 block text-xs font-medium text-neutral-500">Priority</span>
              <SegmentGroup name="priority" options={PRIORITY_OPTIONS} register={register} watch={watch} error={errors.priority} />
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-neutral-100 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-xs
                         font-medium text-neutral-500 transition-colors
                         hover:bg-neutral-50 hover:text-neutral-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2
                         text-xs font-medium text-white transition-opacity
                         hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              {isSaving ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2
                                border-white/30 border-t-white" />
              ) : (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M5.5 1v9M1 5.5h9" stroke="white"
                    strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
              {isSaving ? "Saving…" : isEdit ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;