import { useEffect, useState } from "react";
import TaskModal from "../../components/Modals/TaskModal";
import TaskCard from "../../components/Reusable/TaskCard";
import { useTasks } from "@/hooks/TasksHooks/tasksHooks";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Loader from "@/components/Reusable/Loader";

type FilterStatus = "all" | "in_progress" | "todo" | "blocked" | "done";

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: "All",         value: "all"         },
  { label: "In progress", value: "in_progress" },
  { label: "To do",       value: "todo"        },
  { label: "Blocked",     value: "blocked"     },
  { label: "Done",        value: "done"        },
];

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  "in_progress": { label: "In progress", bg: "bg-blue-50",   text: "text-blue-700"    },
  "todo":        { label: "To do",       bg: "bg-neutral-100", text: "text-neutral-600" },
  "blocked":     { label: "Blocked",     bg: "bg-red-50",    text: "text-red-700"     },
  "done":        { label: "Done",        bg: "bg-emerald-50", text: "text-emerald-700" },
};

const PRIORITY_DOT: Record<string, string> = {
  high:   "bg-red-400",
  medium: "bg-amber-400",
  low:    "bg-neutral-400",
};

function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tasks = [], isLoading } = useTasks(id);

  const [tasksData, setTasksData]       = useState<any[]>([]);
  const [baseTasks, setBaseTasks]       = useState<any[]>([]);
  const [filter, setFilter]             = useState<FilterStatus>("all");
  const [open, setOpen]                 = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    const filtered = tasks.filter((t: any) => t.project_id === id);
    setTasksData(filtered);
    setBaseTasks(filtered);
  }, [tasks, id]);

  const filtered =
    filter === "all" ? tasksData : tasksData.filter((t) => t.status === filter);

  const stats = {
    total:      tasksData.length,
    inProgress: tasksData.filter((t) => t.status === "in-progress").length,
    blocked:    tasksData.filter((t) => t.status === "blocked").length,
    done:       tasksData.filter((t) => t.status === "done").length,
  };

  const handleSearch = (value: string) => {
    if (value.trim() === "") { setTasksData(baseTasks); return; }
    const q = value.toLowerCase();
    setTasksData(
      baseTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 p-6">
        <Header />
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">

      <Header/>

      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600
                     hover:text-neutral-900 transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Projects
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-medium text-neutral-900">Sprint 4 tasks</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            {tasksData.length} task{tasksData.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex items-center">
            <svg
              width="14" height="14" viewBox="0 0 16 16" fill="none"
              className="absolute left-2.5 pointer-events-none text-neutral-400"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search tasks…"
              onChange={(e) => handleSearch(e.target.value)}
              className="h-[34px] w-48 rounded-lg border border-neutral-200 bg-white
                         pl-8 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400
                         transition-all focus:border-neutral-400 focus:outline-none
                         focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            onClick={() => { setSelectedTask(null); setOpen(true); }}
            className="flex h-[34px] items-center gap-1.5 rounded-lg bg-blue-700 px-4
                       text-sm font-medium text-white transition-colors hover:bg-blue-800 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Add task
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {[
          { label: "Total",       value: stats.total,      color: "text-neutral-900" },
          { label: "In progress", value: stats.inProgress, color: "text-blue-700"    },
          { label: "Blocked",     value: stats.blocked,    color: "text-red-700"     },
          { label: "Done",        value: stats.done,       color: "text-emerald-700" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-3"
          >
            <p className="mb-1 text-xs text-neutral-400">{label}</p>
            <p className={`text-2xl font-medium ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer ${
              filter === value
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.2" />
              <path d="M6 9h6M9 6v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-sm">No tasks here yet</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {filtered.map((task) => (
            <div
              key={task.id}
              onClick={() => { setSelectedTask(task); setOpen(true); }}
              className="flex cursor-pointer items-start gap-3
                         px-4 py-3 transition-colors hover:border-neutral-300"
            >
             <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}

      {open && (
        <TaskModal
          projectId={id ?? ""}
          task={selectedTask}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

export default TaskPage;