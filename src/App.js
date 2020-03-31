import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.scss';
import VirtualisedTable from './VirtualisedTable';

function App() {
  const [exoplanetsData, setExoplanetsData] = useState({ data: [], isFetching: false })
  const [sortCriteria, setSortCriteria] = useState({ columnId: 'pl_hostname', order: 'asc' })
  const EXOPLANETS_API = `https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&format=json`

  const columns = [
    {
      id: 'pl_hostname',
      description: 'Host Star Name',
      isSortable: true,
      isPrimaryInfo: true,
    },
    {
      id: 'pl_name',
      description: 'Planet Name',
      isSortable: true,
      isPrimaryInfo: true,
    },
    {
      id: 'pl_discmethod',
      description: 'Discovery Method',
      isSortable: false,
      isPrimaryInfo: true,
    },
    {
      id: 'pl_orbper',
      description: 'Orbital Period (days)',
      isSortable: false,
      isPrimaryInfo: false,
    },
    {
      id: 'pl_bmassj',
      description: 'Planet Mass or M*sin(i) [Jupiter mass]',
      isSortable: false,
      isPrimaryInfo: false,
    },
    {
      id: 'pl_radj',
      description: 'Planet Radius (Jupiter radii)',
      isSortable: false,
      isPrimaryInfo: false,
    },
    {
      id: 'pl_dens',
      description: 'Planet Density (g/cm**3)',
      isSortable: false,
      isPrimaryInfo: false,
    },
    {
      id: 'st_dist',
      description: 'Distance (pc)',
      isSortable: true,
      isPrimaryInfo: true,
    },
    {
      id: 'st_teff',
      description: 'Effective Temp. (K)',
      isSortable: true,
      isPrimaryInfo: true,
    },
  ]

  const toggleSortCriteria = (columnId) => {
    if (columnId === sortCriteria.columnId) {
      setSortCriteria({ columnId, order: sortCriteria.order === 'asc' ? 'desc' : 'asc' })
    } else {
      setSortCriteria({ ...sortCriteria, columnId })
    }
  }

  useEffect(() => {
    const fetchExoplanetsData = async () => {
      try {
        setExoplanetsData(exoplanetsData => ({ ...exoplanetsData, isFetching: true }))
        let response = await axios.get(`${EXOPLANETS_API}&order=${sortCriteria.columnId}${sortCriteria.order==='desc' ? '%20desc': ''}`)
        let { data } = response
        console.log('data--- :', data);

        // The API responds with a 200 status code even with errors
        if(typeof data!=='object' && data.substr(0,5) === "ERROR"){
          throw new Error("Server Response Error")
        }

        setExoplanetsData({ data, isFetching: false })
      } catch (error) {
        setExoplanetsData(exoplanetsData => ({ ...exoplanetsData, isFetching: false }))
        // Log Error to Logger
      }
    }

    fetchExoplanetsData();
  }, [EXOPLANETS_API, sortCriteria]);

  return (
    <div className="App">
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
        <h5 className="my-0 mr-md-auto font-weight-normal">Exoplanets Explorer</h5>
      </div>
      <VirtualisedTable
        columns={columns}
        data={exoplanetsData.data}
        dataLoading={exoplanetsData.isFetching}
        sortCriteria={sortCriteria}
        toggleSortCriteria={toggleSortCriteria}
      />
    </div>
  );
}

export default React.memo(App);
