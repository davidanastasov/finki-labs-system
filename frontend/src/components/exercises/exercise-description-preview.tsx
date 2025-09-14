import "../ui/minimal-tiptap/styles/index.css";

interface ExerciseDescriptionPreviewProps {
  content: string;
}

export function ExerciseDescriptionPreview({ content }: ExerciseDescriptionPreviewProps) {
  return (
    <div className="minimal-tiptap-editor">
      <div
        className="ProseMirror"
        dangerouslySetInnerHTML={{
          __html: content || '<p class="text-gray-500">No content</p>',
        }}
      />
    </div>
  );
}
