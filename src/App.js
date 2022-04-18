import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";

import "./App.css";
function App() {
  const [searchReulst, setSearchReulst] = useState([]);
  const [data, setData] = useState([]);
  const columns = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "phone_number", headerName: "Phone", width: 150 },
    {
      field: "age",
      headerName: "Age",
      width: 150,
      valueGetter: (params) =>
        `${calculateAge(params.row.birthday.substr(0, 19))}`,
    },
    { field: "address", headerName: "Address", width: 150 },
    {
      field: "image",
      headerName: "Portrait picture",
      width: 150,
      renderCell: (params) => {
        console.log(params);
        if (params.row.picture)
          return (
            <img
              className="userProfile"
              src={require(`./images/${params.row.picture}`)}
              alt="User Pic"
            />
          );
        else return null;
      },
    },
  ];

  useEffect(() => {
    getBackEndData();
  }, []);

  const getBackEndData = () => {
    fetch("https://yellow-page-server.herokuapp.com/")
      .then((res) => res.json())
      .then((data) => {
        data.map((s, i) => (s.id = i + 1));
        console.log(data);
        setData(data);
      });
  };

  const splitSearchText = (searchText) => {
    const searchTextArray = searchText.split(" ");
    let splitText = { phone_number: "", age: "", name: "" };
    if (searchTextArray.length >= 1) {
      searchTextArray.forEach((element) => {
        if (/^\d+$/.test(element)) {
          element.length > 2
            ? (splitText.phone_number = element)
            : (splitText.age = element);
        } else {
          splitText.name = element;
        }
      });
    }
    return splitText;
  };

  function calculateAge(birthday) {
    var ageDifMs = Date.now() - Date.parse(birthday);
    var ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  const search = (searchText) => {
    const splitText = splitSearchText(searchText);
    const searchResult = data.filter((element) => {
      if (splitText.phone_number) {
        return element.phone_number.includes(splitText.phone_number);
      } else if (splitText.age) {
        let years = calculateAge(element.birthday.substr(0, 19));
        return years === parseInt(splitText.age);
      } else if (splitText.name) {
        return element.name.includes(splitText.name);
      }
      return [];
    });
    setSearchReulst(searchResult);
  };

  return (
    <div className="pageWrapper">
      <header className="headerWrapper">
        <h1>Online Yellow Pages</h1>
        <div className="searchBarWrapper">
          <TextField
            id="outlined-basic"
            label="Search Bar"
            onChange={(e) => {
              search(e.target.value);
            }}
            variant="outlined"
            className="searchBar"
          />
        </div>
      </header>
      <div className="tableWrapper">
        {searchReulst.length > 0 ? (
          <DataGrid
            rows={searchReulst}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        ) : (
          <div className="noData">
            No results, please review your search or try a different one
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
