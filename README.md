# Nuxt (Unovis|📊Dimensional chart) Dashboard Template with Nuxt UI Pro

Get started with the Nuxt 3 dashboard template with multiple pages, collapsible sidebar, keyboard shortcuts, light & dark more, command palette and more, powered by the [Nuxt UI Pro](https://ui.nuxt.com/getting-started/installation/pro/nuxt) UI Library.

- There are two types of dashboards:

## 1. Dashboard with [unovis](https://unovis.dev/)
[Live Demo](https://dashboard-template.nuxt.dev)

<a href="https://dashboard-template.nuxt.dev" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/57f6d964-a76c-4662-96b2-17622fb18d40">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/c4c87f77-d10a-4731-9b7c-0cd0ff4821d7">
    <img alt="Vue Dashboard with Nuxt UI Pro" src="https://github.com/user-attachments/assets/c4c87f77-d10a-4731-9b7c-0cd0ff4821d7">
  </picture>
</a>


## 2. Dashboard with 📊[Dimensional chart](http://dc-js.github.io/dc.js/)
[Live demo](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=covid19-data-2021-02-28)

[![img.png](doc/img/nuxt-dashboard-covid19.png)](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=covid19-data-2021-02-28)

### 📊[Dimensional chart](http://dc-js.github.io/dc.js/) can be switched and compared with one click, making it easy to analyze in multiple dimensions.
![image](https://github.com/yoshinaga-ken/laravel-vue-dashboard-dc/raw/main/doc/img/covid19-dc-demo-v1.gif)


### Dimensional Chart Features
- Dashboard Mode: 📊Chart | <img src="public/img/google-map-48.png" width="16">GoogleMap | <img src="public/img/icons8-street-view-60.png" width="16">StreetView | <img src="public/img/yutube.gif" width="16">YouTube
  <details>
    <summary>Expand for details</summary>
    <div style="display: flex; gap: 10px; text-align: center;">
      <div>
        <a href="https://sakanaclub.xsrv.jp/dc/covid19/data=covid19-data-2021-02-28&layout=default">
          <div>📊Chart mode</div>
          <img src="https://github.com/yoshinaga-ken/laravel-vue-dashboard-dc/raw/main/doc/img/dashboard-mode-chart.png" alt="Chart Image">
        </a>
      </div>
      <div>
        <a href="https://sakanaclub.xsrv.jp/dc/covid19/data=ja-quake-noto-safety&layout=gmap">
          <div>
              <img src="public/img/google-map-48.png" width="20">GoogleMap mode
          </div>
          <img src="https://github.com/yoshinaga-ken/laravel-vue-dashboard-dc/raw/main/doc/img/dashboard-mode-gmap.png" alt="Google Map Image">
        </a>
      </div>
      <div>
        <a href="https://sakanaclub.xsrv.jp/dc/covid19/data=ja-quake-noto-safety&layout=sview">
          <div>
              <img src="public/img/icons8-street-view-60.png" width="20">StreetView mode
          </div>
          <img src="https://github.com/yoshinaga-ken/laravel-vue-dashboard-dc/raw/main/doc/img/dashboard-mode-sview.png" alt="Street View Image">
        </a>
      </div>
      <div>
        <a href="https://sakanaclub.xsrv.jp/dc/covid19/data=game-fc&layout=tube">
          <div>
            <img src="public/img/yutube.gif" width="20">YouTube mode
          </div>
          <img src="https://github.com/yoshinaga-ken/laravel-vue-dashboard-dc/raw/main/doc/img/dashboard-mode-tube.png" alt="YouTube Image">
        </a>
      </div>
    </div>
  </details>
- Time ▶️Play Function
    <details>
      <summary>Expand for details</summary>
      <div>
        <div>
          <a href="https://sakanaclub.xsrv.jp/dc/covid19/data=resas-tourism-foreigners">
          e.g. Changes in the number of foreign tourists visiting Japan
          </a>
        </div>
        <img src="https://github.com/yoshinaga-ken/laravel-vue-dashboard-dc/raw/main/doc/img/dashboard-time-play.gif" alt="Chart Image">
      </div>
    </details>
- [Articles Dashboard](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc?data=test-article-like)
- [Dashboard with many more dimensional charts](#link-dc-demo)

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm run build
```

Locally preview production build:

```bash
# pnpm
pnpm run preview
```

<a id="link-dc-demo"></a>
## 📊Dimensional chart demo for other fields
[Details chart data](./public/data/README.md)
- [List of missing persons due to Noto Peninsula earthquake @2024/1/1](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-quake-noto-safety.csv)
- [Tokyo gubernatorial election votes by candidate @2024/7/7](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-tokyo-gubernatorial-election.csv)
- 📺🎮Tv Game in Japan
  - home video game consoles 
    - [4th generation](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-gen4.csv)
      - [NES](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-fc.csv) | [SNES](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-smc.csv) | [Genesis](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-smd.csv) | [TurboGrafx-16](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-pce.csv)
    - [3~5th generatio](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-gen3.csv)
    - 5th generation
      - [NINTENDO64](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-n64.csv) | [Playstation1](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-ps1.csv) | [SEGA SATURN](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-ss) | [NEOGEO](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-ac.csv&name=SNK&date=1990-01-01+2005-01-01)
    - 6th generation
      - [Game Cube](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-gc) | Xbox | PlayStation 2 | Dreamcast
    - 7th generation
      - [Wii](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-wii) | Xbox 360 | PlayStation 3
  - Handheld game consoles
    - [Game Boy](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-gb.csv) | [Game Boy Advance](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-gba.csv) | Nintendo DS | PSP | Nintendo Switch
  - [Arcade Video games 1974～2024](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-ac.csv)
  - Personal computer
    - [MSX](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=game-msx.csv)
- Weather
  - [Changes in "🌡️ Average Temperature" in major 12 cities in Japan @1986~(40 Years)](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature)
  - [Changes in "☔ Precipitation" in major 12 cities in Japan @1986~(40 Years)](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation.csv)
  - [Changes in "🌡️ Average Temperature" in major 3 cities in Japan @1872~(153 Years)](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-temperature-3)
  - [Changes in "☔ Precipitation" in major 3 cities in Japan @1872~(153 Years)](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=ja-weather-precipitation-3)
- Sports
  - [⚾List of High School Baseball Championship in Japan](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=sports-hsb.csv)
  - [🏸Trends in sports circle participation](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=checkin-sakana)
- Food
  - [🍜List of Ramen in Japan](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=food-ramen.csv)
- Market Analysis
  - [Number of Supermarket Stores](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-cnt)
  - [Supermarket Business Trends](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=store-di)
- Regional Economic Analysis
  - [「Agricultural output by product」2016～2021 @japan](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-agriculture.csv)
  - [「Number of visitors by nationality to designated regions」1994～2021](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-tourism-foreigners.csv)
  - [「Annual product sales」1994～2021 @japan](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-product-sales.csv)
  - [「Number of companies (by city, town, village, industry classification, and industry)」2009～2016 @japan](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=resas-municipality-company.csv)
  - [population composition @japan](https://sakanaclub.xsrv.jp/prefecture-population-dc/?data=population.csv)
- Samples
  - [Number of 👍likes for the 📄article](https://sakanaclub.xsrv.jp/laravel-sports-hp/public/index.php/dashboard-dc-pub?data=test-article-like)

## Related Repos
- [Vue Dashboard Template](https://github.com/nuxt-ui-pro/dashboard-vue) 
  - fork
- [laravel-vue-dashboard-dc](https://github.com/yoshinaga-ken/laravel-vue-dashboard-dc)
  - DcChart.vue component for dashboard
- [covid19-dc](https://github.com/yoshinaga-ken/covid19-dc)

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
