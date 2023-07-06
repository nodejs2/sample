import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { apiData } from "./api";

class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: Array(47).fill(false),
      prefectures: {},
      series: [],
      loading: true,
    };
    this._changeSelection = this._changeSelection.bind(this);
  }

  async componentDidMount() {
    try {
      const {
        data: { result: locations },
      } = await apiData.locations();
      this.setState({ prefectures: locations });
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  _changeSelection(index) {
    const { selected, prefectures, series } = this.state;
    const selected_copy = selected.slice();
    selected_copy[index] = !selected_copy[index];

    const fetchApi = async (code) => {
      try {
        const {
          data: {
            result: { data: population },
          },
        } = await apiData.population(code);

        const total_population = population[0];
        let tmp = [];

        Object.keys(total_population.data).forEach((i) => {
          tmp.push(total_population.data[i].value);
        });
        const res_series = {
          name: prefectures[index].prefName,
          data: tmp,
        };
        this.setState({
          selected: selected_copy,
          series: [...series, res_series],
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (!selected[index]) {
      fetchApi(index);
    } else {
      const series_copy = series.slice();

      for (let i = 0; i < series_copy.length; i++) {
        if (series_copy[i].name === prefectures[index].prefName) {
          series_copy.splice(i, 1);
        }
      }
      this.setState({
        selected: selected_copy,
        series: series_copy,
      });
    }
  }

  renderItem(props) {
    const { selected } = this.state;
    return (
      <div
        key={props.prefCode}
        style={{ margin: "0.9rem", width: "100px", fontSize: "1.2rem" }}
      >
        <label>
          <input
            type="checkbox"
            checked={selected[props.prefCode - 1]}
            onChange={() => this._changeSelection(props.prefCode - 1)}
          />
          {props.prefName}
        </label>
      </div>
    );
  }

  render() {
    const { prefectures, series } = this.state;
    const obj = prefectures;
    const options = {
      chart: {
        type: "line",
      },
      title: {
        text: "人口推移",
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "top",
        itemMarginTop: 20,
        itemStyle: {
          fontSize: "15px",
        },
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
          pointInterval: 5,
          pointStart: 1975,
        },
      },
      yAxis: {
        labels: {
          formatter: function () {
            return this.value === 0 ? "" : this.value.toLocaleString() + "人";
          },
        },
        min: 0,
        gridLineColor: "transparent",
        tickWidth: 1,
        tickInterval: 500000,
        title: {
          text: "人口数",
          textAlign: "right",
          rotation: 0,
          x: 90,
          y: -170,
        },
        lineWidth: 1,
      },
      xAxis: {
        labels: {
          formatter: function () {
            return this.value + "年";
          },
        },
        title: {
          text: "年数",
        },
        tickInterval: 10,
      },
      series: series,
    };
    return (
      <div>
        <h1>人口の推移</h1>
        <div className="wrap">
          <p className="name">都道府県名</p>
          <div className="prefectures">
            {Object.keys(obj).map((i) => this.renderItem(obj[i]))}
          </div>
        </div>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}

export default App;
