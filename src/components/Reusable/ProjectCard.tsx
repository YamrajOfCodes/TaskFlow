import { useState } from "react";
import ConfirmDeleteModal from "../Modals/ConfirmationModal";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}


function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => Promise<void>;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const initials = project.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/projects/${project.id}`);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-gray-300 cursor-pointer" 
        key={project.id}
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-sm font-semibold text-indigo-700">
            {initials}
          </div>
          <div className="flex gap-1">
            {/* Edit button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
              title="Edit project"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 16 16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.5 2.5a1.414 1.414 0 0 1 2 2L5 13l-3 1 1-3 8.5-8.5z"
                />
              </svg>
            </button>
            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowConfirm(true);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600 cursor-pointer"
              title="Delete project"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 16 16"
              >
                <polyline
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="2 4 14 4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 4V2h6v2M6 7v5M10 7v5"
                />
                <rect x="3" y="4" width="10" height="10" rx="1" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-gray-900">{project.name}</h3>
          <p className="text-sm leading-relaxed text-gray-500">
            {project.description}
          </p>
        </div>

        <div className="mt-auto border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-400">Created {project.createdAt}</span>
        </div>
      </div>

      {showConfirm && (
        <ConfirmDeleteModal
          projectName={project.name}
          onConfirm={() => {
            setShowConfirm(false);
            onDelete(project.id);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}

export default ProjectCard;