import React, { useState } from "react";
import FileCard from "./FileCard";

// Dummy files data
const DUMMY_FILES = [
  { id: 1, name: "Document1.pdf", size: "2 MB", date: "2024-01-01" },
  { id: 2, name: "Picture.png", size: "500 KB", date: "2024-01-02" },
  { id: 3, name: "Presentation.pptx", size: "5 MB", date: "2024-01-03" },
  { id: 4, name: "Report.docx", size: "1 MB", date: "2024-01-05" },
];

const FilesPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = DUMMY_FILES.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 overflow-auto">
      <h2 className="text-xl font-semibold mb-4">Files</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 rounded bg-dark-6 text-light-1 placeholder-light-3"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Files List */}
      <div className="grid gap-4">
        {filteredFiles.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
        {filteredFiles.length === 0 && (
          <p className="text-light-3">No files found.</p>
        )}
      </div>
    </div>
  );
};

export default FilesPanel;
