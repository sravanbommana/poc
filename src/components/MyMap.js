import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { baseUrl, endpoints } from "../constants/constan";
import axios from "axios";

require("highcharts/modules/map")(Highcharts);

class MyMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapData: null
    };
    // preparing the config of map with empty data
    this.options = {
      title: {
        text: "Widget click by location",
        style: {
          color: "#fff"
        }
      },
      chart: {
        backgroundColor: "transparent",
        type: "map",
        map: null
      },
      mapNavigation: {
        enabled: true,
        enableButtons: false
      },
      credits: {
        enabled: false
      },
     
      tooltip: {
        pointFormatter: function() {
          return this.name;
        }
      },
      series: [
        {
          name: "usa map",
          dataLabels: {
            enabled: true,
            color: "#FFFFFF",
            format: "{point.postal-code}",
            style: {
              textTransform: "uppercase"
            }
          },
          tooltip: {
            ySuffix: " %"
          },
          cursor: "pointer",
          joinBy: "postal-code",
          data: [],
          point: {
            events: {
              click: function(r) {
                console.log("click - to open popup as 2nd step");
                console.log(r);
              }
            }
          }
        }
      ]
    };
  }
  async componentDidMount() {
    this.getData();
  }

  getData = async() => {
      try {
        const url = baseUrl + endpoints.getUsData;
        const response = await axios.get(url);
        const data = response.data;
        this.setState({ mapData: data }, () => {
          this.options.series[0].data = []; //make sure data is empty before  fill
          this.options["chart"]["map"] = this.state.mapData; // set the map data of the graph (using the world graph)
  
          // filling up some dummy data with values 1 and 2
          // instead of using the google sheet
          for (let i in this.state.mapData["features"]) {
            let mapInfo = this.state.mapData["features"][i];
            if (mapInfo["id"]) {
              var postalCode = mapInfo.properties["postal-code"];
  
              var name = mapInfo["properties"]["name"];
              var value = (i % 2) + 1;
              var type = value === 1 ? "widget name one" : "widget name two";
              var row = i;
              this.options.series[0].data.push({
                value: value,
                name: name,
                "postal-code": postalCode,
                row: row,
                type: type
              });
            }
          }
          // updating the map options
          this.setState({ mapOptions: this.options });
        });
      }
      catch(error) {
        console.log(error);
      }
  }
  render() {
    return (
      <div>
        {this.state.mapOptions ? (
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"mapChart"}
            options={this.state.mapOptions}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default MyMap;
