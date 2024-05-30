import { useState } from 'react';

const usePagination = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
  });

  const setTotal = (total: number) => {
    setPagination({
      ...pagination,
      total,
    });
  };

  const setPage = (page: number) => {
    let newPage = page;
    if (newPage > pagination.total) {
      newPage = pagination.total;
    }

    setPagination({
      ...pagination,
      page: newPage,
    });
  };

  const setLimit = (limit: number) => {
    setPagination({
      ...pagination,
      limit,
    });
  };

  return {
    pagination,
    setTotal,
    setPage,
    setLimit,
  };
};

export default usePagination;
