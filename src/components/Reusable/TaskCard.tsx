import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useDeleteTask } from "@/hooks/TasksHooks/tasksHooks";

const PRIORITY_STYLES = {
  high:   { bar: "bg-red-500",    badge: "bg-red-50 text-red-700",    card: "border-l-red-500"   },
  medium: { bar: "bg-amber-400",  badge: "bg-amber-50 text-amber-700", card: "border-l-amber-400" },
  low:    { bar: "bg-emerald-500",badge: "bg-emerald-50 text-emerald-700", card: "border-l-emerald-500" },
} as const;

const STATUS_STYLES: Record<string, string> = {
  "todo":        "bg-gray-100 text-gray-600",
  "in_progress": "bg-blue-50 text-blue-700",
  "done":        "bg-emerald-50 text-emerald-700",
  "blocked":     "bg-red-50 text-red-700",
};

function TaskCard({ task, onEdit }: any) {
  const { mutate: deleteTask } = useDeleteTask();

  const priority = (task.priority?.toLowerCase() ?? "low") as keyof typeof PRIORITY_STYLES;
  const styles   = PRIORITY_STYLES[priority] ?? PRIORITY_STYLES.low;
  const statusCls = STATUS_STYLES[task.status?.toLowerCase()] ?? STATUS_STYLES["todo"];

  return (
    <div
      className={`
        group relative flex items-start gap-3 rounded-xl border border-neutral-200 md:w-xl
        bg-white px-4 py-3.5 transition-all duration-150
        hover:-translate-y-px hover:border-neutral-300 hover:shadow-sm
        border-l-[3px] ${styles.card} cursor-pointer
      `}
    >
      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-900">{task.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-neutral-500">
          {task.description}
        </p>

        {/* Badges */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusCls}`}>
            {task.status}
          </span>
          <span className="h-1 w-1 rounded-full bg-neutral-300" />
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${styles.badge}`}>
            {task.priority} priority
          </span>
        </div>
      </div>

      {/* Action buttons — visible on hover */}
      <div className="flex shrink-0 items-center gap-1 pt-0.5 opacity-0 transition-opacity duration-150 opacity-100">
        <button
          onClick={onEdit}
          title="Edit"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200
                     bg-white text-neutral-400 transition-colors hover:border-blue-200
                     hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
        >
          <PencilIcon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => deleteTask({ id: task.id, project_id: task.project_id })}
          title="Delete"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200
                     bg-white text-neutral-400 transition-colors hover:border-red-200
                     hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default TaskCard;