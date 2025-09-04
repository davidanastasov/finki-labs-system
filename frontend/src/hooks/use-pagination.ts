import { useState } from "react";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  maxPageNum?: number;
  defaultPage?: number;
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  maxPageNum = 5,
  defaultPage = 1,
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(defaultPage);

  const pageNumbers = Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => i + 1);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, pageNumbers.length));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToFistPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(pageNumbers.length);
  };

  const hasNext = currentPage < pageNumbers.length;
  const hasPrevious = currentPage > 1;

  const from = (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageIndicator = () => {
    const pageNum = maxPageNum > pageNumbers.length ? pageNumbers.length : maxPageNum;
    const half = Math.floor(pageNum / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = pageNum;
    }

    if (end > pageNumbers.length) {
      end = pageNumbers.length;
      start = pageNumbers.length - pageNum + 1;
    }

    if (pageNumbers.length < pageNum) {
      start = 1;
      end = pageNumbers.length;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const activePages = getPageIndicator();

  return {
    currentPage,
    pageNumbers,
    activePages,
    hasNext,
    hasPrevious,
    from,
    to,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFistPage,
    goToLastPage,
  };
};
