import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface PaginationSectionProps {
  totalItems: number;
  itemsPerPage?: number;
  pagesToShow?: number;
  defaultPage?: number;
  onChange?: (page: number) => void;
  showGoToFirstPage?: boolean;
  showGoToLastPage?: boolean;
}

export default function PaginationControl({
  totalItems,
  defaultPage = DEFAULT_PAGE,
  itemsPerPage = DEFAULT_PAGE_SIZE,
  pagesToShow = 5,
  onChange,
  showGoToFirstPage = true,
  showGoToLastPage = true,
}: PaginationSectionProps) {
  const pagination = usePagination({
    defaultPage,
    totalItems,
    itemsPerPage,
    maxPageNum: pagesToShow,
  });

  const handleGoToPage = (page: number) => {
    pagination.goToPage(page);
    onChange?.(page);
  };

  const handlePrevPage = () => {
    onChange?.(Math.max(pagination.currentPage - 1, 1));
    pagination.goToPreviousPage();
  };

  const handleNextPage = () => {
    onChange?.(Math.min(pagination.currentPage + 1, pagination.pageNumbers.length));
    pagination.goToNextPage();
  };

  const handleGoToFirstPage = () => {
    pagination.goToFistPage();
    onChange?.(1);
  };

  const handleGoToLastPage = () => {
    pagination.goToLastPage();
    onChange?.(pagination.pageNumbers.length);
  };

  // Function to render page numbers with ellipsis
  const renderPages = () => {
    if (pagination.activePages.length === 0) {
      return null;
    }

    const renderedPages = pagination.activePages.map((page: number, idx: number) => (
      <PaginationItem key={idx}>
        <PaginationLink
          onClick={() => handleGoToPage(page)}
          isActive={pagination.currentPage === page}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    const firstOption = pagination.activePages[0];
    const lastOption = pagination.activePages[pagination.activePages.length - 1];

    // Add ellipsis at the start if necessary
    if (firstOption && firstOption > 1) {
      renderedPages.unshift(
        <PaginationEllipsis key="ellipsis-start" onClick={() => handleGoToPage(firstOption - 1)} />,
      );
    }

    // Add ellipsis at the end if necessary
    if (lastOption && lastOption < pagination.pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis key="ellipsis-end" onClick={() => handleGoToPage(lastOption + 1)} />,
      );
    }

    return renderedPages;
  };

  return (
    <div>
      <Pagination>
        <div className="flex items-center gap-1">
          {showGoToFirstPage && (
            <PaginationFirst onClick={handleGoToFirstPage} disabled={!pagination.hasPrevious} />
          )}
          <PaginationPrevious onClick={handlePrevPage} disabled={!pagination.hasPrevious} />
        </div>
        <PaginationContent>{renderPages()}</PaginationContent>
        <div className="flex items-center gap-1">
          <PaginationNext onClick={handleNextPage} disabled={!pagination.hasNext} />
          {showGoToLastPage && (
            <PaginationLast onClick={handleGoToLastPage} disabled={!pagination.hasNext} />
          )}
        </div>
      </Pagination>
    </div>
  );
}
