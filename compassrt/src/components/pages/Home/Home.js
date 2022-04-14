import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import CenteredContainer from '../../utils/Containers/CenteredContainer';
import io from "socket.io-client";

import './Home.scss';
const products = [
  {
    name: "p1",
    price: "0.02$",
    marketCap: "2,22,643$"
  },
  {
    name: "p2",
    price: "0.02$",
    marketCap: "2,22,643$"
  },
  {
    name: "p3",
    price: "0.02$",
    marketCap: "2,22,643$"
  },
  {
    name: "p4",
    price: "0.02$",
    marketCap: "2,22,643$"
  }
]

const columns = [{
  selector: (row,i) => i+1,
  name: '#'
},{
  selector: row => row.name,
  name: 'Name'
}, {
  selector: row => row.price,
  name: 'Current Price'
}, {
  selector: row => row.marketCap,
  name: 'Total Market Cap'
}];


const socket = io("http://localhost:9090", {transports: ['websocket']});

const Home = () => {

  const [data, setData] = useState([]);
  useEffect(() => {
    console.log(socket);
    socket.on("FromAPI", updatedData => {
      console.log(updatedData)
      setData(updatedData);
    });
  }, []);

  const conditionalRowStyles = [
    {
      when: row => Number(row.price.replace("$","")) >= 3,
      style: {
        backgroundColor: 'red',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
      
    },
    {
      when: row => Number(row.price.replace("$","")) > 1 && Number(row.price.replace("$","")) < 3,
      style: {
        backgroundColor: 'green',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
      
    },
    {
      when: row => Number(row.price.replace("$","")) <= 1,
      style: {
        backgroundColor: 'blue',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        },
      },
      
    },
  ]
  return (
    <React.Fragment>
      <div className="bg-black">
        <CenteredContainer>
          <div>
            <DataTable
              theme='dark'
              striped
              sortIcon={true}
              title="current market affairs"
              conditionalRowStyles={conditionalRowStyles}    
              columns={columns}
              data={data}
            />
          </div>
        </CenteredContainer>
      </div>
    </React.Fragment>
  )
}

export default Home;