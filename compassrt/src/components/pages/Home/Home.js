import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import io from "socket.io-client";
import { AgGridReact } from 'ag-grid-react';
import env from 'react-dotenv';

import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css'; // option ag-theme-alpine-dark
import Loader from '../../utils/Loader';
import SelectSearch from 'react-select-search';
import './SelectorStyle.scss';

import { MinusSVG } from "../../../assets/SVG";

import './Home.scss';
import { Container, Form, FormControl, Button } from 'react-bootstrap';
import { addToWatchlist, getWatchlist, searchStock } from '../../../api';

const token = localStorage.getItem('token');
const socket = io(`${env.SOCK_BASE_URL}?token=${token}`, { transports: ['websocket'] }); // important thing is adding websocket transporter to using socket 
const initialData = [];

const Home = () =>
{
  const [data, setData] = useState([]);
  const [simData, setSimData] = useState([]);
  const [activeIds, setActiveIds] = useState([]);
  const [ready, setReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);

  const gridRef = useRef(null);
  const simGridRef = useRef(null);

  useEffect(() =>
  {
    if (!socket.connected)
    {
      socket.connect();
    }
    socket.on('connect', socket =>
    {
      console.log('connected')
    })
    socket.addEventListener(`livedata`, (data) =>
    {
      const parsedData = data;
      // console.log("emitting to livedata", parsedData)
      if (parsedData.type === "trade" && gridRef.current)
      {
        gridRef.current.api.applyTransactionAsync({ update: parsedData.data });
      } else if (parsedData.type === "ready")
      {

        socket.emit(`livedata`, {
          type: "start"
        });
        setReady(true);
        getWatchlistData();
      }
    })
    socket.addEventListener(`mockdata`, (data) =>
    {
      const parsedData = data;
      // console.log("comes from mockdata", parsedData)
      if (parsedData.type === "trade" && simGridRef.current)
      {
        simGridRef.current.api.applyTransactionAsync({ update: parsedData.data });
      } else if (parsedData.type === "ready")
      {
        socket.emit(`mockdata`, {
          type: "start"
        });
        setReady(true);
      }
    })

    return () =>
    {
      socket.removeAllListeners(`livedata`);
      socket.removeAllListeners(`mockdata`);
      socket.disconnect();
    }
  }, []);


  const getWatchlistData = async () =>
  {
    const res = await getWatchlist();
    if (res.success)
    {
      setData(res.data.map((stock) =>
      {

        socket.emit(`livedata`, {
          type: "subscribe",
          data: stock
        });
        return {
          s: stock,
          v: 0,
          p: 0
        }
      }));
      setSimData(res.data.map((stock) =>
      {
        socket.emit(`mockdata`, {
          type: "subscribe",
          data: stock
        });

        return {
          s: stock,
          v: 0,
          p: 0,
          mock: true
        }
      }))



    }
  }

  const loadingCellRenderer = useMemo(() =>
  {
    return <Loader />
  }, []);

  const numberCellFormatter = (params) =>
  {
    return String(Number(params.value).toFixed(2)) + " $";
  };

  const volumnFormatter = (params) =>
  {
    return Math.floor(params.value)
  };

  const timeFormatter = (params) =>
  {
    return new Date(params.value).toLocaleTimeString();
  }

  const [columnDefsForNames] = useState([
    { headerName: 'Stock', field: 'displaySymbol', sortable: true }
  ]);

  const defaultColDef = useMemo(() =>
  {
    return {
      flex: 1,
      minWidth: 120,
      resizable: true,
      cellClass: 'text-end'
    };
  }, []);



  const unsubscribe = (data, mock) =>
  {

    if (mock)
    {
      socket.emit(`mockdata`, {
        type: "unsubscribe",
        data
      });
    } else
    {
      socket.emit(`livedata`, {
        type: "unsubscribe",
        data
      });
    }

  }

  const handleUnsubscribe = (value, mock = false) =>
  {
    console.log("data", data, "simData", simData);
    console.log(value);
    // if (mock) {
    //   setSimData([
    //     ...simData.filter((ro) => ro.s !== value)
    //   ])
    // } else {
    //   setData([
    //     ...data.filter((ro) => ro.s !== value)
    //   ])
    // }

    const newIDS = activeIds.filter((ro) => ro !== value);
    setActiveIds([
      ...newIDS
    ]);

    unsubscribe(value, mock);
  }


  const BtnCellRenderer = (props) =>
  {
    console.log(props.data);
    const cellValue = props.valueFormatted ? props.valueFormatted : props.value;
    const mock = props.data.mock;
    return (
      <span>
        <Button variant="danger" className="rounded-circle " style={{ padding: "0px 9px 3px 9px" }} onClick={() => handleUnsubscribe(cellValue, mock)} ><MinusSVG /></Button>
      </span>
    );
  };


  const [columnDefs] = useState([
    { headerName: 'Stock', field: 's', sortable: true },
    {
      headerName: 'Price',
      field: 'p',
      sortable: true,
      aggFunc: 'sum',
      valueFormatter: numberCellFormatter,
      enableValue: true,
      // cellClass: 'number',
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      headerName: 'Volumn',
      field: 'v',
      sortable: true,
      // aggFunc: 'sum',
      enableValue: true,
      valueFormatter: volumnFormatter,
      // cellClass: 'number',
      cellRenderer: 'agAnimateShowChangeCellRenderer',
    },
    {
      headerName: 'remove',
      field: 's',
      cellRenderer: BtnCellRenderer,
      minWidth: 100,
      cellClass: 'text-center'

    }
  ]);

  //use effect with dependencies will get called whenever state changes
  useEffect(() =>
  {
    // console.log(data)
  }, [data]);

  const subscribe = async (symbol) =>
  {
    socket.emit(`livedata`, {
      type: "subscribe",
      data: symbol
    });
    socket.emit(`mockdata`, {
      type: "subscribe",
      data: symbol
    });
    await addToWatchlist(symbol)
  }

  const startFeed = (api) =>
  {
    console.log("grid ready")
  };

  const getRowId = useCallback(function (params)
  {
    return params.data.s;
  }, []);

  // onGrid ready function will executed when grid is ready with 
  // rendered data in short mounted we will add logic to start socket on it
  const onGridReady = useCallback((params) =>
  {
    startFeed(params.api);
  }, []);


  const onCellClicked = (symbol) =>
  {
    if (ready && gridRef.current)
    {
      if (data.find((r) => r.s === symbol))
      {

      } else
      {
        setData([
          ...data,
          {
            v: 0,
            s: symbol,
            t: 0,
            p: 0
          }
        ])

        setSimData([
          ...simData,
          {
            v: 0,
            s: symbol,
            t: 0,
            p: 0,
            mock: true
          }
        ])
        subscribe(symbol);
        setActiveIds([
          ...activeIds,
          symbol
        ])
      }
    } else
    {
      console.log("server is not ready yet");
    }
  }

  const getOptions = async (query) =>
  {
    return new Promise((resolve) =>
    {
      console.log(query);
      if (query.length <= 1)
      {
        resolve([])
      } else
      {
        searchStock(query).then((res) =>
        {
          if (res.success)
          {
            resolve(res.data.result.map((data) =>
            {
              return {
                value: data.symbol,
                name: data.displaySymbol,
                ...data
              }
            }))
          } else
          {
            resolve([])
          }
        }).catch((err) =>
        {
        })
      }
    })
  }

  const options = [
  ];

  return (
    <React.Fragment>
      <Container>
        {/* <div className="text-muted ">Search</div> */}

        <div className="d-flex my-3 w-100 justify-content-center my-1">

          <SelectSearch
            debounce={500}
            search
            getOptions={getOptions}
            options={options}
            // onSelect={(value, option) => {
            //   onCellClicked(value)
            // }}
            // emptyMessage="Empty"
            renderOption={(optionProps, optionData) =>
            {
              console.log(optionProps, optionData);
              if (optionData)
              {
                return (<div className="select-search__row_custom text-white p-2 rounded-3" value={optionData.value} onClick={(e) =>
                {
                  console.log(e)
                  e.preventDefault();
                  onCellClicked(optionData.value);
                  optionProps.onMouseDown(e)
                }}>
                  <span>
                    {optionData.description}
                    <br />
                    <span className="text-muted ">
                      {optionData.displaySymbol} {optionData.type && `(${optionData.type})`}
                    </span>
                  </span>

                </div>)
              }
            }}
            renderValue={(valueProps) => <FormControl className="bg-dark rounded-pill font-monospace" {...valueProps} />}
            value="sv"
            name="stockSymbol"
            placeholder="AAPL, GOOG, FB..." />

          {/* <Form.Control className="my-3 w-50" type="text" placeholder="search: AAAP, FB, GOOG.." name="searchQuery" value={searchQuery} onChange={handleSearch} /> */}
        </div>
        <div className="d-flex w-100 justify-content-center mb-3">

          <div className="ag-theme-alpine-dark px-2" style={{ height: 600, width: 850 }}>

            {/* Data table high frequency */}
            <AgGridReact
              ref={gridRef}
              getRowId={getRowId}
              rowData={data}
              asyncTransactionWaitMillis={1000}
              columnDefs={columnDefs}
              loadingCellRenderer={loadingCellRenderer}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady} // on grid ready function 
              animateRows={true}
            >
            </AgGridReact>
          </div>
          <div className="ag-theme-alpine-dark px-2" style={{ height: 600, width: 850 }}>

            {/* Data table high frequency */}
            <AgGridReact
              ref={simGridRef}
              getRowId={getRowId}
              rowData={simData}
              asyncTransactionWaitMillis={1000}
              columnDefs={columnDefs}
              loadingCellRenderer={loadingCellRenderer}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady} // on grid ready function 
              animateRows={true}
            >
            </AgGridReact>
          </div>
        </div>
        {/* </CenteredContainer> */}
      </Container>

    </React.Fragment>
  )
}

export default Home;