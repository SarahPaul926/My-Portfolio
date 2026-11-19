// 1. CLEAN REUSE SYSTEM IMPORTS (Prevents multiple instances warning logs)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Global shared asset loader instance
const loader = new GLTFLoader();

// ============================================================================
// 🌍 APP 1: GLOBAL BACKGROUND SCROLL LEAF
// ============================================================================
const leafCanvas = document.getElementById("leaf-canvas");
const leafScene = new THREE.Scene();

const leafCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
leafCamera.position.z = 3;

const leafRenderer = new THREE.WebGLRenderer({
    canvas: leafCanvas,
    alpha: true,
    antialias: true
});
leafRenderer.setSize(window.innerWidth, window.innerHeight);
leafRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Background Lighting Context
const leafAmbient = new THREE.AmbientLight(0xffffff, 2.0);
leafScene.add(leafAmbient);
const leafDirectional = new THREE.DirectionalLight(0xffffff, 2.5);
leafDirectional.position.set(2, 3, 5);
leafScene.add(leafDirectional);

// Load Leaf Geometry
let leaf;
loader.load(
    "Models/autumn-leaf.glb",
    function (gltf) {
        console.log("App 1: Leaf Asset Parsed Successfully!");
        leaf = gltf.scene;
        leaf.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.alphaTest = 0.5;
            }
        });
        leaf.scale.set(5, 5, 5);
        
        const box = new THREE.Box3().setFromObject(leaf);
        const center = box.getCenter(new THREE.Vector3());
        leaf.position.sub(center);
        leaf.position.set(2, 0, 0); // Start top right

        leaf.rotation.set(1, 1, 0);
        leafScene.add(leaf);
    },
    undefined,
    function (error) { console.error("Error parsing background leaf:", error); }
);

// Capture Page Timeline Progression Metrics
let scrollProgress = 0;
window.addEventListener("scroll", () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0) {
        scrollProgress = window.scrollY / maxScroll;
    }
});

