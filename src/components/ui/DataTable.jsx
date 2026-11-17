import { Table } from 'antd'
import { EmptyState, ErrorState } from './QueryState'

/**
 * Server-paginated table with consistent styling, loading, empty and error
 * states. `query` is an RTK Query result; `meta` comes from the backend.
 */
export default function DataTable({
  columns,
  dataSource,
  query,
  page,
  limit,
  onPageChange,
  rowKey = '_id',
  emptyTitle = 'No records found',
  emptyDescription,
  onRow,
  scrollX = 720,
  pagination = true,
  size = 'middle',
}) {
  const total = query?.data?.data?.meta?.total ?? 0

  if (query?.isError && !query?.data) {
    return <ErrorState error={query.error} onRetry={query.refetch} />
  }

  return (
    <Table
      className="app-table"
      size={size}
      rowKey={rowKey}
      columns={columns}
      dataSource={dataSource}
      loading={query ? query.isFetching : false}
      onRow={onRow}
      scroll={{ x: scrollX }}
      locale={{
        emptyText: query?.isLoading ? (
          <div className="h-40" />
        ) : (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ),
      }}
      pagination={
        pagination && total > limit
          ? {
              current: page,
              pageSize: limit,
              total,
              onChange: onPageChange,
              showSizeChanger: false,
              position: ['bottomRight'],
              showTotal: (t, [from, to]) => `${from}–${to} of ${t}`,
            }
          : false
      }
    />
  )
}
