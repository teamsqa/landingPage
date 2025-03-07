'use client';

import { cva, type VariantProps } from 'class-variance-authority';

const tableVariants = cva(
  "w-full divide-y divide-gray-200 dark:divide-gray-700",
  {
    variants: {
      variant: {
        default: [
          "bg-white",
          "dark:bg-gray-800"
        ].join(" "),
        striped: [
          "bg-white",
          "dark:bg-gray-800",
          "[&_tr:nth-child(even)]:bg-gray-50",
          "dark:[&_tr:nth-child(even)]:bg-gray-700"
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    }
  }
);

interface Column {
  key: string;
  header: string;
  width?: string;
}

interface TableProps<T> extends VariantProps<typeof tableVariants> {
  columns: Column[];
  data: T[];
  className?: string;
}

export function Table<T extends Record<string, any>>({ 
  columns,
  data,
  variant,
  className,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className={tableVariants({ variant, className })}>
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white ${column.width ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}