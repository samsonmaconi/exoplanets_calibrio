import React, { memo } from 'react';
import './VirtualisedTable.scss';
import Loader from '../Loader';

const VirtualisedTable = ({ data, dataLoading, columns, sortCriteria, toggleSortCriteria }) => {

    const TableHeader = () => {
        let headers = columns.reduce((primaryColumns, column, i) => {
            if (column.isPrimaryInfo) {
                primaryColumns.push(
                    <div
                        key={i}
                        onClick={column.isSortable ? () => toggleSortCriteria(column.id) : null}
                        className={`col ${column.isSortable ? 'sortableColumn' : ''} ${column.id === sortCriteria.columnId ? 'selected' : ''}`}>
                        {column.description} <span className={`sortingIcon ${sortCriteria.order}`}></span>
                    </div>
                )
            }
            return primaryColumns
        }, [])
        headers.push(<div key={headers.length} className="col"></div>)
        return headers
    }

    const TableBody = () => {
        let columnGroups = columns.reduce((columnGroups, column, i) => {
            if (column.isPrimaryInfo) {
                columnGroups.primaryColumns.push(column.id)
            } else {
                columnGroups.secondaryColumns.push(column.id)
            }
            return columnGroups
        }, { primaryColumns: [], secondaryColumns: [] })

        let tableRows = data.map((data, i) =>
            <div key={i} className={`row data-row`}>
                {columnGroups.primaryColumns.map((primaryColumnId, i) =>
                    <div key={i} className={`col data-column ${primaryColumnId===sortCriteria.columnId? 'highlighted': ''}`}>
                        {data[primaryColumnId] || '-'}
                    </div>
                )}

                <div key={columnGroups.primaryColumns.length} className={`col data-column`}>
                    {" "}
                </div>
            </div>

        )

        return tableRows
    }

    return (
        <div className="VirtualisedTable container-fluid px-5 mt-5">
            <div className="table-header row">
                <TableHeader />
            </div>
            <Loader loading={dataLoading} />
            <div className="table-body row">
                <div className="col">
                    <div className="content"><TableBody /></div>
                </div>
            </div>
        </div>
    );
}

export default memo(VirtualisedTable);
