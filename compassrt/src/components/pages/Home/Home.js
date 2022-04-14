import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import CenteredContainer from '../../utils/Containers/CenteredContainer';
import io from "socket.io-client";

import './Home.scss';

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


const socket = io("http://localhost:9090", {transports: ['websocket']}); // important thing is adding websocket transporter to using socket 

const Home = () => {
  const [data, setData] = useState([]);

  //use effect without dependencies will get executed at initial rendering
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