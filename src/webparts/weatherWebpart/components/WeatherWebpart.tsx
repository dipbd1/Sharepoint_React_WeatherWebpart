import * as React from "react";
import styles from "./WeatherWebpart.module.scss";
import { IWeatherWebpartProps } from "./IWeatherWebpartProps";
import { IWeatherWebpartState } from "./IWeatherWebpartState";
import { escape } from "@microsoft/sp-lodash-subset";

import { HttpClient, HttpClientResponse } from "@microsoft/sp-http";
import { liProperties } from "office-ui-fabric-react";

//importing bootstrap designs
require("../../../../node_modules/bootstrap/dist/css/bootstrap.min.css");

export default class WeatherWebpart extends React.Component<
  IWeatherWebpartProps,
  IWeatherWebpartState
> {
  constructor(props: IWeatherWebpartProps, state: {}) {
    super(props);
    this.state = {
      time: "",
      weatherData: "",
      skyimage: "",
      location: "",
      weatherid: "",
      temperature: "",
      windspeed: "",
      humidity: "",
    };
  }

  public async componentDidMount(): Promise<void> {
    await this._getWeather();
    this._setTime();
    setInterval(() => {
      this._setTime();
    }, 1000);

    console.log(this.state);
  }

  // public async componentDidMount(): Promise<void> {

  //   const weatherData = await this._getWeather().then((response: any) => {
  //     // console.log(response)
  //     return response;
  //   });
  //   // console.log(weatherData);

  //   this.setState({
  //     weatherData: weatherData
  //   });
  // }

  // private async _getWeather(): Promise<any> {
  //   // this is the url to the web api
  //   const API_KEY = "068bf2ef240b122d76fc97705ef0f8ca";

  //   const url =
  //     "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=" +
  //     API_KEY;
  //   // this is the http service which will be used to make the http request
  //   return this.props.httpClient
  //   .get(url, HttpClient.configurations.v1,
  //     {
  //       headers: [
  //         ['accept', 'application/json']
  //       ]
  //     })
  //   .then((res: HttpClientResponse): Promise<any> => {
  //     return res.json();
  //   })
  //   .then((response: any): any => {
  //     // console.log("retuernd data from weather api");
  //     // console.log(response);
  //     return response;
  //   });

  // }

  private _setTime(): void {
    // setting time
    var today = new Date(),
      time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.setState({
      time: time,
    });
  }

  private async _getWeather() {
    // replace this line with your own api key
    const API_KEY = "";

    console.log(this.props.description);
    const info = await this.props.httpClient
      .get(
        "https://ipinfo.io/?token=6e0503bd3f779a",
        HttpClient.configurations.v1
      )
      .then((response: any) => {
        return response;
      });
    const locinfo = await info.json();
    var locString = locinfo.loc.split(",");
    var latitude = parseFloat(locString[0]);
    var longitude = parseFloat(locString[1]);
    const weather = await this.props.httpClient.get(
      "https://cors.5apps.com/?uri=http://api.openweathermap.org/data/2.5/weather?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&units=metric&APPID=" +
        API_KEY,
      HttpClient.configurations.v1
    );
    const weatherinfo = await weather.json();
    var windSpeedkmh = Math.round(weatherinfo.wind.speed * 3.6);
    var Celsius = Math.round(weatherinfo.main.temp);
    var iconId = weatherinfo.weather[0].icon;
    var weatherURL = "http://openweathermap.org/img/w/" + iconId + ".png";
    this.setState({
      weatherData: locinfo,
      skyimage: weatherURL,
      // location: locinfo.city + ', ' + locinfo.region + ', ' + locinfo.country,
      location: locinfo.city,
      weatherid: weatherinfo.weather[0].description,
      temperature: Celsius.toString(),
      windspeed: windSpeedkmh + " km/hr",
      humidity: weatherinfo.main.humidity,
    });
    console.log("Weather data fetching function triggered");

    // setting time
    var today = new Date(),
      time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    this.setState({
      time: time,
    });
  }

  public render(): React.ReactElement<IWeatherWebpartProps> {
    const {
      // description,
      // isDarkTheme,
      // environmentMessage,
      hasTeamsContext,
      // userDisplayName
    } = this.props;

    return (
      <section
        className={` vh-100 ${styles.weatherWebpart} ${
          hasTeamsContext ? styles.teams : ""
        }`}
        style={{ backgroundColor: "#4B515D" }}
      >
        {/* <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
          <h2>Well done, {escape(userDisplayName)}!</h2>
          <div>{environmentMessage}</div>
          <div>Web part property value: <strong>{escape(description)}</strong></div>
        </div>
        <div>
          <h3>Welcome to SharePoint Framework!</h3>
          <p>
            The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It's the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.
          </p>
          <h4>Learn more about SPFx development:</h4>
          <ul className={styles.links}>
            <li><a href="https://aka.ms/spfx" target="_blank">SharePoint Framework Overview</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-graph" target="_blank">Use Microsoft Graph in your solution</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-teams" target="_blank">Build for Microsoft Teams using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-viva" target="_blank">Build for Microsoft Viva Connections using SharePoint Framework</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-store" target="_blank">Publish SharePoint Framework applications to the marketplace</a></li>
            <li><a href="https://aka.ms/spfx-yeoman-api" target="_blank">SharePoint Framework API reference</a></li>
            <li><a href="https://aka.ms/m365pnp" target="_blank">Microsoft 365 Developer Community</a></li>
          </ul>
        </div> */}

        {this.state.weatherData !== "" && (
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-md-8 col-lg-6 col-xl-4">
                <div
                  className="card"
                  style={{ color: "#4B515D", borderRadius: "35px" }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex">
                      <h6 className="flex-grow-1">{this.state.location}</h6>
                      <h6>{this.state.time}</h6>
                    </div>

                    <div className="d-flex flex-column text-center mt-5 mb-4">
                      <h6
                        className="display-4 mb-0 font-weight-bold"
                        style={{ color: "#1C2331" }}
                      >
                        {" "}
                        {this.state.temperature}°C{" "}
                      </h6>
                      <span className="small" style={{ color: "#868B94" }}>
                        {this.state.weatherid}
                      </span>
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1" style={{ fontSize: "1rem" }}>
                        <div>
                          <i
                            className="fas fa-wind fa-fw"
                            style={{ color: "#868B94" }}
                          ></i>{" "}
                          <span className="ms-1"> {this.state.windspeed}</span>
                        </div>
                        <div>
                          <i
                            className="fas fa-tint fa-fw"
                            style={{ color: "#868B94" }}
                          ></i>{" "}
                          <span className="ms-1"> {this.state.humidity}% </span>
                        </div>
                        {/* <div><i className="fas fa-sun fa-fw" style={{ color: '#868B94' }}></i> <span className="ms-1"> 0.2h </span>
                      </div> */}
                      </div>
                      <div>
                        {/* <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                        width="100px" /> */}
                        <img src={this.state.skyimage} width="100px" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
}
