import { CloudUpload, Download, Paperclip, Trash2 } from "lucide-react";
import type { ExerciseFile } from "@/services/exercise/models";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { downloadFile } from "@/services/exercise/exerciseService";
import { downloadBlob } from "@/lib/file";
import { DROPZONE_CONFIG } from "@/lib/constants";

interface ExerciseFileManagerProps {
  existingFiles?: ExerciseFile[];
  newFiles: File[] | null;
  onNewFilesChange: (files: File[] | null) => void;
  filesToRemove: string[];
  onFilesToRemoveChange: (filesToRemove: string[]) => void;
}

export function ExerciseFileManager({
  existingFiles = [],
  newFiles,
  onNewFilesChange,
  filesToRemove,
  onFilesToRemoveChange,
}: ExerciseFileManagerProps) {
  const hasExistingFiles = existingFiles.length > 0;

  const handleDownload = async (file: ExerciseFile) => {
    const dataBlob = await downloadFile(file.id);
    downloadBlob(dataBlob, file.fileName);
  };

  const handleToggleRemoveFile = (fileId: string, isMarkedForRemoval: boolean) => {
    if (isMarkedForRemoval) {
      onFilesToRemoveChange(filesToRemove.filter((f) => f !== fileId));
    } else {
      onFilesToRemoveChange([...filesToRemove, fileId]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing Files Section */}
      {hasExistingFiles && (
        <div>
          <Label className="mb-2">Files</Label>
          <div className="space-y-2 p-2 border rounded-lg bg-muted/50">
            {existingFiles.map((file) => {
              const isMarkedForRemoval = filesToRemove.includes(file.id);

              return (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-2 rounded border ${
                    isMarkedForRemoval ? "bg-destructive/5 border-destructive/20" : "bg-background"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Paperclip
                      className={`h-4 w-4 ${isMarkedForRemoval ? "text-destructive" : ""}`}
                    />
                    <span
                      className={`text-sm ${
                        isMarkedForRemoval ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {file.fileName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isMarkedForRemoval && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(file)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className={
                        isMarkedForRemoval ? "" : "text-red-600 hover:text-red-700 hover:bg-red-50"
                      }
                      onClick={() => handleToggleRemoveFile(file.id, isMarkedForRemoval)}
                    >
                      {isMarkedForRemoval ? "Restore" : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New File Upload Section */}
      <div>
        <Label htmlFor="fileInput">{hasExistingFiles ? "Add New Files" : "Attach Files"}</Label>
        <FileUploader
          value={newFiles}
          onValueChange={onNewFilesChange}
          dropzoneOptions={DROPZONE_CONFIG}
          className="relative bg-background rounded-lg p-2"
        >
          <FileInput className="outline-dashed outline-1 outline-slate-500">
            <div className="flex items-center justify-center flex-col p-8 w-full">
              <CloudUpload className="text-gray-500 w-10 h-10" />
              <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span>
                &nbsp;or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PDF, DOC, or other documents (max 10MB)
              </p>
            </div>
          </FileInput>
          <FileUploaderContent>
            {newFiles &&
              newFiles.length > 0 &&
              newFiles.map((file, i) => (
                <FileUploaderItem key={i} index={i}>
                  <Paperclip className="h-4 w-4 stroke-current" />
                  <span>{file.name}</span>
                </FileUploaderItem>
              ))}
          </FileUploaderContent>
        </FileUploader>
      </div>
    </div>
  );
}
