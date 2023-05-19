import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    Card,
    Col,
    Descriptions,
    Image,
    Pagination,
    Row,
    Space,
    Tooltip,
} from "antd";
import { fetchStart, fetchReset } from "src/appRedux/actions/Common";
import { IoPersonOutline, IoFingerPrintOutline } from "react-icons/io5";
import { AiOutlineCreditCard } from "react-icons/ai";
import { isEmpty } from "lodash";
import { DeleteOutlined } from "@ant-design/icons";
import { ModalDeleteConfirm } from "src/components/Common";

function EmployeeList({ history, permission }) {
    const dispatch = useDispatch();
    const pageSize = 9;
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

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
    }, [page]);

    const getListData = () => {
        new Promise((resolve, reject) => {
            dispatch(
                fetchStart(
                    `StaffInformation`,
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
                    setTotal(res.data.length);
                }
            })
            .catch((error) => console.error(error));
    };

    const getEmployeesForCurrentPage = () => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return listData.slice(startIndex, endIndex);
    };

    const handlePageChange = (e) => {
        setPage(e);
    };

    const deleteContent = (itemVal) => {
        const deleteItemVal =
            permission.edit && !itemVal.isUsed
                ? { onClick: () => deleteItemFunc(itemVal) }
                : { disabled: true };
        return (
            <a {...deleteItemVal}>
                <DeleteOutlined />
            </a>
        );
    };

    const deleteItemFunc = (item) => {
        return ModalDeleteConfirm(deleteItemAction, item);
    };

    const deleteItemAction = (item) => {
        new Promise((resolve, reject) => {
            dispatch(
                fetchStart(
                    `StaffInformation/${item.id}`,
                    "DELETE",
                    null,
                    "DELETE",
                    "",
                    resolve,
                    reject
                )
            );
        })
            .then((res) => {
                getListData();
            })
            .catch((err) => console.error(err));
    };

    return (
        <>
            <Card className="th-card" title={`Danh sách nhân viên`}>
                <Row align="stretch" wrap>
                    {getEmployeesForCurrentPage() &&
                        getEmployeesForCurrentPage().map((employee) => (
                            <Col span={24} xl={8} md={12} key={employee.id}>
                                <Card>
                                    <Row gutter={10}>
                                        <Col span={6} md={10} xl={8}>
                                            <Image
                                                src={
                                                    isEmpty(
                                                        employee.filePathPicture
                                                    )
                                                        ? require("assets/images/placeholder.jpg")
                                                        : `http://10.14.6.5:3117/Uploads/Image/${employee.filePathPicture}`
                                                }
                                                size="100%"
                                                alt="Ảnh nhân viên"
                                            />
                                        </Col>
                                        <Col span={18} md={14} xl={16}>
                                            <Descriptions column={1}>
                                                <Descriptions.Item
                                                    contentStyle={{
                                                        justifyContent:
                                                            "space-between",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            whiteSpace:
                                                                "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            maxWidth: "160px",
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title={
                                                                employee.name
                                                            }
                                                        >
                                                            {employee.name}
                                                        </Tooltip>
                                                    </span>
                                                    {deleteContent(employee)}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Mã nhân viên">
                                                    {employee.cardNo}
                                                </Descriptions.Item>
                                                <Descriptions.Item label="Thông tin chứng danh" />
                                                <Descriptions.Item>
                                                    <Space>
                                                        <span>
                                                            <IoPersonOutline />
                                                            {isEmpty(
                                                                employee.employeeNo
                                                            )
                                                                ? 0
                                                                : 1}
                                                        </span>
                                                        <span>
                                                            {" "}
                                                            <AiOutlineCreditCard />
                                                            {isEmpty(
                                                                employee.cardNo
                                                            )
                                                                ? 0
                                                                : 1}
                                                        </span>
                                                        <span>
                                                            <IoFingerPrintOutline />
                                                            {isEmpty(
                                                                employee.fingerID
                                                            )
                                                                ? 0
                                                                : 1}
                                                        </span>
                                                    </Space>
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))}
                </Row>
                <Pagination
                    style={{ display: "flex", justifyContent: "end" }}
                    current={page}
                    pageSize={pageSize}
                    showQuickJumper
                    total={total}
                    onChange={handlePageChange}
                    responsive
                />
            </Card>
        </>
    );
}

export default EmployeeList;
