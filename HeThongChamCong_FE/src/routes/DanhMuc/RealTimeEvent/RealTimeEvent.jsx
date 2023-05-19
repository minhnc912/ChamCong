import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "antd";
import { fetchStart, fetchReset } from "src/appRedux/actions/Common";
import { reDataForTable } from "src/util/Common";
import { Table } from "src/components/Common";
import moment from "moment";
import { PAGE_SIZE } from "src/constants/Config";

function HistoryAttendance({ history, permission }) {
    const dispatch = useDispatch();
    // const { loading } = useSelector(({ common }) => common).toJS();
    const pageSize = PAGE_SIZE;
    const [listData, setListData] = useState([]);

    useEffect(() => {
        if (permission && permission.view) {
            const interval = setInterval(getListData, 1000);
            return () => clearInterval(interval);
            getListData();
        } else {
            history.push("/home");
        }
        return () => {
            dispatch(fetchReset());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getListData = () => {
        new Promise((resolve, reject) => {
            dispatch(
                fetchStart(
                    `HistoryStaff`,
                    "GET",
                    null,
                    "LIST",
                    "",
                    resolve,
                    reject
                )
            );
        })
            .then((res) => {
                if (res.data) {
                    setListData(res.data);
                }
            })
            .catch((error) => console.error(error));
    };

    const renderHead = [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            width: 70,
            render: (_, it, index) => index + 1,
        },
        {
            title: "Mã nhân viên",
            dataIndex: "cardNo",
            key: "cardNo",
            width: 200,
        },
        {
            title: "Tên nhân viên",
            dataIndex: "name",
            key: "name",
            width: 250,
        },
        {
            title: "Kiểu sự kiện",
            dataIndex: "detail",
            key: "detail",
            ellipsis: true,
            width: 300,
        },
        {
            title: "Thời gian",
            dataIndex: "createdDate",
            key: "createdDate",
            ellipsis: true,
            render: (text) =>
                moment(text).utcOffset("+07:00").format("DD-MM-YYYY HH:mm:ss"),
        },
    ];

    const listRender = reDataForTable(listData);
    return (
        <>
            <Card className="th-card" title={`Sự kiện thời gian thực`}>
                <Table
                    bordered
                    columns={renderHead}
                    className="gx-table-responsive th-blue-head th-dark_blue-head"
                    dataSource={listRender}
                    size="middle"
                    pagination={{
                        pagesize: pageSize,
                        showQuickJumper: true,
                        showSizeChanger: false,
                    }}
                    // loading={loading}
                    scroll={{ y: (window.innerHeight * 40) / 100 }}
                />
            </Card>
        </>
    );
}

export default HistoryAttendance;
