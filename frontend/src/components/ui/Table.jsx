import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, downloadCSV } from '../../utils/helpers';
import { TableSkeleton } from './Skeleton';

const Table = ({
  columns,
  data = [],
  loading = false,
  searchable = true,
  sortable = true,
  paginated = true,
  pageSize = 10,
  exportable = false,
  exportFilename = 'export',
  emptyMessage = 'No data found',
  emptyIcon = null,
  className = '',
}) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  // Search filter
  const filtered = data.filter(row => {
    if (!search) return true;
    return columns.some(col => {
      const val = col.accessor ? row[col.accessor] : '';
      return String(val ?? '').toLowerCase().includes(search.toLowerCase());
    });
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    const va = a[sortKey] ?? '';
    const vb = b[sortKey] ?? '';
    const result = String(va).localeCompare(String(vb), undefined, { numeric: true });
    return sortDir === 'asc' ? result : -result;
  });

  // Paginate
  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageData = paginated ? sorted.slice((page - 1) * pageSize, page * pageSize) : sorted;

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleExport = () => {
    const exportData = sorted.map(row => {
      const obj = {};
      columns.forEach(col => {
        if (col.accessor) obj[col.header] = row[col.accessor] ?? '';
      });
      return obj;
    });
    downloadCSV(exportData, exportFilename);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      {(searchable || exportable) && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={handleSearch}
                className="input pl-9 w-64 py-2 text-sm"
              />
            </div>
          )}
          {exportable && (
            <button onClick={handleExport} className="btn btn-outline btn-sm gap-1.5">
              <Download size={14} />
              Export CSV
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-dark-border">
        <table className="w-full table-auto">
          <thead className="bg-gray-50 dark:bg-dark-bg border-b border-gray-100 dark:border-dark-border">
            <tr>
              {columns.map(col => (
                <th
                  key={col.accessor || col.header}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-dark-muted uppercase tracking-wider select-none',
                    sortable && col.sortable !== false && col.accessor && 'cursor-pointer hover:text-gray-700 dark:hover:text-dark-text transition-colors'
                  )}
                  onClick={() => sortable && col.sortable !== false && col.accessor && handleSort(col.accessor)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {sortable && col.sortable !== false && col.accessor && (
                      <div className="flex flex-col">
                        <ChevronUp
                          size={10}
                          className={cn(sortKey === col.accessor && sortDir === 'asc' ? 'text-primary-600' : 'text-gray-300')}
                        />
                        <ChevronDown
                          size={10}
                          className={cn(sortKey === col.accessor && sortDir === 'desc' ? 'text-primary-600' : 'text-gray-300')}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-4">
                  <TableSkeleton rows={5} />
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3">
                    {emptyIcon || (
                      <div className="text-5xl opacity-30">📭</div>
                    )}
                    <p className="text-gray-500 dark:text-dark-muted text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {pageData.map((row, i) => (
                  <motion.tr
                    key={row.id || i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors duration-150"
                  >
                    {columns.map(col => (
                      <td key={col.accessor || col.header} className="px-4 py-3 text-sm text-gray-700 dark:text-dark-text">
                        {col.cell ? col.cell(row) : row[col.accessor] ?? '—'}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-dark-muted">
          <span>
            Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="btn btn-ghost btn-sm p-1.5"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let num;
              if (totalPages <= 7) {
                num = i + 1;
              } else if (page <= 4) {
                num = i < 6 ? i + 1 : totalPages;
              } else if (page >= totalPages - 3) {
                num = i === 0 ? 1 : totalPages - 6 + i;
              } else {
                const mid = [1, page - 1, page, page + 1, totalPages];
                num = mid[Math.min(i, mid.length - 1)] || i + 1;
              }
              return (
                <button
                  key={i}
                  className={cn(
                    'btn btn-sm w-8 h-8 p-0',
                    page === num ? 'btn-primary' : 'btn-ghost'
                  )}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              );
            })}
            <button
              className="btn btn-ghost btn-sm p-1.5"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
