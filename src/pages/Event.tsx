import React, {useEffect, useRef, useState} from "react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {AgGridReact} from 'ag-grid-react';
import axios from "axios";
import PlaceDetail from "../../types/PlaceDetail"; // Ag-Grid의 React 컴포넌트를 가져옴

const Event: React.FC = () => {
    const gridRef = useRef();
    const [activeTab, setActiveTab] = useState('공지사항');
    const [rowsData, setRowData] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            await axios
                .get(`https://api.nadueli.com/event/announce`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(response => {
                    console.log(response.data);
                    setRowData(response.data);
                });
        } catch(e) {
            console.error('Error:', e);
        };
    };

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const [columnDefs, setColumnDefs] = useState([
        {headerName: '제목', field: 'title'},
        {headerName: '내용', field: 'content'},
        {headerName: '작성일자', field: 'createdDate'},
        {headerName: '수정일자', field: 'updatedDate'},
        {headerName: '작성자', field: 'memberName'},
    ]);

    const rowData = rowsData && rowsData.map((v: any) => {
        return {
            title: v.title,
            content: v.content,
            createdDate: new Date(v.createdDate),
            updatedDate: new Date(v.updatedDate),
            memberName: v.memberName,
        };
    });

    return (
        <div>
            <div className="flex max-w-2xl mx-auto pt-4 m-10">
                <div
                    id="1"
                    className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                        activeTab === '공지사항'
                            ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                            : 'border-b-2'
                    }`}
                    onClick={() => handleTabClick('공지사항')}
                >
                    공지사항
                </div>
                <div
                    id="2"
                    className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                        activeTab === '이벤트'
                            ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                            : 'border-b-2'
                    }`}
                    onClick={() => handleTabClick('이벤트')}
                >
                    이벤트
                </div>
                <div
                    id="3"
                    className={`mx-auto justify-center py-2 text-center w-1/2 border-main-red-color font-BMJUA text-2xl cursor-pointer ${
                        activeTab === '홍보'
                            ? 'border-x-2 border-t-2 rounded-t-lg text-main-red-color'
                            : 'border-b-2'
                    }`}
                    onClick={() => handleTabClick('홍보')}
                >
                    홍보
                </div>
            </div>
            <div className="h-full w-full flex justify-center">
                {activeTab === '공지사항' && (
                    <div className="ag-theme-alpine" style={{height: "650px", width: '70%'}}>
                        <AgGridReact
                            rowData={rowData} // 테이블 데이터
                            /*columnDefs={columnDefs}*/ // 헤더데이터
                            animateRows={true} // 행 애니메이션
                            suppressRowClickSelection={true} // true -> 클릭 시 행이 선택안됌
                            rowSelection={'multiple'} // 여러행 선택
                            enableCellTextSelection={true} // 그리드가 일반 테이블인 것처럼 드래그시 일반 텍스트 선택
                        >
                        </AgGridReact>
                    </div>
                )}
                {activeTab === '이벤트' && (
                    <></>
                )}
                {activeTab === '홍보' && (
                    <></>
                )}
            </div>
        </div>
    );
};

export default Event;