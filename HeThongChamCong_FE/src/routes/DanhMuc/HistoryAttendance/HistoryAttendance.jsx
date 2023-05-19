import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Col, DatePicker, Row } from "antd";
import { fetchStart, fetchReset } from "src/appRedux/actions/Common";
import { reDataForTable } from "src/util/Common";
import { isEmpty } from "lodash";
import { Button, Table, Toolbar } from "src/components/Common";
import moment from "moment";
import { PAGE_SIZE } from "src/constants/Config";
import { ReloadOutlined } from "@ant-design/icons";

function HistoryAttendance({ history, permission }) {
    const dispatch = useDispatch();
    const { loading } = useSelector(({ common }) => common).toJS();
    const [keyword, setKeyword] = useState("");
    const pageSize = PAGE_SIZE;
    const [filterDateRange, setFilterDateRange] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    let debounceTimeout;

    useEffect(() => {
        if (permission && permission.view) {
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
                    const modifiedData = res.data.map((item) => {
                        if (item.detail === "MINOR_FACE_VERIFY_PASS ") {
                            item.detail = "Đã xác thực bằng khuôn mặt";
                        } else if (
                            item.detail === "MINOR_FINGERPRINT_COMPARE_PASS "
                        ) {
                            item.detail = "Đã được xác thực qua vân tay";
                        } else if (item.detail === "MINOR_LEGAL_CARD_PASS ") {
                            item.detail = "Đã xác thực thẻ pháp lý";
                        }
                        return item;
                    });
                    setAttendanceList(modifiedData);
                    setFilteredData(modifiedData);
                }
            })
            .catch((error) => console.error(error));
    };

    const onChangeKeyword = (val) => {
        setKeyword(val.target.value);
        if (isEmpty(val.target.value)) {
            getListData();
            setFilterDateRange(null);
        }
    };

    const onSearch = (val) => {
        setKeyword(val.target.value);
        debounceSearch(val.target.value, filterDateRange);
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

    const handleFilterDate = (dates) => {
        setFilterDateRange(dates);
        if (dates && dates.length === 2) {
            const formattedDates = dates.map((date) =>
                date.format("YYYY-MM-DD")
            );
            debounceSearch(keyword, formattedDates);
        } else {
            debounceSearch(keyword, []);
        }
    };

    const debounceSearch = (value, dates) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            filterData(value, dates);
        }, 500);
    };

    const filterData = (value, dates) => {
        let filteredData = attendanceList;

        // Lọc dữ liệu theo khoảng thời gian
        if (dates && dates.length === 2) {
            const startDate = moment(dates[0]).startOf("day");
            const endDate = moment(dates[1]).endOf("day");
            filteredData = filteredData.filter((item) => {
                const itemDate = moment(item.createdDate);
                return itemDate.isBetween(startDate, endDate, null, "[]");
            });
        }

        // Lọc dữ liệu theo từ khóa tìm kiếm
        if (!isEmpty(value)) {
            const searchFields = ["cardNo", "detail", "name"];
            const lowerSearchText = value.toLowerCase();
            filteredData = filteredData.filter((item) => {
                const itemValues = searchFields.map((field) =>
                    String(item[field]).toLowerCase()
                );
                return itemValues.some((value) =>
                    value.includes(lowerSearchText)
                );
            });
        }
        setFilteredData(filteredData); // Update filteredData state
    };

    const listRender = reDataForTable(filteredData);
    return (
        <>
            <Card className="th-card" title={`Lịch sử chấm công`}>
                <Row align="middle" justify="space-between" style={{ marginTop: "-20px" }}>
                    <Col span={3}>Khoảng thời gian:</Col>
                    <Col span={9}>
                        <DatePicker.RangePicker
                            placeholder={["Từ ngày", "Đến ngày"]}
                            value={filterDateRange}
                            onChange={handleFilterDate}
                            style={{ width: "100%" }}
                        />
                    </Col>
                    <Col span={2}>Từ khóa:</Col>
                    <Col span={10}>
                        <Toolbar
                            count={1}
                            search={{
                                loading,
                                keyword: keyword,
                                onChange: onChangeKeyword,
                                onPressEnter: onSearch,
                                onSearch: onSearch,
                                placeholder: "Nhập từ khóa",
                            }}
                        />
                    </Col>
                </Row>
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
                    loading={loading}
                    scroll={{ y: (window.innerHeight * 40) / 100 }}
                />
            </Card>
        </>
    );
}

export default HistoryAttendance;
