export function downloadBlob(data: Blob, fileName: string) {
  const url = window.URL.createObjectURL(data);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
}
