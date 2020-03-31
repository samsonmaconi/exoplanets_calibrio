import React, { memo, useState, useEffect } from 'react';
import './VirtualisedTable.scss';
import Loader from '../Loader';
import { FixedSizeList as List } from "react-window"
import AutoSizer from "react-virtualized-auto-sizer"
import { Popover, OverlayTrigger } from 'react-bootstrap';

const VirtualisedTable = ({ data, dataLoading, columns, sortCriteria, toggleSortCriteria }) => {

    const [columnGroups, setColumnGroups] = useState({ primaryColumns: [], secondaryColumns: [] })
    const TABLE_HEAD_BODY_ALIGNMENT_VARIANCE = 14 //14px used by react-window's FixedSizeList scrollbar and margin
    const MIN_ROW_HEIGHT = 44

    const moreInfoPopover = (dataIndex) => (
        <Popover id="moreInfoPopover">
            <Popover.Title as="h3">{`More about ${data[dataIndex][columnGroups.primaryColumns[0]]}`}</Popover.Title>
            <Popover.Content>
                {columnGroups.secondaryColumns.map(([secondaryColumnId, secondaryColumnDescription], i) =>
                    <span key={i}><strong>{`${secondaryColumnDescription}: `}</strong><span>{data[dataIndex][secondaryColumnId] || 'n/a'}</span><br /></span>
                )}
            </Popover.Content>
        </Popover>
    )

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
        headers.push(<div key={headers.length} className="col col-auto"><i className="fas fa-info-circle info-tooltip"></i></div>)
        return headers
    }

    useEffect(() => {
        const prepColumnGroups = () => {
            let _columnGroups = columns.reduce((_columnGroups, column) => {
                if (column.isPrimaryInfo) {
                    _columnGroups.primaryColumns.push(column.id)
                } else {
                    _columnGroups.secondaryColumns.push([column.id, column.description])
                }
                return _columnGroups
            }, { primaryColumns: [], secondaryColumns: [] })

            setColumnGroups(_columnGroups)
        }
        prepColumnGroups();
    }, [columns]);


    const TableBodyRows = ({ index, style }) => {
        return (<div className={`row data-row`} style={{ ...style, background: index % 2 ? '#eeeeee' : '' }}>
            {columnGroups.primaryColumns.map((primaryColumnId, key) =>
                <div key={key} className={`col data-column ${primaryColumnId === sortCriteria.columnId ? 'highlighted' : ''}`}>
                    {data[index][primaryColumnId] || 'n/a'}
                </div>
            )}
            <div key={columnGroups.primaryColumns.length} className={`col col-auto data-column`}>
                <OverlayTrigger trigger={['hover', 'focus']} data-index={index} placement="left" overlay={moreInfoPopover(index)}>
                    <i className="fas fa-info-circle info-tooltip" />
                </OverlayTrigger>
            </div>
        </div>)
    }


    return (
        <div className="VirtualisedTable container-fluid px-5 mt-5">
            <Loader loading={dataLoading} />
            <AutoSizer>
                {({ height, width }) => {
                    return (
                        <div>
                            <div className="table-header row" style={{ width: `${width - TABLE_HEAD_BODY_ALIGNMENT_VARIANCE}px` }}>
                                <TableHeader />
                            </div>

                            <div className="table-body row">
                                <div className="col">
                                    <div className="content">
                                        <List
                                            className="List"
                                            height={height}
                                            itemCount={data.length}
                                            itemSize={MIN_ROW_HEIGHT}
                                            width={width}
                                        >
                                            {TableBodyRows}
                                        </List>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }}
            </AutoSizer>
        </div>
    );
}

export default memo(VirtualisedTable);
