'use client';

import React from 'react';
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
  render?: (value: any, row: any) => React.ReactNode;
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
  // Validación de props
  if (!Array.isArray(columns) || columns.length === 0) {
    console.error('Table: columns must be a non-empty array');
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error: No se definieron columnas para la tabla</p>
      </div>
    );
  }

  if (!Array.isArray(data)) {
    console.error('Table: data must be an array');
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error: Los datos de la tabla no son válidos</p>
      </div>
    );
  }

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
          {data.map((row, index) => {
            // Generar una key más robusta
            const rowKey = row?.id || row?.key || `row-${index}`;
            
            return (
              <tr key={rowKey} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {columns.map((column) => {
                  let cellContent;
                  
                  try {
                    if (column.render) {
                      cellContent = column.render(row?.[column.key], row);
                    } else {
                      cellContent = row?.[column.key] || '';
                    }
                  } catch (error) {
                    console.error('Table: Error rendering cell:', error, { column, row });
                    cellContent = <span className="text-red-500 text-xs">Error</span>;
                  }
                  
                  return (
                    <td
                      key={column.key}
                      className={`px-6 py-4 text-sm text-gray-900 dark:text-white ${
                        column.key === 'actions' ? '' : 'whitespace-nowrap'
                      }`}
                    >
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}