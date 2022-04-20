import React, { useEffect, useState, useCallback, useRef } from 'react';
import DataTable from 'react-data-table-component';
import CenteredContainer from '../../utils/Containers/CenteredContainer';
import io from "socket.io-client";
import { AgGridReact } from 'ag-grid-react';


import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css'; // option ag-theme-balham-dark

import './Home.scss';
import { Container } from 'react-bootstrap';

const socket = io("http://localhost:9090", { transports: ['websocket'] }); // important thing is adding websocket transporter to using socket 
const initialData = [{
  c: [],
  p: 0,
  s: "AAPL",
  t: 0,
  v: 0
},
{
  c: [],
  p: 0,
  s: "BINANCE:BTCUSDT",
  t: 0,
  v: 0
},
{
  c: [],
  p: 0,
  s: "IC MARKETS:1",
  t: 0,
  v: 0

}

];

const Home = () => {
  const [data, setData] = useState([]);
  const [activeIds, setActiveIds] = useState([]);
  const [ready, setReady] = useState(false);

  const gridRef = useRef(null);

  useEffect(() => {
    socket.on('connect', socket => {
      console.log('connected')
    })
    socket.on("livedata", (data) => {
      const parsedData = JSON.parse(data);
      console.log(parsedData)
      console.log("emitting to livedata", parsedData)
      if (parsedData.type === "trade" && gridRef.current) {
        gridRef.current.api.applyTransactionAsync({ update: parsedData.data });
      }else if(parsedData.type == "ready"){
        setReady(true);
      }
      // socket.emit("subscribe","ARL,123");
    })
    return () => socket.removeAllListeners("livedata");
  }, []);

  const numberCellFormatter = (params) => {
    return String(Number(params.value).toFixed(2)) + " $";
  };
  const [columnDefsForNames] = useState([
    { field: 's', sortable: true }
  ])
  const [columnDefs] = useState([
    { field: 's', sortable: true, width: '100' },
    {
      field: 'p',
      sortable: true,
      aggFunc: 'sum',
      valueFormatter: numberCellFormatter,
      enableValue: true,
      cellClass: 'number',
      width: '250',
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      field: 'v',
      sortable: true,
      aggFunc: 'sum',
      enableValue: true,
      valueFormatter: numberCellFormatter,
      cellClass: 'number',
      width: '250',
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
  ]);

  //use effect with dependencies will get called whenever state changes
  useEffect(() => {
    // console.log(data)
  }, [data]);

  const initiSocket = (stockList, api) => {
    console.log("on", stockList)
    socket.emit("subscribe", stockList);
  }
  const startFeed = (api) => {
    console.log("grid ready")
    // initiSocket("AAPL", api);
    // socket.on("livedata", (data) => {
    //   console.log(data);
    // })
    // socket.on("FromAPI", updatedData => {
    // var resultCallback = function () {
    //   console.log('transactionApplied() - ', updatedData);
    // };
    //   // below line find updated data and add effect to it
    //   api.applyTransactionAsync({ update: updatedData }, resultCallback);
    //   // setData(updatedData);
    // });
  };

  const getRowId = useCallback(function (params) {
    return params.data.s;
  }, []);

  const onFlushTransactions = useCallback(() => {
    gridRef.current.api.flushAsyncTransactions();
  }, []);

  const continueTransaction = useCallback(() => {
    startFeed(gridRef.current.api);
  }, []);


  // onGrid ready function will executed when grid is ready with rendered data in short mounted we will add logic to start socket on it
  const onGridReady = useCallback((params) => {
    // setData(initialData);
    startFeed(params.api);
  }, []);

  const unsubscribe = (data) => {
    socket.emit("unsubscribe", data);
  }

  const onCellClicked = (row) => {
    if (ready && gridRef.current) {
      if (data.find((r) => r.s === row.data.s)) {
        row.event.target.style.backgroundColor = "transparent";
        setData([
          ...data.filter((ro) => ro.s !== row.data.s)
        ])
        const newIDS = activeIds.filter((ro) => ro !== row.data.s);
        setActiveIds([
          ...newIDS
        ]);
        unsubscribe(row.data.s);
      } else {
        row.event.target.style.backgroundColor = "green";
        initiSocket([...activeIds, row.data.s].join(","), gridRef.current.api);
        setData([
          ...data,
          row.data
        ])
        setActiveIds([
          ...activeIds,
          row.data.s
        ])
      }
    } else {
      console.log("server is not ready yet");
    }


    // const currentData = initialData.find((a)=>a.id === row.data.id);

  }
  return (
    <React.Fragment>
      <Container>
        <div className="d-flex w-100 justify-content-center">
          <div className="ag-theme-balham-dark" style={{ height: 600, width: 200 }}>

            {/* Widget table */}
            <AgGridReact
              getRowId={getRowId}   // passing function that defines unique id for row in our case it's name
              rowData={initialData}   // passing initial data to render on widget table
              // asyncTransactionWaitMillis={1000} // interval to update data
              onCellClicked={onCellClicked} // function that will execute on cell clicked
              columnDefs={columnDefsForNames} // column definations
              animateRows={true} // animation of rows true
            >
            </AgGridReact>
          </div>
          <div className="ag-theme-balham-dark" style={{ height: 600, width: 605 }}>

            {/* Data table high frequency */}
            <AgGridReact
              ref={gridRef}
              getRowId={getRowId}
              rowData={data}
              // asyncTransactionWaitMillis={1000}
              columnDefs={columnDefs}
              onGridReady={onGridReady} // on grid ready function 
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
        {/* </CenteredContainer> */}
      </Container>

    </React.Fragment>
  )
}

export default Home;