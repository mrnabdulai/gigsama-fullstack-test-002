export const getPagination = ({ pageSize = "100", page, total, rows }) => {
  return {
    rows: rows ?? [],
    total: total || 0,
    page: parseInt(page || 1),
    pageSize: parseInt(pageSize),
    totalPages: Math.ceil(total / parseInt(pageSize)),
  };
};
