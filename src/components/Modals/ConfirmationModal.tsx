
function ConfirmDeleteModal({
  projectName,
  onConfirm,
  onCancel,
}: {
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-80 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-5 w-5 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 16 16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 6v3M8 11v.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.5 13.5h9a1 1 0 0 0 .87-1.5l-4.5-8a1 1 0 0 0-1.74 0l-4.5 8a1 1 0 0 0 .87 1.5z"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-sm font-semibold text-gray-900">
          Delete project?
        </h3>
        <p className="mb-5 text-sm text-gray-500">
          <span className="font-medium text-gray-800">{projectName}</span> will
          be permanently removed. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;