import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("modelo3d-canvas");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 1.0));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);
scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444, 0.6));

const video = document.createElement("video");
video.src = "https://menutechdeveloper.github.io/bddImg/assets/iconos/phone.mp4";
video.crossOrigin = "anonymous";
video.loop = true;
video.muted = true;
video.play().catch(e => console.warn("Video play error:", e));

const videoTexture = new THREE.VideoTexture(video);
videoTexture.encoding = THREE.sRGBEncoding;
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBAFormat;
videoTexture.flipY = false;

const loader = new GLTFLoader();
loader.load(
  "https://vikingantonio.github.io/bddCards/assets/celular.gltf",
  (gltf) => {
    const model = gltf.scene;
    const mesh = model.getObjectByName("Plane");
    if (mesh?.isMesh) {
      mesh.material = new THREE.MeshStandardMaterial({
        map: videoTexture,
        side: THREE.DoubleSide,
        emissive: 0xffffff,
        emissiveMap: videoTexture
      });
      console.log("✅ Video aplicado a:", mesh.name);
    }
    scene.add(model);
  },
  undefined,
  (err) => console.error("Error cargando GLTF:", err)
);

window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();
