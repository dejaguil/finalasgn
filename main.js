import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GUI } from 'lil-gui';



class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio);

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.5;
  const far = 500;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 2, 10);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const scene = new THREE.Scene();

  
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-5, 5, 5);
  scene.add(dirLight);


  const pointLight = new THREE.PointLight(0xff0000, 1, 50);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);



const gui = new GUI();


gui.addColor(new ColorGUIHelper(ambientLight, 'color'), 'value').name('Ambient Color');
gui.add(ambientLight, 'intensity', 0, 5, 0.01);


gui.addColor(new ColorGUIHelper(dirLight, 'color'), 'value').name('Directional Color');
gui.add(dirLight, 'intensity', 0, 5, 0.01);


gui.addColor(new ColorGUIHelper(hemiLight, 'color'), 'value').name('Hemisphere Sky');
gui.addColor(new ColorGUIHelper(hemiLight, 'groundColor'), 'value').name('Hemisphere Ground');
gui.add(hemiLight, 'intensity', 0, 5, 0.01);
const loader = new THREE.TextureLoader();
const pufferTexture = loader.load('public/pufferfish1.jpg');
const coralTexture = loader.load('public/coral.jpg');
const jellyTexture = loader.load('public/jellyfish.jpg');
jellyTexture.colorSpace = THREE.SRGBColorSpace;
const texture = loader.load('public/flower.jpg');
const bgTexture = loader.load('public/underwater.jpg');
bgTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = bgTexture;
texture.colorSpace = THREE.SRGBColorSpace;


  
  const cubes = [];
  for (let i = 0; i < 7; i++) {
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshPhongMaterial({ map: jellyTexture })
    );
    cube.position.set(
  Math.random() * 20 - 10,  
  Math.random() * 5,        
  Math.random() * 20 - 10   
);
    scene.add(cube);
    cubes.push(cube);
  }


for (let i = 0; i < 7; i++) {
  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.75, 32, 32),
    new THREE.MeshPhongMaterial({ map: pufferTexture })
  );
sphere.position.set(
  Math.random() * 20 - 10,  
  Math.random() * 5,        
  Math.random() * 20 - 10   
);
  scene.add(sphere);
  cubes.push(sphere);
}


  for (let i = 0; i < 5; i++) {
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 2, 32),
     new THREE.MeshPhongMaterial({ map: coralTexture })
    );
    cylinder.position.set(
    Math.random() * 20 - 10,
    0.2,
    Math.random() * 20 - 10
  );
  scene.add(cylinder);
}


for (let i = 0; i < 20; i++) {
  const pebble = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0xAAAAAA })
  );
  pebble.scale.y = 0.5;  
  pebble.position.set(
    Math.random() * 20 - 10,
    0.2,
    Math.random() * 20 - 10
  );
  scene.add(pebble);
}


const bubbleClones = [];

for (let i = 0; i < 50; i++) {
  const bubble = new THREE.Mesh(
    new THREE.SphereGeometry(0.20, 16, 16),
    new THREE.MeshPhongMaterial({ color: 0x99ccff, transparent: true, opacity: 0.5 })
  );
  bubble.position.set(
    Math.random() * 20 - 10,
    Math.random() * 8 + 2,
    Math.random() * 20 - 10
  );
  scene.add(bubble);
  bubbleClones.push(bubble); 
}

const seaweedTexture = loader.load('public/seaweed.jpg');
seaweedTexture.colorSpace = THREE.SRGBColorSpace;


const seaweedClones = [];

for (let i = 0; i < 15; i++) {
  const seaweedGroup = new THREE.Group();

  let numSegments = 6 + Math.floor(Math.random() * 3); 
  let yOffset = 0;

  for (let j = 0; j < numSegments; j++) {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(
        0.25 - j * 0.06,  
        1 + Math.random() * 0.5,  
        8
      ),
      new THREE.MeshPhongMaterial({ map: seaweedTexture })
    );

    cone.position.y = yOffset;
    cone.rotation.z = (Math.random() - 0.5) * 0.2;
    cone.rotation.x = (Math.random() - 0.5) * 0.1;
    seaweedGroup.add(cone);

    yOffset += cone.geometry.parameters.height;
  }

  seaweedGroup.position.set(
    Math.random() * 20 - 10,
    0,
    Math.random() * 20 - 10
  );

  scene.add(seaweedGroup);
  seaweedClones.push(seaweedGroup);  
}



const fbxLoader = new FBXLoader();
const duckClones = [];

function loadAndSpawnFBX(path, scaleValue, count = 3) {
  fbxLoader.load(path, (fbx) => {
    console.log("Loaded FBX:", path, fbx);

    const group = new THREE.Group();
    let meshCount = 0;

    fbx.traverse(function (child) {
      if (child.isMesh) {
        console.log("Found mesh:", child);
        meshCount++;

        child.frustumCulled = false;
        child.material.side = THREE.DoubleSide;

        group.add(child.clone());
      }
    });

    if (meshCount === 0) {
      console.warn("NO MESH FOUND in:", path);
      return;
    }

    group.scale.set(scaleValue, scaleValue, scaleValue);
    group.position.set(
      Math.random() * 20 - 10,
      Math.random() * 5,
      Math.random() * 20 - 10
    );
    scene.add(group);
    duckClones.push(group); 

    for (let i = 0; i < count - 1; i++) {
      const clone = group.clone();
      clone.position.set(
        Math.random() * 60 - 30,
        Math.random() * 10,
        Math.random() * 60 - 30
      );
      clone.rotation.y = Math.random() * Math.PI * 2;
      scene.add(clone);
      duckClones.push(clone);  
    }

  }, undefined, (error) => {
    console.error(`Error loading ${path}:`, error);
  });
}


loadAndSpawnFBX('/ducky.fbx', 0.10, 8);


const texturedCube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshPhongMaterial({ map: texture })
);
texturedCube.position.set(0, 4, 0);
scene.add(texturedCube);

function animate(time) {
  time *= 0.001;


  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

 
duckClones.forEach((duck, idx) => {
  duck.position.x += Math.sin(time * 0.6 + idx) * 0.02;
  duck.position.z += Math.cos(time * 0.6 + idx) * 0.02;
});
  bubbleClones.forEach((bubble, idx) => {
  bubble.position.y += 0.02; 
  if (bubble.position.y > 15) { 
    bubble.position.y = 0; 
  }
});
seaweedClones.forEach((seaweed, idx) => {
  seaweed.rotation.z = Math.sin(time + idx) * 0.4;
});
cubes.forEach((shape, idx) => {
  shape.position.x += Math.sin(time * 0.5 + idx) * 0.010;
  shape.position.z += Math.cos(time * 0.5 + idx) * 0.010;
  shape.rotation.y += 0.005;  
});


  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


requestAnimationFrame(animate);

}


main();