import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";
import { OrbitControls } from "OrbitControls";

console.log("✅ main.js iniciado");

// Escena
const container = document.getElementById("modelo3d-canvas");
const scene = new THREE.Scene();
scene.background = new THREE.Color("red"); // Prueba visual

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  100
);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// Controles
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 1.0));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);
scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.6));

// Video
const video = document.createElement("video");
video.src = "https://menutechdeveloper.github.io/bddImg/assets/iconos/phone.mp4";
video.crossOrigin = "anonymous";
video.loop = true;
video.muted = true;

const videoTexture = new THREE.VideoTexture(video);
videoTexture.encoding = THREE.sRGBEncoding;
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBAFormat;
videoTexture.flipY = false;

video.onloadeddata = () => {
  console.log("✅ videoLoaded");
  video.play();
  videoTexture.needsUpdate = true;
};

// Modelo
const loader = new GLTFLoader();
loader.load(
  "https://vikingantonio.github.io/bddCards/assets/celular.gltf",
  (gltf) => {
    console.log("✅ gltf cargado");

    const model = gltf.scene;
    const mesh = model.getObjectByName("Plane");

    if (mesh?.isMesh) {
      mesh.material = new THREE.MeshBasicMaterial({
        map: videoTexture,
        side: THREE.DoubleSide,
      });
      console.log("✅ material aplicado al mesh:", mesh.name);
    } else {
      console.warn("❌ mesh 'Plane' no encontrado");
    }

    scene.add(model);
  },
  undefined,
  (error) => console.error("❌ error cargando GLTF:", error)
);

// Resize
window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Animación
function animate() {
  requestAnimationFrame(animate);


