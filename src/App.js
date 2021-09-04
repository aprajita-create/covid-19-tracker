import { FormControl, MenuItem, Select,Card, CardContent } from '@material-ui/core';
import React,{ useState ,useEffect} from 'react';
import './App.css';
import InfoBox from './InfoBox';
import Table from './Table'
import { sortData } from './util';
import LineGraph from './LineGraph';
import Map from './Map';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries]= useState([]);     //for data of respective countries
    const [country,setCountry] =useState("worldwide"); // for drop down sselect a county
    const [countryInfo,setCountryInfo] = useState([]);  //data of all country i.e woldwide
    const [tableData,setTableData]= useState([]);
    const [mapCenter,setMapCenter]=useState({lat:34.80746, lng:-40.4796})
    const [mapZoom,setMapZoom]=useState(3);
    const [mapCountries,setMapCountries]=useState([]);
   
   useEffect(() =>{
     fetch('https://disease.sh/v3/covid-19/all')
     .then(response => response.json())
     .then(data =>{
       setCountryInfo(data);
     });
   },[]);

   useEffect(() =>{
     //async->pings to server ,wait,& do something  
     const getCountriesData =async ()=> {
       await fetch("https://disease.sh/v3/covid-19/countries")
       .then((response) => response.json())
       .then((data) => {
         const countries =data.map((country) => (
           {
             name:country.country,  //INDIA
             value: country.countryInfo.iso2 //IN
           }));
          const sorted= sortData(data);
           setTableData(sorted);
           setCountries(countries);
           setMapCountries(data);
          });
     };
     getCountriesData();
   },[]);
      
   const changeCountry = async(event)=>{
     const countryCode = event.target.value;
    
     const url= countryCode==="worldwide"
     ?"https://disease.sh/v3/covid-19/all"
     :`https://disease.sh/v3/covid-19/countries/${countryCode}`
     await fetch(url)
     .then(response =>response.json())
     .then(data=>{
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(3);
        
     });
   };
   console.log(countryInfo)
  //html is returned
  return (
    <div className="app">
     <div className="app__left">
      <div className="app__header">
      <h1> Covid-19 Tracker</h1>
       <FormControl className="app__dropdown">
         <Select variant="outlined" onChange={changeCountry} value={country} >
         <MenuItem value="worldwide">Worldwide</MenuItem>
           {countries.map(country =>(
            <MenuItem value={country.value}>{country.name}</MenuItem>
           ))}
           
         </Select>
       </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
        <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/> 
      </div>
       <Map 
       countries={mapCountries}  center={mapCenter} zoom={mapZoom}/>
    </div>

    <Card className="app__right">
      <CardContent>
      <h3>Total Cases by Country</h3>
       <Table countries={tableData}/>
       <br/>
       <h3> Worldwide New Cases</h3>
       <LineGraph />
      </CardContent> 
    </Card>
   </div>
  );
}

export default App;

