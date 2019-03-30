import React, { PureComponent } from 'react';
import { randomPoint } from '@turf/random';
import MapGL, { Source, Layer, CustomLayer } from '@urbica/react-map-gl';
import { MapboxLayer } from '@deck.gl/mapbox';
import { ScatterplotLayer } from '@deck.gl/layers';

import Container from './Container';
import Count from './Count';
import Text from './Text';

import 'mapbox-gl/dist/mapbox-gl.css';

const styleLeftMap = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: '50%'
};

const styleRightMap = {
  position: 'fixed',
  top: 0,
  left: 'calc(50% + 3px)',
  bottom: 0,
  right: 0
};


const deckLayer = new MapboxLayer({
  id: 'points',
  type: ScatterplotLayer,
  data: [],
  opacity: 0.8,
  filled: true,
  getPosition: d => d.geometry.coordinates,
  getRadius: 200000,
  getColor: [255, 0, 0]
});

class App extends PureComponent {
  state = {
    points: randomPoint(1000),
    count: 100,
    viewport: {
      latitude: 0,
      longitude: 0,
      zoom: 0
    }
  };

  updatePints = () => {
    const points = randomPoint(this.state.count);
    this.setState({ points });
    deckLayer.setProps({ data: points.features });
    window.requestAnimationFrame(this.updatePints);
  };

  componentDidMount() {
    window.requestAnimationFrame(this.updatePints);
  }

  render() {
    return (
      <Container>
        <Count>
          <div>Count: {this.state.count}</div>
          <div>
            <input
              type='range'
              value={this.state.count}
              onChange={(e) => { this.setState({ count: +e.target.value })}}
              min={0}
              max={30000}
              step={100}
            />
          </div>
        </Count>
        <Text style={{ left: 'calc(50% - 230px)'}}>
          Mapbox GL JS
        </Text>
        <Text style={{ right: 'calc(50% - 130px)'}}>
          deck.gl
        </Text>
        <MapGL
          key='left'
          style={styleLeftMap}
          mapStyle='mapbox://styles/mapbox/light-v9'
          accessToken='pk.eyJ1IjoiYm95dXJhcnRlbSIsImEiOiJjajBkeWY4ZmwwMDEyMzJseG8wZDI4YW5pIn0.DBEWyIXo3VknCRDcqa7Msg'
          onViewportChange={viewport => this.setState({ viewport })}
          onClick={() => this.setState(({ count }) => ({
            count: count + 1000
          }))}
          {...this.state.viewport}
        >
          <Source id='points' type='geojson' data={this.state.points} />
          <Layer
            id='points'
            type='circle'
            source='points'
            paint={{
              'circle-radius': 5,
              'circle-color': '#1978c8'
            }}
          />
        </MapGL>
        <MapGL
          key='right'
          style={styleRightMap}
          mapStyle='mapbox://styles/mapbox/light-v9'
          accessToken='pk.eyJ1IjoiYm95dXJhcnRlbSIsImEiOiJjajBkeWY4ZmwwMDEyMzJseG8wZDI4YW5pIn0.DBEWyIXo3VknCRDcqa7Msg'
          onViewportChange={viewport => this.setState({ viewport })}
          {...this.state.viewport}
        >
          <CustomLayer layer={deckLayer} />
        </MapGL>
      </Container>
    );
  }
}

export default App;
