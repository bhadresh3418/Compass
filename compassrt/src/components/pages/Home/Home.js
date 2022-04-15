import React, { useEffect, useState, useCallback, useRef } from 'react';
import DataTable from 'react-data-table-component';
import CenteredContainer from '../../utils/Containers/CenteredContainer';
import io from "socket.io-client";
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

import './Home.scss';

const socket = io("http://localhost:9090", { transports: ['websocket'] }); // important thing is adding websocket transporter to using socket 
const initialData = [{
  id: 1,
  marketCap: 12355.86,
  name: "crud",
  price: 4.71,
}, {
  id: 2,
  marketCap: 21168.61,
  name: "ISRT",
  price: 1.24,
}, {
  id: 3,
  marketCap: 20585.76,
  name: "RRTC",
  price: 0.50,
},
{
  id: 4,
  marketCap: 21128.00,
  name: "SSR",
  price: 3.16,
}, {
  id: 5,
  marketCap: 42503.76,
  name: "INDD",
  price: 4.97,
}, {
  id: 6,
  marketCap: 35017.00,
  name: "HTC",
  price: 0.89
}, {
  id: 7,
  marketCap: 38919.39,
  name: "APPL",
  price: 3.86,
}, {
  id: 8,
  marketCap: 20363.59,
  name: "SSRT",
  price: 1.45,
}];

const Home = () => {
  const [data, setData] = useState([]);
  const [activeIds, setActiveIds] = useState([]);

  const gridRef = useRef(null);

  const numberCellFormatter = (params) => {
    return String(params.value) + " $";
  };
  const [columnDefsForNames] = useState([
    { field: 'name', sortable: true }
  ])
  const [columnDefs] = useState([
    { field: 'name', sortable: true },
    {
      field: 'price',
      sortable: true,
      aggFunc: 'sum',
      valueFormatter: numberCellFormatter,
      enableValue: true,
      cellClass: 'number',
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'marketCap',
      sortable: true,
      aggFunc: 'sum',
      enableValue: true,
      valueFormatter: numberCellFormatter,
      cellClass: 'number',
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
  ]);


  //use effect without dependencies will get executed at initial rendering
  useEffect(() => {
    console.log(socket);

  }, []);

  const startFeed = (api) => {
    socket.on("FromAPI", updatedData => {
      var resultCallback = function () {
        console.log('transactionApplied() - ', updatedData);
      };
      api.applyTransactionAsync({ update: updatedData }, resultCallback);
      // setData(updatedData);
    });
  };
  const getRowId = useCallback(function (params) {
    return params.data.name;
  }, []);

  const onFlushTransactions = useCallback(() => {
    gridRef.current.api.flushAsyncTransactions();
  }, []);

  const onGridReady = useCallback((params) => {

    // setData(initialData);
    startFeed(params.api);
  }, []);

  const onCellClicked = (row) => {
    if (data.find((r) => r.id === row.data.id)) {
      row.event.target.style.backgroundColor = "transparent";
      setData([
        ...data.filter((ro) => ro.id !== row.data.id)
      ])
      setActiveIds([
        ...activeIds.filter((ro) => ro !== row.data.id)
      ])
    } else {
      row.event.target.style.backgroundColor = "green";
      setData([
        ...data,
        row.data
      ])
      setActiveIds([
        ...activeIds,
        row.data.id
      ])

    }

    // const currentData = initialData.find((a)=>a.id === row.data.id);

  }
  return (
    <React.Fragment>
      <div className="bg-black">
        <CenteredContainer>
          <div className="d-flex">
            <div className="ag-theme-alpine-dark" style={{ height: 600, width: 200 }}>
              <AgGridReact
                getRowId={getRowId}
                rowData={initialData}
                suppressAggFuncInHeader={true}
                rowGroupPanelShow={'always'}
                asyncTransactionWaitMillis={1000}
                onCellClicked={onCellClicked}
                columnDefs={columnDefsForNames}
                animateRows={true}
              >
              </AgGridReact>
            </div>
            <div className="ag-theme-alpine-dark" style={{ height: 600, width: 605 }}>
              <AgGridReact
                ref={gridRef}
                getRowId={getRowId}
                rowData={data}
                suppressAggFuncInHeader={true}
                rowGroupPanelShow={'always'}
                asyncTransactionWaitMillis={1000}
                columnDefs={columnDefs}
                onGridReady={onGridReady}
                animateRows={true}
              >
              </AgGridReact>
            </div>

            {/*            
            <DataTable
              theme='dark'
              striped
              sortIcon={true}
              title="current market affairs"
              conditionalRowStyles={conditionalRowStyles}    
              columns={columns}
              data={data}
            /> */}
          </div>
        </CenteredContainer>
      </div>
    </React.Fragment>
  )
}

export default Home;