import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import tierra from "../img/earth_nasa_2012_2000x1000_alt.jpg";
import plantilla from "../img/circle.png";
import { parseTleFile, getPositionFromTle } from "./tle";

let hoy = new Date();

const defaultOptions = {
  backgroundColor: 0x111110,
  defaultSatelliteColor: 0xff0000
};

const defaultStationOptions = {
  orbitMinutes: 0,
  satelliteSize: 50,
};

export class Sats {
  stations = [];
  targetList = [];

  resetView() {
    this.camera.position.z = -45000;
    this.camera.position.y = 15000;
    this.camera.position.x = 45000;
    this.camera.lookAt(0, 0, 0);
    this.render();
  }

  quitarSatelites() {
    this.scene.remove.apply(this.scene, this.scene.children);

    this.stations = [];
    const sun = new THREE.PointLight(0xffffff, 1, 0);
    sun.position.set(0, 0, -149400000);
    const ambient = new THREE.AmbientLight(0x909090);
    this.scene.add(sun);
    this.scene.add(ambient);

    const textLoader = new THREE.TextureLoader();
    const group = new THREE.Group();

    let geometry = new THREE.SphereGeometry(6371, 50, 50);
    let material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      flatShading: false,
      map: textLoader.load(tierra, this.render),
    });

    const earth = new THREE.Mesh(geometry, material);
    group.add(earth);

    this.earth = group;
    this.scene.add(this.earth);

    this.render();
  }

  initialize(container, options = {}) {
    this.vista = container;
    this.raycaster = new THREE.Raycaster();
    this.options = { ...defaultOptions, ...options };

    const width = 800;
    const height = 400;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(54, width / height, 1e-6, 1e27);
    this.controls = new OrbitControls(this.camera, this.vista);
    this.controls.enablePan = false;
    this.controls.addEventListener("change", () => this.render());
    this.camera.position.z = -45000;
    this.camera.position.y = 15000;
    this.camera.position.x = 45000;
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true,
      antialias: true,
    });

    this.renderer.setClearColor(new THREE.Color(this.options.backgroundColor));
    this.renderer.setSize(width, height);

    this.vista.appendChild(this.renderer.domElement);

    const sun = new THREE.PointLight(0xffffff, 1, 0);
    sun.position.set(0, 0, -149400000);
    const ambient = new THREE.AmbientLight(0x909090);
    this.scene.add(sun);
    this.scene.add(ambient);

    const textLoader = new THREE.TextureLoader();
    const group = new THREE.Group();

    let geometry = new THREE.SphereGeometry(6371, 50, 50);
    let material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      flatShading: false,
      map: textLoader.load(tierra, this.render),
    });

    const earth = new THREE.Mesh(geometry, material);
    group.add(earth);
    this.earth = group;
    this.scene.add(this.earth);
    this.render();
    window.addEventListener("resize", this.handleWindowResize);
  }

  dispose() {
    window.removeEventListener("resize", this.handleWindowResize);
    this.raycaster = null;
    this.vista = null;
    this.controls.dispose();
  }

  handleWindowResize = () => {
    const width = 800;
    const height = 400;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.render();
  };

  loadLteFileStations = (url, color, dictEstaciones, mostrarOrbita, stationOptions) => {
    const options = { ...defaultStationOptions, ...stationOptions };

    return fetch(url).then((res) => {
      if (res.ok) {
        return res.text().then((lteFileContent) => {
          const stations = parseTleFile(
            lteFileContent,
            dictEstaciones,
            options
          );

          const { satelliteSize } = options;

          stations.forEach((s) => {
            const SpriteScaleFactor = 5000;

            if (!this.material) {
              this._satelliteSprite = new THREE.TextureLoader().load(
                plantilla,
                this.render
              );
              this.material = new THREE.SpriteMaterial({
                map: this._satelliteSprite,
                color: color,
                sizeAttenuation: false,
              });
            }

            const result = new THREE.Sprite(this.material);

            result.scale.set(
              satelliteSize / SpriteScaleFactor,
              satelliteSize / SpriteScaleFactor,
              1
            );

            const sat = result;
            const pos = getPositionFromTle(s, hoy);
            if (!pos) return;

            sat.position.set(pos.x, pos.y, pos.z);
            s.mesh = sat;
            this.stations.push(s);

            // if (s.orbitMinutes > 0) this.addOrbit(s);
            if (stations.length <= 100 && mostrarOrbita) {
              this.addOrbit(s);
            }
            

            this.earth.add(sat);
          });

          this.render();

          return stations;
        });
      }
    });
  };

  addOrbit = (station) => {
    if (station.orbitMinutes > 0) return;

    const revsPerDay = station.satrec.no * (1440 / (2.0 * 3.141592654));
    const intervalMinutes = 1;
    const minutes = station.orbitMinutes || 1440 / revsPerDay;
    const initialDate = new Date();

    if (!this.orbitMaterial) {
      this.orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x999999,
        opacity: 0.5,
        transparent: true,
      });
    }

    var points = [];

    for (var i = 0; i <= minutes; i += intervalMinutes) {
      const date = new Date(initialDate.getTime() + i * 60000);

      const pos = getPositionFromTle(station, date);
      if (!pos) continue;

      points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    var orbitCurve = new THREE.Line(geometry, this.orbitMaterial);
    station.orbit = orbitCurve;

    this.earth.add(orbitCurve);
    this.render();
  };

  borraOrbitas = (estaciones) => {
    estaciones.forEach((s) => {this.removeOrbit(s)})   
  }

  removeOrbit = (station) => {
    if (!station || !station.orbit) return;

    this.earth.remove(station.orbit);
    station.orbit.geometry.dispose();
    station.orbit = null;
    station.mesh.material = this.material;
    this.render();


  };

  updateSatellitePosition = (station, date) => {
    date = date || hoy;

    const pos = getPositionFromTle(station, date);
    if (!pos) return;

    station.mesh.position.set(pos.x, pos.y, pos.z);
  };

  updateAllPositions = (date) => {
    if (!this.stations) return;

    this.stations.forEach((station) => {
      this.updateSatellitePosition(station, date);
    });

    this.render();
  };

  render = () => {
    this.renderer.render(this.scene, this.camera);
  };
}
